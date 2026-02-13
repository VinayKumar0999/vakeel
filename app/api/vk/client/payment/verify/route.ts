import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndRole } from '@/lib/vk-auth-middleware';
import { getPaymentByTransactionId, verifyPayment } from '@/lib/vk-db';

export const POST = withAuthAndRole('client', async (request, context) => {
  try {
    const body = await request.json();
    const { transaction_id } = body;

    if (!transaction_id) {
      return NextResponse.json(
        { error: 'transaction_id is required' },
        { status: 400 }
      );
    }

    // Get payment to verify it belongs to this client
    const payment = await getPaymentByTransactionId(transaction_id);
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Verify the payment belongs to this client
    if (payment.client_id !== context.user_id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Verify payment
    const verifiedPayment = await verifyPayment(transaction_id);

    return NextResponse.json(verifiedPayment, { status: 200 });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 400 }
    );
  }
});
