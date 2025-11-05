import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

/**
 * Verifies the Yoco webhook signature and timestamp.
 * @param webhookId The 'webhook-id' header value.
 * @param signatureHeader The 'webhook-signature' header value.
 * @param timestampHeader The 'webhook-timestamp' header value.
 * @param rawBody The raw string body of the request.
 * @param secret The Yoco WEBHOOK secret (prefixed with 'whsec_').
 * @returns A promise that resolves to a boolean indicating if the signature is valid.
 */
async function verifyYocoSignature(
  webhookId: string | null,
  signatureHeader: string | null,
  timestampHeader: string | null,
  rawBody: string,
  secret: string
): Promise<boolean> {
  if (!webhookId || !signatureHeader || !timestampHeader || !secret) {
    //console.error("Webhook Error: Missing required headers or secret.");
    return false;
  }

  // --- SUGGESTION 1: Add timestamp validation to prevent replay attacks ---
  const MAX_WEBHOOK_AGE_SECONDS = 3 * 60; // 3 minutes
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const webhookTimestamp = parseInt(timestampHeader, 10);

  if (isNaN(webhookTimestamp) || Math.abs(currentTimestamp - webhookTimestamp) > MAX_WEBHOOK_AGE_SECONDS) {
      //console.error(`Webhook Error: Timestamp validation failed. Timestamp: ${webhookTimestamp}, Current: ${currentTimestamp}`);
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
      //console.error("Webhook Error: Could not find a valid 'v1' signature in the header.");
      return false;
  }

  // --- SUGGESTION 2: Correctly decode the webhook secret ---
  // The secret from Yoco is prefixed (e.g., 'whsec_') and the part after the prefix
  // is a Base64 encoded string that must be decoded to get the raw bytes for the HMAC key.
  const secretParts = secret.split('_');
  if (secretParts.length < 2 || !secretParts[1]) {
      //console.error("Webhook Error: Invalid webhook secret format. Expected 'whsec_...'.");
      return false;
  }
  const secretBytes = Buffer.from(secretParts[1], 'base64');

  const signedPayload = `${webhookId}.${timestampHeader}.${rawBody}`;

  const expectedSignature = crypto
    .createHmac('sha256', secretBytes) // Use the decoded secret bytes as the key
    .update(signedPayload)
    .digest('base64');

  try {
    const hashBuffer = Buffer.from(hashFromHeader, 'base64');
    const expectedBuffer = Buffer.from(expectedSignature, 'base64');
    
    if (hashBuffer.length !== expectedBuffer.length) {
        return false;
    }
    // Use crypto.timingSafeEqual to prevent timing attacks.
    return crypto.timingSafeEqual(hashBuffer, expectedBuffer);
  } catch (error) {
    //console.error("Webhook Error: Error during signature comparison.", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  // Use a dedicated environment variable for the webhook secret.
  const webhookSecret = process.env.YOCO_WEBHOOK_SECRET_TEST; 
  if (!webhookSecret) {
    //console.error("YOCO_WEBHOOK_SECRET is not configured.");
    return new NextResponse('Webhook secret not configured', { status: 500 });
  }

  const rawBody = await request.text();
  const webhookId = request.headers.get('webhook-id');
  const signatureHeader = request.headers.get('webhook-signature');
  const timestampHeader = request.headers.get('webhook-timestamp');
  
  const isValid = await verifyYocoSignature(webhookId, signatureHeader, timestampHeader, rawBody, webhookSecret);
  
  if (!isValid) {
    //console.warn("Unauthorized webhook received. Signature validation failed.");
    return new NextResponse('Invalid signature', { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody);
    //console.log('Received valid Yoco webhook event:', event.type);

    if (event.type === 'payment.succeeded') {
      const charge = event.payload;
      // It appears the Yoco API might use either 'metadata.paymentId' or just 'paymentId'.
      // Safely check for both to be robust.
      const paymentId = charge.id || charge.metadata?.paymentId || charge.paymentId;

      if (!paymentId) {
        //console.error("Webhook Error: 'paymentId' not found in metadata or payload for charge:", charge.id);
        return new NextResponse('Missing paymentId in metadata', { status: 400 });
      }

      const { error } = await supabase
        .from('payments')
        .update({
          payment_status: 'paid',
          paid_at: new Date(charge.createdDate).toISOString(),
          yoco_charge_id: charge.id,
          paid_amount: charge.amount,
          yoco_response: charge, // Store the full response for auditing
        })
        .eq('id', paymentId);

      if (error) {
        //console.error(`Supabase update error for paymentId ${paymentId}:`, error);
        // Even if DB fails, return 200 to Yoco to prevent retries
      } else {
        //console.log(`Payment ${paymentId} successfully updated to 'paid' via webhook.`);
      }
    }

    // Always return a 200 OK to Yoco to acknowledge receipt of the webhook.
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    //console.error('Error processing Yoco webhook:', error);
    return new NextResponse('Webhook processing error', { status: 500 });
  }
}