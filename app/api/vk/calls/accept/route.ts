import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/vk-auth-middleware';
import { acceptCall } from '@/lib/vk-db';

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

    // Accept the call
    const call = await acceptCall(parseInt(call_id), context.user_id);

    return NextResponse.json(call, { status: 200 });
  } catch (error: any) {
    console.error('Accept call error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to accept call' },
      { status: 400 }
    );
  }
});
