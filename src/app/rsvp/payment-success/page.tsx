import { Suspense } from 'react';
import { SuccessClient } from './SuccessClient';

function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3d251e]"></div>
        </div>
    );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessClient />
    </Suspense>
  );
}