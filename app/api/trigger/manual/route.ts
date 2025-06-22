import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      disasterType, 
      location, 
      severity, 
      description,
      estimatedDamage,
      affectedPopulation 
    } = body;

    if (!disasterType || !location || !severity) {
      return NextResponse.json(
        { error: 'Missing required parameters: disasterType, location, severity' },
        { status: 400 }
      );
    }

    // Generate a unique disaster event ID
    const disasterEventId = `disaster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create disaster event object
    const disasterEvent = {
      id: disasterEventId,
      type: disasterType,
      location,
      severity,
      description: description || '',
      estimatedDamage: estimatedDamage || 0,
      affectedPopulation: affectedPopulation || 0,
      timestamp: new Date().toISOString(),
      status: 'active',
      triggeredBy: 'manual',
      payoutAmount: 0, // Will be calculated based on severity and treasury balance
    };

    // In a real implementation, you would:
    // 1. Store this in a database
    // 2. Calculate payout amounts
    // 3. Trigger notifications
    // 4. Log the event

    console.log('Manual disaster triggered:', disasterEvent);

    return NextResponse.json({
      success: true,
      data: {
        disasterEvent,
        message: 'Disaster event triggered successfully',
        nextSteps: [
          'Calculate payout amounts',
          'Notify relief organizations',
          'Prepare USDC transfers'
        ]
      }
    });

  } catch (error) {
    console.error('Manual trigger API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to trigger disaster event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return list of recent disaster events (mock data for now)
    const recentEvents = [
      {
        id: 'disaster_1703123456789_abc123',
        type: 'Earthquake',
        location: 'San Francisco, CA',
        severity: 'High',
        timestamp: '2023-12-21T10:30:00Z',
        status: 'active',
        payoutAmount: 50000
      },
      {
        id: 'disaster_1703123456788_def456',
        type: 'Hurricane',
        location: 'Miami, FL',
        severity: 'Medium',
        timestamp: '2023-12-21T09:15:00Z',
        status: 'resolved',
        payoutAmount: 25000
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        recentEvents,
        totalEvents: recentEvents.length
      }
    });

  } catch (error) {
    console.error('Get disaster events API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch disaster events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 