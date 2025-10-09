import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { checkoutId } = await request.json();

  if (!checkoutId) {
    return NextResponse.json({ error: 'Checkout ID is required' }, { status: 400 });
  }

  const secretKey = process.env.YOCO_TEST_SECRET_KEY;

  if (!secretKey) {
    console.error("YOCO_TEST_SECRET_KEY is not configured.");
    return NextResponse.json({ error: 'Yoco credentials not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://payments.yoco.com/api/checkouts/${checkoutId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Yoco verify API error:', data);
      throw new Error('Failed to verify payment with Yoco');
    }

    const paymentId = data.metadata.paymentId;
    const status = data.state || data.status;

    // THE FIX: Add 'completed' to the list of successful statuses.
    if (status === 'successful' || status === 'succeeded' || status === 'completed') {
      if (!paymentId) {
        throw new Error("Payment ID not found in Yoco metadata.");
      }

      const { error: dbError } = await supabase
        .from('payments')
        .update({
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          yoco_charge_id: data.id,
          paid_amount: data.amount,
          transaction_id: data.paymentId,
          yoco_response: data,
        })
        .eq('id', paymentId);

      if (dbError) {
        console.error("Supabase update error:", dbError);
        throw new Error("Failed to update payment status in database.");
      }

      console.log(`Payment ${paymentId} successfully verified and updated.`);
      return NextResponse.json({ success: true, status: 'paid' });

    } else {
      console.log(`Payment verification for checkoutId ${checkoutId} returned status: ${status}`);
      return NextResponse.json({ success: false, status: status });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error verifying Yoco payment:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}