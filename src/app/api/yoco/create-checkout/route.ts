import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { amount, paymentId, email } = await request.json();

  if (!amount || !paymentId || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const secretKey = process.env.YOCO_TEST_SECRET_KEY;

  if (!secretKey) {
    console.error("YOCO_TEST_SECRET_KEY is not configured in .env.local");
    return NextResponse.json({ error: 'Yoco credentials not configured' }, { status: 500 });
  }

  const payload = {
    amount: amount, // Yoco expects the amount in cents
    currency: 'ZAR',
    successUrl: `${process.env.NEXT_PUBLIC_URL}/rsvp/payment-success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_URL}/rsvp/payment-failure`,
    failureUrl: `${process.env.NEXT_PUBLIC_URL}/rsvp/payment-failure`,
    metadata: {
      paymentId: paymentId,
      customerEmail: email,
    },
    processingMode: "test"
  };

  try {
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Yoco uses Bearer authentication with the secret key
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Yoco API error:', data);
      return NextResponse.json({ error: data.message || 'Failed to create Yoco checkout' }, { status: response.status });
    }

    // The response contains the ID of the checkout and the URL to redirect the user to.
    return NextResponse.json({ redirectUrl: data.redirectUrl, id: data.id });

  } catch (error) {
    console.error('Yoco request error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}