'use client';

import { useState } from 'react';
import { RSVPSessionData } from '@/types/rsvp-session';
import { updateGuestNotes, updateSessionStep } from '@/utils/rsvp-session';

interface NotesStepProps {
  session: RSVPSessionData;
  onSessionUpdate: (session: RSVPSessionData) => void;
  onBack: () => void;
  onCancelRSVP: () => void;
}

export default function NotesStep({ session, onSessionUpdate, onBack, onCancelRSVP }: NotesStepProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Slegs gaste wat bywoon
  const attendingGuests = session.guests.filter(guest => guest.is_attending);

  const handleNotesChange = (guestId: string, notes: string) => {
    const updatedSession = updateGuestNotes(session, guestId, notes);
    onSessionUpdate(updatedSession);
  };

  const handleContinue = () => {
    setSaving(true);

    // Gaan na betaling stap
    const updatedSession = updateSessionStep(session, 'payment');
    onSessionUpdate(updatedSession);

    setSaving(false);
  };

  if (attendingGuests.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#3d251e' }}>
          Addisionele Notas
        </h2>
        <p style={{ color: '#8b6c5c' }} className="mb-6">
          Geen gaste gaan bywoon nie - gaan voort na betaling.
        </p>
        <button
          onClick={() => {
            const updatedSession = updateSessionStep(session, 'payment');
            onSessionUpdate(updatedSession);
          }}
          className="px-6 py-2 rounded-lg text-white"
          style={{ backgroundColor: '#3d251e' }}
        >Gaan na Betaling</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#3d251e' }}>
          Addisionele Notas
        </h2>
        <p style={{ color: '#8b6c5c' }}>
          Laat enige addisionele notas of spesiale versoeke
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
        {attendingGuests.map((guest) => (
          <div key={guest.id} className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-3" style={{ color: '#3d251e' }}>
                {guest.name}
              </h3>

              <div className="space-y-2">
                <label htmlFor={`notes-${guest.id}`} className="block text-sm font-medium" style={{ color: '#5c4033' }}>
                  Notas vir {guest.name}:
                </label>
                <textarea
                  id={`notes-${guest.id}`}
                  value={guest.extraNotes || ''}
                  onChange={(e) => handleNotesChange(guest.id, e.target.value)}
                  placeholder="Bv. Naam verkeerd gespel, allergie, spesiale versoeke, ens."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent resize-none"
                  style={{ color: '#3d251e' }}
                />
                <p className="text-xs" style={{ color: '#8b6c5c' }}>
                  Laatweet ons van enige spesiale notas, allergieë, of as jou naam verkeerd gespel is.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Terug
        </button>

        <div className="flex space-x-4">
          <button
            onClick={onCancelRSVP}
            className="px-4 py-3 text-red-600 hover:text-red-800 underline"
          >
            Kanselleer RSVP
          </button>

          <button
            onClick={handleContinue}
            className="px-8 py-3 rounded-lg font-medium text-white text-lg"
            style={{ backgroundColor: '#3d251e' }}
          >
            Volgende
          </button>
        </div>
      </div>
    </div>
  );
}