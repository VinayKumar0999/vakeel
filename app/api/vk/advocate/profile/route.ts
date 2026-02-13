import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndRole } from '@/lib/vk-auth-middleware';
import { getAdvocateById } from '@/lib/vk-db';

export const GET = withAuthAndRole('advocate', async (request, context) => {
  try {
    const advocate = await getAdvocateById(context.user_id);

    if (!advocate) {
      return NextResponse.json(
        { error: 'Advocate not found' },
        { status: 404 }
      );
    }

    // Don't send password in response
    const { password: _, ...advocateWithoutPassword } = advocate;

    return NextResponse.json(advocateWithoutPassword, { status: 200 });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
});
