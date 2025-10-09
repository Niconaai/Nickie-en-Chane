'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();

  // This effect will run after the component mounts
  useEffect(() => {
    // After 3 seconds, redirect the user back to the RSVP page
    // where the flow can be finalized.
    const timer = setTimeout(() => {
      router.push('/rsvp');
    }, 3000);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-[#3d251e] mb-2">
          Betaling Suksesvol!
        </h1>
        <p className="text-[#5c4033] mb-6">
          Dankie, jou deposito is ontvang. Ons stuur jou nou terug om die RSVP te finaliseer.
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d251e] mx-auto"></div>
      </div>
    </div>
  );
}