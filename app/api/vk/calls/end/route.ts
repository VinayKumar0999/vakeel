import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/vk-auth-middleware';
import { endCall } from '@/lib/vk-db';

export const POST = withAuth(async (request, context) => {
  try {
    const body = await request.json();
    const { call_id } = body;

    if (!call_id) {
      return NextResponse.json(
        { error: 'call_id is required' },
        { status: 400 }
      );
    }

    // End the call
    const call = await endCall(parseInt(call_id), context.user_id);

    return NextResponse.json(call, { status: 200 });
  } catch (error: any) {
    console.error('End call error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to end call' },
      { status: 400 }
    );
  }
});
