'use client';

import { useState } from 'react';
import { RSVPSessionData } from '@/types/rsvp-session';
import { updateGuestSongRequest, updateSessionStep } from '@/utils/rsvp-session';

interface SongStepProps {
  session: RSVPSessionData;
  onSessionUpdate: (session: RSVPSessionData) => void;
  onBack: () => void;
}

export default function SongStep({ session, onSessionUpdate, onBack }: SongStepProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Slegs gaste wat bywoon
  const attendingGuests = session.guests.filter(guest => guest.is_attending);

  const handleSongChange = (guestId: string, songRequest: string) => {
    const updatedSession = updateGuestSongRequest(session, guestId, songRequest);
    onSessionUpdate(updatedSession);
  };

  const handleContinue = () => {
    // Check of elke guest wat bywoon 'n liedjie het
    const guestsWithoutSongs = attendingGuests.filter(guest => !guest.songRequest.trim());
    
    if (guestsWithoutSongs.length > 0) {
      setMessage(`Verskaf asseblief 'n liedjie vir: ${guestsWithoutSongs.map(g => g.name).join(', ')}`);
      return;
    }

    // Gaan na volgende stap
    const updatedSession = updateSessionStep(session, 'drinks');
    onSessionUpdate(updatedSession);
  };

  if (attendingGuests.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#3d251e' }}>
          Liedjie Versoeke
        </h2>
        <p style={{ color: '#8b6c5c' }} className="mb-6">
          Geen gaste gaan bywoon nie - gaan voort na volgende stap.
        </p>
        <button
          onClick={() => {
            const updatedSession = updateSessionStep(session, 'drinks');
            onSessionUpdate(updatedSession);
          }}
          className="px-6 py-2 rounded-lg text-white"
          style={{ backgroundColor: '#3d251e' }}
        >
          Volgende
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#3d251e' }}>
          Liedjie Versoeke
        </h2>
        <p style={{ color: '#8b6c5c' }}>
          Kies &apos;n liedjie wat jy graag op die dansvloer wil hoor
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-red-600">
          {message}
        </div>
      )}

      {/* Guests List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200 mb-8">
        {attendingGuests.map((guest) => (
          <div key={guest.id} className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2" style={{ color: '#3d251e' }}>
                {guest.name}
              </h3>
              <p className="text-sm mb-4" style={{ color: '#8b6c5c' }}>
                Kies &apos;n liedjie wat jy graag wil hoor
              </p>
              
              <input
                type="text"
                value={guest.songRequest || ''}
                onChange={(e) => handleSongChange(guest.id, e.target.value)}
                placeholder="Bv. Sweet Caroline - Neil Diamond"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                style={{ color: '#3d251e' }}
              />
              <p className="text-xs mt-1" style={{ color: '#8b6c5c' }}>
                Voer liedjie naam en kunstenaar in
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Terug
        </button>
        
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