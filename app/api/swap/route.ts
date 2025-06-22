import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      quoteResponse, 
      userPublicKey, 
      destinationWallet, // The treasury wallet address
      asLegacyTransaction = false,
      computeUnitPriceMicroLamports = 'auto'
    } = body;

    if (!quoteResponse || !userPublicKey) {
      return NextResponse.json(
        { error: 'Missing required parameters: quoteResponse, userPublicKey' },
        { status: 400 }
      );
    }

    let destinationTokenAccount: string | undefined = undefined;

    if (destinationWallet) {
      const destinationPublicKey = new PublicKey(destinationWallet);
      const outputMintPublicKey = new PublicKey(quoteResponse.outputMint);
      
      // Find the associated token account address using the reliable findProgramAddressSync method
      destinationTokenAccount = (await getAssociatedTokenAddress(
        outputMintPublicKey,
        destinationPublicKey
      )).toBase58();
    }
    
    // Jupiter Swap API endpoint
    const jupiterUrl = 'https://quote-api.jup.ag/v6/swap';

    const swapPayload = {
      quoteResponse,
      userPublicKey,
      destinationTokenAccount, // Pass the treasury's token account here
      wrapAndUnwrapSol: true,
      asLegacyTransaction,
      computeUnitPriceMicroLamports
    };

    console.log("Sending payload to Jupiter Swap API:", JSON.stringify(swapPayload, null, 2));

    const response = await fetch(jupiterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(swapPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Jupiter Swap API error response:', errorBody);
      throw new Error(`Jupiter Swap API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const swapData = await response.json();

    return NextResponse.json({
      success: true,
      data: swapData,
    });

  } catch (error) {
    console.error('Swap API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to execute swap',
        details: errorMessage
      },
      { status: 500 }
    );
  }
} 