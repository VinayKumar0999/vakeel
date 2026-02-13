import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndRole } from '@/lib/vk-auth-middleware';
import { getAdvocateEarnings } from '@/lib/vk-db';

export const GET = withAuthAndRole('advocate', async (request, context) => {
  try {
    const earnings = await getAdvocateEarnings(context.user_id);

    return NextResponse.json(earnings, { status: 200 });
  } catch (error: any) {
    console.error('Get earnings error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
});
