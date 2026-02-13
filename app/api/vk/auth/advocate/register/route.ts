import { NextRequest, NextResponse } from 'next/server';
import { createAdvocate } from '@/lib/vk-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Create advocate
    const advocate = await createAdvocate({ email, password, name });

    // Don't send password in response
    const { password: _, ...advocateWithoutPassword } = advocate;

    return NextResponse.json(advocateWithoutPassword, { status: 200 });
  } catch (error: any) {
    console.error('Advocate registration error:', error);
    
    if (error.message === 'Email already registered') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
