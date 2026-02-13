import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/vk-auth-middleware';
import { getAvailableAdvocates } from '@/lib/vk-db';

export const GET = withAuth(async (request, context) => {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    
    const availability = searchParams.get('availability') || undefined;
    const location = searchParams.get('location') || undefined;
    const minRateStr = searchParams.get('min_rate');
    const maxRateStr = searchParams.get('max_rate');

    const minRate = minRateStr ? parseFloat(minRateStr) : undefined;
    const maxRate = maxRateStr ? parseFloat(maxRateStr) : undefined;

    const advocates = await getAvailableAdvocates({
      availability,
      location,
      minRate,
      maxRate,
    });

    // Filter out sensitive data (password) and format response
    const users = advocates.map(advocate => {
      const { password, ...advocateWithoutPassword } = advocate;
      return {
        id: advocateWithoutPassword.id,
        email: advocateWithoutPassword.email,
        name: advocateWithoutPassword.name,
        availability: advocateWithoutPassword.availability,
        location: advocateWithoutPassword.location,
        profile_image: advocateWithoutPassword.profile_image,
        bio: advocateWithoutPassword.bio,
        hourly_rate: advocateWithoutPassword.hourly_rate,
      };
    });

    return NextResponse.json({
      users,
      count: users.length,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Get available users error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch available users' },
      { status: 500 }
    );
  }
});
