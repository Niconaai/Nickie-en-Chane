'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Family } from '@/components/admin/types';
import { RSVPSessionData } from '@/types/rsvp-session';

interface PaymentStatusProps {
  family: Family;
  session: RSVPSessionData;
  onPaymentComplete: () => void;
  onBack: () => void;
}

interface PaymentData {
  id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  paid_amount: number;
  paid_at: string;
}

export default function PaymentStatus({ family, session, onPaymentComplete, onBack }: PaymentStatusProps) {
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateDeposit = () => {
    const attendingAdults = session.guests.filter(g => g.is_attending && g.is_adult).length;
    return attendingAdults * 30000; // R300 in cents
  };

  useEffect(() => {
    const checkPaymentStatus = async () => {
      setLoading(true);
      const { data: paymentData, error } = await supabase
        .from('payments')
        .select('*')
        .eq('family_id', family.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') //console.error('Error fetching payment:', error);

      setPayment(paymentData);
      setLoading(false);

      if (paymentData?.payment_status === 'paid') {
        setTimeout(() => onPaymentComplete(), 2000);
      }
    };
    checkPaymentStatus();
  }, [family.id, onPaymentComplete]);

  const handlePayment = async () => {
    setIsSubmitting(true);
    const depositAmount = calculateDeposit(); // This is in cents

    if (depositAmount <= 0) {
      onPaymentComplete();
      return;
    }

    try {
      // 1. Check if a pending payment already exists for this family.
      const { data: existingPayment, error: fetchError } = await supabase
        .from('payments')
        .select('id')
        .eq('family_id', family.id)
        .eq('payment_status', 'pending')
        .maybeSingle(); 

      if (fetchError) {
        throw fetchError;
      }

      let paymentId = existingPayment?.id;

      // 2. If no pending payment exists, create a new one.
      if (!paymentId) {
        const { data: newPayment, error: dbError } = await supabase
          .from('payments')
          .insert([{
            family_id: family.id,
            amount: depositAmount,
            payment_method: 'yoco', 
            payment_status: 'pending'
          }])
          .select('id')
          .single();

        if (dbError || !newPayment) {
          throw new Error(dbError?.message || "Failed to create payment record in database.");
        }
        paymentId = newPayment.id;
      }

      const response = await fetch('/api/yoco/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: depositAmount,
          paymentId: paymentId,
          email: family.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate Yoco payment');
      }

      const { redirectUrl, checkoutId } = data;

      if (redirectUrl && checkoutId) {
        // Store the checkoutId in sessionStorage before redirecting.
        sessionStorage.setItem('yocoCheckoutId', checkoutId);
        window.location.href = redirectUrl;
      } else {
        throw new Error("Missing redirectUrl or checkoutId from server.");
      }

    } catch (error) {
      //console.error('Error handling payment:', error);
      alert('Fout met die opstel van betaling. Probeer asseblief weer.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg" style={{ color: '#8b6c5c' }}>Laai betaling inligting...</div>
      </div>
    );
  }

  if (payment?.payment_status === 'paid') {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#3d251e' }}>Betaling Bevestig!</h3>
          <p style={{ color: '#5c4033' }} className="mb-4">
            Jou deposito van R{((payment.paid_amount || 0) / 100).toFixed(2)} is suksesvol betaal.
          </p>
          <p style={{ color: '#8b6c5c' }} className="text-sm">
            Betaal op: {new Date(payment.paid_at).toLocaleDateString('af-ZA')}
          </p>
        </div>
        <p style={{ color: '#8b6c5c' }} className="text-sm">Finaliseer RSVP...</p>
      </div>
    );
  }

  const depositAmount = calculateDeposit();
  const attendingAdults = session.guests.filter(g => g.is_attending && g.is_adult).length;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: '#3d251e' }}>Deposito Betaling</h3>
        <div className="mb-6">
          <p style={{ color: '#5c4033' }}>Aantal volwassene gaste: <strong>{attendingAdults}</strong></p>
          <p style={{ color: '#5c4033' }}>Deposito per volwassene: <strong>R300</strong></p>
          <p style={{ color: '#3d251e' }} className="text-lg font-bold">
            Totaal Deposito: <strong>R{(depositAmount / 100).toFixed(2)}</strong>
          </p>
        </div>
        <div style={{ color: '#8b6c5c' }} className="text-sm mb-4">
          * Hierdie deposito is om jou plek te bevestig en sal na die troue terugbetaal word of as &apos;n geskenk aanvaar word.
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Terug
        </button>
        <button
          onClick={handlePayment}
          disabled={isSubmitting || attendingAdults === 0}
          className="px-8 py-3 rounded-lg font-medium text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ backgroundColor: '#3d251e' }}
        >
          {isSubmitting ? 'Besig...' : 'Gaan na Kaart Betaling'}
        </button>
      </div>
    </div>
  );
}