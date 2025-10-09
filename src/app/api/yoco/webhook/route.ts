import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

/**
 * Verifies the Yoco/Svix webhook signature.
 * @param webhookId The 'webhook-id' header value.
 *- * @param signatureHeader The 'webhook-signature' header value.
 * @param timestampHeader The 'webhook-timestamp' header value.
 * @param rawBody The raw string body of the request.
 * @param secret The Yoco secret key.
 * @returns A promise that resolves to a boolean indicating if the signature is valid.
 */
async function verifyYocoSignature(
  webhookId: string | null,
  signatureHeader: string | null,
  timestampHeader: string | null,
  rawBody: string,
  secret: string
): Promise<boolean> {
  if (!webhookId || !signatureHeader || !timestampHeader) {
    console.error("Webhook Error: Missing one or more required Svix headers (id, signature, timestamp).");
    return false;
  }
  
  const signatureParts = signatureHeader.split(' ');
  let hashFromHeader = '';
  for (const part of signatureParts) {
      const [version, signature] = part.split(',');
      if (version === 'v1') {
          hashFromHeader = signature;
          break;
      }
  }

  if (!hashFromHeader) {
      console.error("Webhook Error: Could not find a valid 'v1' signature in the header.");
      return false;
  }

  const signedPayload = `${webhookId}.${timestampHeader}.${rawBody}`;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('base64');

  try {
    const hashBuffer = Buffer.from(hashFromHeader, 'base64');
    const expectedBuffer = Buffer.from(expectedSignature, 'base64');
    
    if (hashBuffer.length !== expectedBuffer.length) {
        return false;
    }
    return crypto.timingSafeEqual(hashBuffer, expectedBuffer);
  } catch (error) {
    console.error("Webhook Error: Error during signature comparison.", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.YOCO_TEST_SECRET_KEY;
  if (!secretKey) {
    console.error("YOCO_TEST_SECRET_KEY is not configured.");
    return new NextResponse('Webhook secret not configured', { status: 500 });
  }

  // Read all necessary data from the request object ONCE.
  const rawBody = await request.text();
  const webhookId = request.headers.get('webhook-id');
  const signatureHeader = request.headers.get('webhook-signature');
  const timestampHeader = request.headers.get('webhook-timestamp');
  
  // Pass the extracted string values to the pure verification function.
  const isValid = await verifyYocoSignature(webhookId, signatureHeader, timestampHeader, rawBody, secretKey);
  
  if (!isValid) {
    console.warn("Unauthorized webhook received. Signature validation failed.");
    return new NextResponse('Invalid signature', { status: 401 });
  }

  try {
    // Manually parse the raw body we already have.
    const event = JSON.parse(rawBody);
    console.log('Received valid Yoco webhook event:', event.type);

    if (event.type === 'payment.succeeded') {
      const charge = event.payload;
      const paymentId = charge.metadata.paymentId;

      if (!paymentId) {
        console.error("Webhook Error: 'paymentId' not found in metadata for charge:", charge.id);
        return new NextResponse('Missing paymentId in metadata', { status: 400 });
      }

      // Update the payment record in Supabase
      const { error } = await supabase
        .from('payments')
        .update({
          payment_status: 'paid',
          paid_at: new Date(charge.createdDate).toISOString(),
          yoco_charge_id: charge.id,
          paid_amount: charge.amount,
        })
        .eq('id', paymentId);

      if (error) {
        console.error(`Supabase update error for paymentId ${paymentId}:`, error);
      } else {
        console.log(`Payment ${paymentId} successfully updated to 'paid'.`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('Error processing Yoco webhook:', error);
    return new NextResponse('Webhook processing error', { status: 500 });
  }
}