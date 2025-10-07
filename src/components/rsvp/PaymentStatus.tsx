'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Family, Guest } from '@/components/admin/types';
import { RSVPSessionData } from '@/types/rsvp-session';

interface PaymentStatusProps {
  family: Family;
  guests: Guest[];
  session: RSVPSessionData;
  onPaymentComplete: () => void;
  onContinueToPayment: () => void;
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

export default function PaymentStatus({
  family,
  guests,
  session,
  onPaymentComplete,
  onContinueToPayment,
  onBack
}: PaymentStatusProps) {
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  // Bereken deposito bedrag - gebruik session data
  const calculateDeposit = () => {
    const attendingAdults = session.guests.filter(g => g.is_attending && g.is_adult).length;
    return attendingAdults * 30000; // R300 per volwassene in sent
  };

  // Check payment status
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

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching payment:', error);
      }

      setPayment(paymentData);
      setLoading(false);
    };

    checkPaymentStatus();
  }, [family.id]);

  // Create or update payment record
  const handlePaymentSetup = async () => {
    setCalculating(true);

    const depositAmount = calculateDeposit();
    const attendingAdults = session.guests.filter(g => g.is_attending && g.is_adult).length;

    if (attendingAdults === 0) {
      alert('Geen volwassene gaste gaan bywoon nie. Geen deposito nodig.');
      onPaymentComplete();
      return;
    }

    try {
      // Check if payment record already exists
      if (payment) {
        // Update existing payment
        const { error } = await supabase
          .from('payments')
          .update({
            amount: depositAmount
            //updated_at: new Date().toISOString()
          })
          .eq('id', payment.id);

        if (error) throw error;
      } else {
        // Create new payment record
        const { data, error } = await supabase
          .from('payments')
          .insert([{
            family_id: family.id,
            amount: depositAmount,
            payment_method: 'ikhoka',
            payment_status: 'pending'
          }])
          .select();

        if (error) throw error;
        setPayment(data[0]);
      }

      // Continue to payment
      onContinueToPayment();

    } catch (error) {
      console.error('Error setting up payment:', error);
      alert('Fout met betaling opset. Probeer weer.');
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg" style={{ color: '#8b6c5c' }}>Laai betaling inligting...</div>
      </div>
    );
  }

  // As betaling reeds betaal is
  if (payment?.payment_status === 'paid') {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#3d251e' }}>
            Betaling Bevestig!
          </h3>
          <p style={{ color: '#5c4033' }} className="mb-4">
            Jou deposito van R{(payment.paid_amount / 100).toFixed(2)} is suksesvol betaal.
          </p>
          <p style={{ color: '#8b6c5c' }} className="text-sm">
            Betaal op: {new Date(payment.paid_at).toLocaleDateString('af-ZA')}
          </p>
        </div>

        {/* AUTO-finaliseer - geen knoppie nodig nie */}
        {(() => {
          // Auto-finaliseer na 2 sekondes
          setTimeout(() => {
            onPaymentComplete();
          }, 2000);
          return (
            <p style={{ color: '#8b6c5c' }} className="text-sm">
              Finaliseer RSVP...
            </p>
          );
        })()}
      </div>
    );
  }

  // As EFT betaling
  if (payment?.payment_method === 'eft') {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#3d251e' }}>
            EFT Betaling
          </h3>
          <p style={{ color: '#5c4033' }} className="mb-4">
            Jou betaling word as EFT hanteer. Jy kan ons kontak vir bank besonderhede.
          </p>
          <p style={{ color: '#8b6c5c' }} className="text-sm">
            Deposito bedrag: R{(payment.amount / 100).toFixed(2)}
          </p>
        </div>

        <div style={{ color: '#8b6c5c' }} className="text-sm mb-6">
          * Jou RSVP sal eers gefinaliseer word nadat betaling ontvang is.
        </div>
      </div>
    );
  }

  // Standaard - Kaart Betaling nodig
  const depositAmount = calculateDeposit();
  const attendingAdults = session.guests.filter(g => g.is_attending && g.is_adult).length;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: '#3d251e' }}>
          Deposito Betaling
        </h3>

        <div className="mb-6">
          <p style={{ color: '#5c4033' }} className="mb-2">
            Aantal volwassene gaste: <strong>{attendingAdults}</strong>
          </p>
          <p style={{ color: '#5c4033' }} className="mb-2">
            Deposito per volwassene: <strong>R300</strong>
          </p>
          <p style={{ color: '#3d251e' }} className="text-lg font-bold">
            Totaal Deposito: <strong>R{(depositAmount / 100).toFixed(2)}</strong>
          </p>
        </div>

        <div style={{ color: '#8b6c5c' }} className="text-sm mb-4">
          * Hierdie deposito is om jou plek te bevestig en sal na die troue terugbetaal word
          of as &apos;n geskenk aanvaar word.
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
          onClick={handlePaymentSetup}
          disabled={calculating || attendingAdults === 0}
          className="px-8 py-3 rounded-lg font-medium text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ backgroundColor: '#3d251e' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5c4033'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3d251e'}
        >
          {calculating ? 'Bereken...' : 'Gaan na Kaart Betaling'}
        </button>
      </div>

      {attendingAdults === 0 && (
        <p style={{ color: '#8b6c5c' }} className="mt-4 text-sm">
          Geen deposito nodig aangesien geen volwassene gaste gaan bywoon nie.
        </p>
      )}
    </div>
  );
}