import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { amount, paymentId, email } = await request.json();

  if (!amount || !paymentId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const secretKey = process.env.YOCO_TEST_SECRET_KEY;
  if (!secretKey) {
    console.error("YOCO_TEST_SECRET_KEY is not configured.");
    return NextResponse.json({ error: 'Yoco credentials not configured' }, { status: 500 });
  }

  const payload = {
    amount: amount,
    currency: 'ZAR',
    successUrl: `${process.env.NEXT_PUBLIC_URL}/rsvp/payment-success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_URL}/rsvp/payment-failure`,
    failureUrl: `${process.env.NEXT_PUBLIC_URL}/rsvp/payment-failure`,
    metadata: {
      paymentId: paymentId,
    },
  };

  try {
    // We only need one API call to create the checkout.
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Yoco API error:', data);
      throw new Error(data.message || 'Failed to create Yoco checkout');
    }

    // Return both the redirectUrl and the checkoutId to the frontend.
    return NextResponse.json({ redirectUrl: data.redirectUrl, checkoutId: data.id });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}