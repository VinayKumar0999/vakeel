import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndRole } from '@/lib/vk-auth-middleware';
import { updateAdvocateProfileImage } from '@/lib/vk-db';

export const PUT = withAuthAndRole('advocate', async (request, context) => {
  try {
    const body = await request.json();
    const { profile_image } = body;

    if (!profile_image) {
      return NextResponse.json(
        { error: 'profile_image is required' },
        { status: 400 }
      );
    }

    const advocate = await updateAdvocateProfileImage(context.user_id, profile_image);

    // Don't send password in response
    const { password: _, ...advocateWithoutPassword } = advocate;

    return NextResponse.json(advocateWithoutPassword, { status: 200 });
  } catch (error: any) {
    console.error('Update profile image error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile image' },
      { status: 400 }
    );
  }
});
