import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndRole } from '@/lib/vk-auth-middleware';
import { createPayment } from '@/lib/vk-db';

export const POST = withAuthAndRole('client', async (request, context) => {
  try {
    const body = await request.json();
    const { advocate_id, amount } = body;

    if (!advocate_id || !amount) {
      return NextResponse.json(
        { error: 'advocate_id and amount are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await createPayment({
      client_id: context.user_id,
      advocate_id: parseInt(advocate_id),
      amount: parseFloat(amount),
      payment_gateway: 'test', // In production, this would be 'stripe' or 'razorpay'
    });

    return NextResponse.json(payment, { status: 200 });
  } catch (error: any) {
    console.error('Initiate payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 400 }
    );
  }
});
