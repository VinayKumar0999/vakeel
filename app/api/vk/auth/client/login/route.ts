import { NextRequest, NextResponse } from 'next/server';
import { getClientByEmail, verifyPassword, createSession } from '@/lib/vk-db';

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

    // Get client by email
    const client = await getClientByEmail(email);
    if (!client) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, client.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const session = await createSession(client.id, 'client');

    // Prepare response (don't include password)
    const { password: _, ...clientWithoutPassword } = client;

    return NextResponse.json({
      ...clientWithoutPassword,
      token: session.token,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Client login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
