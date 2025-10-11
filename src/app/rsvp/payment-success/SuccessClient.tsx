'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function SuccessClient() {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Retrieve the checkoutId from sessionStorage.
    const checkoutId = sessionStorage.getItem('yocoCheckoutId');

    if (!checkoutId) {
      setVerificationStatus('failed');
      setErrorMessage('Geen checkout ID gevind nie. Kan nie betaling verifieer nie.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/yoco/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkoutId }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Verifikasie het misluk.');
        }
        
        setVerificationStatus('success');
        
        // Clear the ID from storage after successful verification
        sessionStorage.removeItem('yocoCheckoutId');

        setTimeout(() => {
          router.push('/rsvp');
        }, 3000);

      } catch (error) {
        setVerificationStatus('failed');
        const message = error instanceof Error ? error.message : 'Onbekende fout.';
        setErrorMessage(`Betaling kon nie geverifieer word nie: ${message}`);
      }
    };

    verifyPayment();
  }, [router]);

  // Render different UI based on the verification status
  if (verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
        <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3d251e] mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-[#3d251e]">Besig om betaling te verifieer...</h1>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-[#3d251e] mb-2">Betaling Suksesvol!</h1>
          <p className="text-[#5c4033]">Dankie! Jou betaling is geverifieer. Ons stuur jou nou terug om die RSVP te finaliseer.</p>
        </div>
      </div>
    );
  }

  // If verificationStatus is 'failed'
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h1 className="text-2xl font-bold text-[#3d251e] mb-2">Verifikasie Misluk</h1>
        <p className="text-[#5c4033] mb-6">{errorMessage}</p>
        <Link 
          href="/rsvp"
          className="bg-[#3d251e] text-white px-6 py-3 rounded-lg hover:bg-[#5c4033] transition-colors font-medium"
        >
          Gaan Terug na RSVP
        </Link>
      </div>
    </div>
  );
}