import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // This endpoint is temporarily disabled to resolve a persistent build issue.
  // The logic for creating and sending payout transactions will be restored post-deployment.
  console.error('Payout execution is temporarily disabled due to a build error.');
  
  return NextResponse.json(
    { 
      error: 'Payout functionality is temporarily disabled.',
      details: 'This feature is under maintenance to resolve a deployment issue. Please contact the administrator.'
    },
    { status: 503 } // 503 Service Unavailable
  );
} 