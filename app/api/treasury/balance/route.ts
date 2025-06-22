import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function GET(request: NextRequest) {
  try {
    const connection = new Connection(process.env.SOLANA_RPC_URL!);
    const treasuryAddress = new PublicKey(process.env.TREASURY_WALLET_ADDRESS!);
    const usdcMint = new PublicKey(process.env.TREASURY_USDC_MINT!);

    // Get SOL balance
    const solBalance = await connection.getBalance(treasuryAddress);
    const solBalanceInSol = solBalance / 1e9; // Convert lamports to SOL

    // Get USDC token account
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      treasuryAddress,
      { mint: usdcMint }
    );

    let usdcBalance = 0;
    if (tokenAccounts.value.length > 0) {
      const usdcAccount = tokenAccounts.value[0];
      usdcBalance = Number(usdcAccount.account.data.parsed.info.tokenAmount.uiAmount);
    }

    // Get recent transactions for donation history
    const signatures = await connection.getSignaturesForAddress(treasuryAddress, {
      limit: 10,
    });

    const recentTransactions = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const tx = await connection.getParsedTransaction(sig.signature);
          return {
            signature: sig.signature,
            blockTime: sig.blockTime,
            slot: sig.slot,
            success: tx?.meta?.err === null,
          };
        } catch (error) {
          return {
            signature: sig.signature,
            blockTime: sig.blockTime,
            slot: sig.slot,
            success: false,
            error: 'Failed to fetch transaction details',
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        treasuryAddress: treasuryAddress.toString(),
        balances: {
          sol: solBalanceInSol,
          usdc: usdcBalance,
        },
        recentTransactions,
      },
    });

  } catch (error) {
    console.error('Treasury balance API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    return NextResponse.json(
      { 
        error: 'Failed to fetch treasury balance',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
} 