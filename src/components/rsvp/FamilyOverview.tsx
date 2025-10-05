'use client';

import { useState } from 'react';
import PaymentStatus from './PaymentStatus';
import { Family, Guest } from '@/components/admin/types';
import { supabase } from '@/lib/supabase';
import { RSVPSessionData } from '@/types/rsvp-session';
import { updateGuestAttendance, updateSessionStep } from '@/utils/rsvp-session';
import SongStep from './SongStep';
import DrinkStep from './DrinkStep';
import NotesStep from './NotesStep';
import { clearRSVPSession } from '@/utils/rsvp-session';

interface FamilyOverviewProps {
  family: Family;
  guests: Guest[];
  session: RSVPSessionData;
  onSessionUpdate: (updatedSession: RSVPSessionData) => void;
  onGuestsUpdate: (guests: Guest[]) => void;
  onLogout: () => void;
}

type RSVPStep = 'attendance' | 'songs' | 'drinks' | 'notes' | 'payment' | 'complete';

export default function FamilyOverview({
  family,
  guests,
  session,
  onSessionUpdate,
  onGuestsUpdate: _onGuestsUpdate,
  onLogout: _onLogout
}: FamilyOverviewProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // En in toggleGuestAttendance, verwyder die error veranderlike:
  const toggleGuestAttendance = async (guestId: string, attending: boolean) => {
    setSaving(true);
    setMessage('');

    try {
      const updatedSession = updateGuestAttendance(session, guestId, attending);
      onSessionUpdate(updatedSession);
      setMessage('Veranderinge gestoor!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Fout met stoor veranderinge. Probeer weer.');
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = () => {
    // Check of ten minste een persoon gaan bywoon
    const atLeastOneAttending = session.guests.some(guest => guest.is_attending);

    if (!atLeastOneAttending) {
      setMessage('Kies ten minste een persoon wat gaan bywoon, of kliek "Niemand Gaan Bywoon Nie".');
      return;
    }

    // Gaan na volgende stap
    const updatedSession = updateSessionStep(session, 'songs');
    onSessionUpdate(updatedSession);
  };

  const handleBack = () => {
    // Gaan terug na vorige stap
    const updatedSession = updateSessionStep(session, 'attendance');
    onSessionUpdate(updatedSession);
  };

  const handlePaymentComplete = () => {
    const updatedSession = updateSessionStep(session, 'complete');
    onSessionUpdate(updatedSession);
  };

  const handleContinueToPayment = () => {
    // Hier sal ons na die werklike iKhoka betaling gaan
    alert('iKhoka betaling sal hier geïmplementeer word...');
  };

  const handleFinalSubmission = async () => {
    setSaving(true);
    setMessage('');

    try {
      // 1. Update familie RSVP status
      const { error: familyError } = await supabase
        .from('families')
        .update({
          rsvp_status: 'submitted',
          updated_at: new Date().toISOString()
        })
        .eq('id', family.id);

      if (familyError) throw familyError;

      // 2. Update elke guest in die database
      for (const guest of session.guests) {
        const { error: guestError } = await supabase
          .from('guests')
          .update({
            is_attending: guest.is_attending,
            song_request: guest.songRequest,
            drink_preferences: guest.drinkPreferences,
            extra_notes: guest.extraNotes,
            updated_at: new Date().toISOString()
          })
          .eq('id', guest.id);

        if (guestError) throw guestError;
      }

      // 3. Merk session as submitted en clear dit
      const updatedSession: RSVPSessionData = {
        ...session,
        submitted: true,
        currentStep: 'complete' as const // ✅ FIX: gebruik 'as const'
      };
      onSessionUpdate(updatedSession);

      setMessage('RSVP suksesvol ingedien! Dankie!');

      // 4. Clear session na 'n paar sekondes
      setTimeout(() => {
        clearRSVPSession();
      }, 3000);

    } catch (error) {
      console.error('Fout met final submission:', error);
      setMessage('Fout met indien RSVP. Probeer weer.');
    } finally {
      setSaving(false);
    }
  };

  // Final RSVP Complete Step
  if (session.currentStep === 'complete') {
    const attendingGuests = session.guests.filter(g => g.is_attending);
    const noOneAttending = attendingGuests.length === 0;

    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6">
          <div className="text-green-600 text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#3d251e' }}>
            {noOneAttending ? 'RSVP Ontvang' : 'RSVP Voltooi!'}
          </h2>

          {noOneAttending ? (
            <p style={{ color: '#5c4033' }} className="mb-4">
              Ons neem kennis dat niemand van julle gesin kan bywoon nie.
            </p>
          ) : (
            <>
              <p style={{ color: '#5c4033' }} className="mb-4">
                Dankie dat jy gereageer het op ons uitnodiging.
              </p>
              <div className="text-left bg-white p-4 rounded border mt-4">
                <h4 className="font-medium mb-2" style={{ color: '#3d251e' }}>Jou RSVP Opsomming:</h4>
                <p style={{ color: '#5c4033' }} className="text-sm">
                  • {attendingGuests.length} {attendingGuests.length === 1 ? 'persoon' : 'persone'} gaan bywoon
                </p>
                {attendingGuests.some(g => g.songRequest) && (
                  <p style={{ color: '#5c4033' }} className="text-sm">
                    • Liedjie versoeke ontvang
                  </p>
                )}
                {attendingGuests.some(g => g.drinkPreferences.length > 0) && (
                  <p style={{ color: '#5c4033' }} className="text-sm">
                    • Drank voorkeure ontvang
                  </p>
                )}
              </div>
            </>
          )}

          <p style={{ color: '#8b6c5c' }} className="text-sm mt-4">
            Ons sien uit daarna om hierdie spesiale dag met julle te deel!
          </p>
        </div>

        {!session.submitted && (
          <button
            onClick={handleFinalSubmission}
            disabled={saving}
            className="px-8 py-3 rounded-lg font-medium text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: '#3d251e' }}
          >
            {saving ? 'Stoor...' : 'Finaliseer RSVP'}
          </button>
        )}

        {session.submitted && (
          <p style={{ color: '#8b6c5c' }} className="text-sm">
            Jou RSVP is suksesvol gestoor. Hierdie blad sal binnekort sluit.
          </p>
        )}
      </div>
    );
  }

  // Payment Step
  if (session.currentStep === 'payment') {
    return (
      <PaymentStatus
        family={family}
        guests={guests}
        session={session}
        onPaymentComplete={handlePaymentComplete}
        onContinueToPayment={handleContinueToPayment}
        onBack={handleBack}
      />
    );
  }

  //song step
  if (session.currentStep === 'songs') {
    return (
      <SongStep
        session={session}
        onSessionUpdate={onSessionUpdate}
        onBack={handleBack}
      />
    );
  }

  //drink step
  if (session.currentStep === 'drinks') {
    return (
      <DrinkStep
        session={session}
        onSessionUpdate={onSessionUpdate}
        onBack={() => {
          const updatedSession = updateSessionStep(session, 'songs');
          onSessionUpdate(updatedSession);
        }}
      />
    );
  }

  // Notes Step 
  if (session.currentStep === 'notes') {
    return (
      <NotesStep
        session={session}
        onSessionUpdate={onSessionUpdate}
        onBack={() => {
          const updatedSession = updateSessionStep(session, 'drinks');
          onSessionUpdate(updatedSession);
        }}
      />
    );
  }

  // Attendance Step (oorspronklike inhoud - aangepas vir session)
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
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Fout')
          ? 'bg-red-50 border border-red-200 text-red-600'
          : 'bg-green-50 border border-green-200 text-green-600'
          }`}>
          {message}
        </div>
      )}

      {/* Guests List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200 mb-8">
        {session.guests.map((guest) => (
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
                  className={`px-4 py-2 rounded-lg border ${guest.is_attending
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Gaan Bywoon
                </button>

                <button
                  onClick={() => toggleGuestAttendance(guest.id, false)}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg border ${!guest.is_attending
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
          {session.guests.filter(g => g.is_attending).length} van {session.guests.length} gaste gaan bywoon
        </p>
        {session.guests.filter(g => g.is_attending && g.is_adult).length > 0 && (
          <p style={{ color: '#5c4033' }} className="mt-1">
            Deposito benodig: R{session.guests.filter(g => g.is_attending && g.is_adult).length * 300}
          </p>
        )}
      </div>

      {/* Niemand Gaan Bywoon Nie Button */}
      <div className="text-center mb-4">
        <button
          onClick={() => {
            const confirmNone = confirm('Is jy seker niemand van julle gesin gaan bywoon nie?');
            if (confirmNone) {
              // Merk almal as nie bywonend nie
              let updatedSession = session;
              session.guests.forEach(guest => {
                updatedSession = updateGuestAttendance(updatedSession, guest.id, false);
              });
              updatedSession = updateSessionStep(updatedSession, 'complete');
              onSessionUpdate(updatedSession);
              setMessage('RSVP as "nie bywonend" gestoor.');
            }
          }}
          className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Niemand Gaan Bywoon Nie
        </button>
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
          {saving ? 'Stoor...' : 'Volgende'}
        </button>
      </div>
    </div>
  );
}