import { NextRequest, NextResponse } from 'next/server';
import { getAdvocateByEmail, verifyPassword, createSession } from '@/lib/vk-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get advocate by email
    const advocate = await getAdvocateByEmail(email);
    if (!advocate) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, advocate.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const session = await createSession(advocate.id, 'advocate');

    // Prepare response (don't include password)
    const { password: _, ...advocateWithoutPassword } = advocate;

    return NextResponse.json({
      ...advocateWithoutPassword,
      token: session.token,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Advocate login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
