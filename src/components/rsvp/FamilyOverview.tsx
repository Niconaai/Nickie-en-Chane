'use client';

import { useState } from 'react';
import PaymentStatus from './PaymentStatus';
import { Family, Guest } from '@/components/admin/types';
import { supabase } from '@/lib/supabase';

interface FamilyOverviewProps {
  family: Family;
  guests: Guest[];
  onGuestsUpdate: (guests: Guest[]) => void;
}

type RSVPStep = 'attendance' | 'payment' | 'complete';

export default function FamilyOverview({ family, guests, onGuestsUpdate }: FamilyOverviewProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState<RSVPStep>('attendance');

  const toggleGuestAttendance = async (guestId: string, attending: boolean) => {
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('guests')
        .update({ is_attending: attending })
        .eq('id', guestId);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      if (error) throw error;

      // Update local state
      const updatedGuests = guests.map(guest =>
        guest.id === guestId ? { ...guest, is_attending: attending } : guest
      );
      onGuestsUpdate(updatedGuests);

      setMessage('Veranderinge gestoor!');
      setTimeout(() => setMessage(''), 3000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage('Fout met stoor veranderinge. Probeer weer.');
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = () => {
    // Check of ten minste een persoon gaan bywoon
    const atLeastOneAttending = guests.some(guest => guest.is_attending);
    
    if (!atLeastOneAttending) {
      setMessage('Kies ten minste een persoon wat gaan bywoon.');
      return;
    }

    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentStep('complete');
  };

  const handleContinueToPayment = () => {
    // Hier sal ons na die werklike iKhoka betaling gaan
    alert('iKhoka betaling sal hier geïmplementeer word...');
  };

  // Final RSVP Complete Step
  if (currentStep === 'complete') {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6">
          <div className="text-green-600 text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#3d251e' }}>
            RSVP Voltooi!
          </h2>
          <p style={{ color: '#5c4033' }} className="mb-4">
            Dankie dat jy gereageer het op ons uitnodiging.
          </p>
          <p style={{ color: '#8b6c5c' }} className="text-sm">
            Ons sien uit daarna om hierdie spesiale dag met julle te deel!
          </p>
        </div>
      </div>
    );
  }

  // Payment Step
  if (currentStep === 'payment') {
    return (
      <PaymentStatus
        family={family}
        guests={guests}
        onPaymentComplete={handlePaymentComplete}
        onContinueToPayment={handleContinueToPayment}
      />
    );
  }

  // Attendance Step (oorspronklike inhoud)
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#3d251e' }}>
          Welkom, {family.family_name}!
        </h2>
        <p style={{ color: '#8b6c5c' }}>
          Kies wie van julle gesin gaan by die troue bywoon
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('Fout') 
            ? 'bg-red-50 border border-red-200 text-red-600'
            : 'bg-green-50 border border-green-200 text-green-600'
        }`}>
          {message}
        </div>
      )}

      {/* Guests List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200 mb-8">
        {guests.map((guest) => (
          <div key={guest.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium" style={{ color: '#3d251e' }}>{guest.name}</h3>
                <p className="text-sm" style={{ color: '#8b6c5c' }}>
                  {guest.is_adult ? 'Volwassene' : 'Kind'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleGuestAttendance(guest.id, true)}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg border ${
                    guest.is_attending
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Gaan Bywoon
                </button>
                
                <button
                  onClick={() => toggleGuestAttendance(guest.id, false)}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg border ${
                    !guest.is_attending
                      ? 'bg-red-100 border-red-300 text-red-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Gaan Nie Bywoon Nie
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="font-medium mb-2" style={{ color: '#3d251e' }}>Opsomming</h3>
        <p style={{ color: '#5c4033' }}>
          {guests.filter(g => g.is_attending).length} van {guests.length} gaste gaan bywoon
        </p>
        {guests.filter(g => g.is_attending && g.is_adult).length > 0 && (
          <p style={{ color: '#5c4033' }} className="mt-1">
            Deposito benodig: R{guests.filter(g => g.is_attending && g.is_adult).length * 300}
          </p>
        )}
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          disabled={saving}
          className="px-8 py-3 rounded-lg font-medium text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ backgroundColor: '#3d251e' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5c4033'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3d251e'}
        >
          {saving ? 'Stoor...' : 'Gaan na Betaling'}
        </button>
      </div>
    </div>
  );
}