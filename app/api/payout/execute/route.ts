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
  getOrCreateAssociatedTokenAccount
} from '@solana/spl-token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      recipientAddress, 
      amount, 
      disasterEventId,
      // The treasury keypair should be securely stored on the server
      // For this example, we assume there's a mechanism to sign with it.
      // We will prepare the transaction and return it for signing.
    } = body;

    if (!recipientAddress || !amount || !disasterEventId) {
      return NextResponse.json(
        { error: 'Missing required parameters: recipientAddress, amount, disasterEventId' },
        { status: 400 }
      );
    }

    const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
    const treasuryPublicKey = new PublicKey(process.env.TREASURY_WALLET_ADDRESS!);
    const usdcMint = new PublicKey(process.env.TREASURY_USDC_MINT!);
    const recipientPubkey = new PublicKey(recipientAddress);

    // This is a placeholder for the fee payer, which should be the treasury.
    // In a real app, the treasury's keypair would be used to sign.
    const feePayer = treasuryPublicKey;

    // Get the treasury's associated token account.
    const treasuryTokenAccountAddress = await getAssociatedTokenAddress(
      usdcMint,
      treasuryPublicKey
    );

    // Get or create the recipient's associated token account.
    // The treasury (feePayer) will pay for its creation if it doesn't exist.
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      feePayer, // The account that will pay for the creation
      usdcMint,
      recipientPubkey,
      false // Idempotent
    );
    
    const transaction = new Transaction();

    // Add the instruction to transfer USDC.
    transaction.add(
      createTransferInstruction(
        treasuryTokenAccountAddress, // From
        recipientTokenAccount.address,   // To
        treasuryPublicKey,             // Authority
        amount                         // Amount
      )
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = feePayer;

    // The transaction is ready, but it needs to be signed by the treasury's keypair.
    // We will return the unsigned transaction to the client to be signed by a wallet.
    // In a real-world scenario, this would be handled by a secure backend signing service.
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
    });

    return NextResponse.json({
      success: true,
      data: {
        unsignedTransaction: serializedTransaction.toString('base64'),
        message: "Transaction created. Please sign with the treasury wallet."
      }
    });

  } catch (error) {
    console.error('Payout execution API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to execute payout',
        details: errorMessage
      },
      { status: 500 }
    );
  }
} 