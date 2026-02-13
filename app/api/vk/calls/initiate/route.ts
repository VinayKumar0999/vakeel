import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/vk-auth-middleware';
import { createCall } from '@/lib/vk-db';

export const POST = withAuth(async (request, context) => {
  try {
    const body = await request.json();
    const { receiver_id } = body;

    if (!receiver_id) {
      return NextResponse.json(
        { error: 'receiver_id is required' },
        { status: 400 }
      );
    }

    // Determine receiver type (opposite of caller)
    const receiverType = context.user_type === 'advocate' ? 'client' : 'advocate';

    // Create call record
    const call = await createCall({
      caller_id: context.user_id,
      caller_type: context.user_type,
      receiver_id: parseInt(receiver_id),
      receiver_type: receiverType,
    });

    return NextResponse.json(call, { status: 200 });
  } catch (error: any) {
    console.error('Initiate call error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate call' },
      { status: 400 }
    );
  }
});
