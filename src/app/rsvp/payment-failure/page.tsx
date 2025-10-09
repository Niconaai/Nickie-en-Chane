'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// This is the Client Component that contains the hook.
function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const error = searchParams.get('error');

  let message = 'Jou betaling kon nie verwerk word nie.';
  if (reason === 'cancelled') {
    message = 'Jy het die betaling gekanselleer.';
  } else if (error) {
    message = 'Daar was \'n tegniese fout met die verwerking van jou betaling.';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h1 className="text-2xl font-bold text-[#3d251e] mb-2">
          Betaling Misluk
        </h1>
        <p className="text-[#5c4033] mb-6">
          {message}
        </p>
        <Link 
          href="/rsvp"
          className="bg-[#3d251e] text-white px-6 py-3 rounded-lg hover:bg-[#5c4033] transition-colors font-medium"
        >
          Probeer Weer
        </Link>
      </div>
    </div>
  );
}

// This is the main page component. It can now be a Server Component (or stay a Client Component).
// It wraps the dynamic part in a Suspense boundary.
export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentFailureContent />
    </Suspense>
  );
}

// A simple fallback component to show while the client component is loading.
function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3d251e]"></div>
        </div>
    );
}