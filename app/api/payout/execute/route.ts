import { NextRequest, NextResponse } from 'next/server';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { 
  createTransferInstruction, 
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID 
} from '@solana/spl-token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      recipientAddress, 
      amount, 
      disasterEventId,
      userPublicKey,
      signedTransaction 
    } = body;

    if (!recipientAddress || !amount || !disasterEventId) {
      return NextResponse.json(
        { error: 'Missing required parameters: recipientAddress, amount, disasterEventId' },
        { status: 400 }
      );
    }

    const connection = new Connection(process.env.SOLANA_RPC_URL!);
    const treasuryAddress = new PublicKey(process.env.TREASURY_WALLET_ADDRESS!);
    const usdcMint = new PublicKey(process.env.TREASURY_USDC_MINT!);
    const recipientPubkey = new PublicKey(recipientAddress);

    // Get treasury's USDC token account
    const treasuryTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      treasuryAddress
    );

    // Get or create recipient's USDC token account
    const recipientTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      recipientPubkey
    );

    // Check if recipient token account exists
    const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
    
    let transaction = new Transaction();

    // If recipient doesn't have USDC account, create it
    if (!recipientAccountInfo) {
      const createAccountIx = createTransferInstruction(
        treasuryTokenAccount,
        recipientTokenAccount,
        treasuryAddress,
        0 // 0 amount for account creation
      );
      transaction.add(createAccountIx);
    }

    // Add USDC transfer instruction
    const transferIx = createTransferInstruction(
      treasuryTokenAccount,
      recipientTokenAccount,
      treasuryAddress,
      amount
    );
    transaction.add(transferIx);

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = treasuryAddress;

    // If user provided signed transaction, use it
    if (signedTransaction) {
      // Verify and send the signed transaction
      const tx = Transaction.from(Buffer.from(signedTransaction, 'base64'));
      const signature = await connection.sendRawTransaction(tx.serialize());
      
      // Confirm transaction
      await connection.confirmTransaction(signature);

      return NextResponse.json({
        success: true,
        data: {
          signature,
          disasterEventId,
          recipientAddress,
          amount,
          explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=mainnet-beta`
        }
      });
    }

    // Return unsigned transaction for client to sign
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    });

    return NextResponse.json({
      success: true,
      data: {
        unsignedTransaction: serializedTransaction.toString('base64'),
        disasterEventId,
        recipientAddress,
        amount,
        instructions: transaction.instructions.length
      }
    });

  } catch (error) {
    console.error('Payout execution API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute payout',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 