import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndRole } from '@/lib/vk-auth-middleware';
import { updateAdvocateAvailability } from '@/lib/vk-db';

export const PUT = withAuthAndRole('advocate', async (request, context) => {
  try {
    const body = await request.json();
    const { availability } = body;

    if (!availability) {
      return NextResponse.json(
        { error: 'Availability is required' },
        { status: 400 }
      );
    }

    // Validate availability value
    const validAvailability = ['available', 'busy', 'offline'];
    if (!validAvailability.includes(availability)) {
      return NextResponse.json(
        { error: `Availability must be one of: ${validAvailability.join(', ')}` },
        { status: 400 }
      );
    }

    const advocate = await updateAdvocateAvailability(context.user_id, availability);

    // Don't send password in response
    const { password: _, ...advocateWithoutPassword } = advocate;

    return NextResponse.json(advocateWithoutPassword, { status: 200 });
  } catch (error: any) {
    console.error('Update availability error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update availability' },
      { status: 400 }
    );
  }
});
