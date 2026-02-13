import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/vk-auth-middleware';
import { generateWebRTCToken, getICEServers } from '@/lib/vk-webrtc';

export const GET = withAuth(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url);
    const callIdStr = searchParams.get('call_id');

    if (!callIdStr) {
      return NextResponse.json(
        { error: 'call_id is required' },
        { status: 400 }
      );
    }

    const callId = parseInt(callIdStr);
    
    if (isNaN(callId)) {
      return NextResponse.json(
        { error: 'Invalid call_id' },
        { status: 400 }
      );
    }

    // Generate WebRTC token
    const token = await generateWebRTCToken(callId, context.user_id);

    // Get ICE servers configuration
    const iceServers = getICEServers();

    // Calculate expiration time (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    return NextResponse.json({
      token,
      call_id: callId,
      expires_at: expiresAt.toISOString(),
      ice_servers: iceServers,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Generate WebRTC token error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate token' },
      { status: 400 }
    );
  }
});
