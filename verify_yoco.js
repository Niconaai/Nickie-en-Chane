const crypto = require('crypto');

// --- PASTE YOUR DATA HERE ---

// 1. Paste the Test Secret Key from your .env.local file
const secretKey = "sk_test_50ad5299bBR1g8886b84bde97eb7";

// 2. Paste the timestamp from your logs
const timestampHeader = "1759964968";

// 3. Paste the EXACT raw body from your logs
const rawBody = '{"createdDate":"2025-10-08T23:09:22.492924Z","id":"evt_wxMZ8ryNORKuKyeUqoGF2rML","payload":{"amount":30000,"createdDate":"2025-10-08T23:08:56.188302Z","currency":"ZAR","id":"p_dg1eBjA44D9CqM7SpBJuJXjg","metadata":{"checkoutId":"ch_pLpJQkdpn9qCXdqH3Dtdn2gZ","customerEmail":"njvdme@gmail.com","productType":"checkout"},"mode":"test","paymentMethodDetails":{"card":{"expiryMonth":11,"expiryYear":29,"maskedCard":"************1111","scheme":"visa"},"type":"card"},"status":"succeeded","type":"payment"},"type":"payment.succeeded"}';

// 4. Paste the signature hash from your logs (the part after "v1,")
const hashFromYoco = "wftGY5WISOtD8Sj6bOAB9Xfwdr+3Cm/oi2p9I1FstIM=";

// --- SCRIPT LOGIC (DO NOT CHANGE) ---

const payload = `${timestampHeader}.${rawBody}`;

const calculatedSignature = crypto
  .createHmac('sha256', secretKey)
  .update(payload)
  .digest('base64');

console.log("--- STANDALONE SIGNATURE VERIFICATION ---");
console.log("Hash from Yoco Log:", hashFromYoco);
console.log("Hash Calculated by Script:", calculatedSignature);
console.log("---------------------------------------");

if (calculatedSignature === hashFromYoco) {
  console.log("\n✅ SUCCESS: The hashes match! The secret key is correct.");
} else {
  console.log("\n❌ FAILURE: The hashes DO NOT match. The secret key is incorrect.");
}