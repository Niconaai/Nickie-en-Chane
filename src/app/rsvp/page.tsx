'use client';

import { useState } from 'react';
import RSVPLogin from '@/components/rsvp/RSVPLogin';
import FamilyOverview from '@/components/rsvp/FamilyOverview';
import { Family, Guest } from '@/components/admin/types';

export default function RSVPPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [family, setFamily] = useState<Family | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSuccessfulLogin = (familyData: Family, guestsData: Guest[]) => {
    setFamily(familyData);
    setGuests(guestsData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFamily(null);
    setGuests([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl" style={{ color: '#8b6c5c' }}>Laai...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Sentreer die titel */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold" style={{ color: '#3d251e' }}>RSVP</h1>
            </div>
            {isLoggedIn && family && (
              <div className="flex items-center space-x-4">
                <span style={{ color: '#5c4033' }}>Hallo, {family.family_name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm hover:underline"
                  style={{ color: '#8b6c5c' }}
                >
                  Teken Uit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!isLoggedIn ? (
          <RSVPLogin 
            onLoginSuccess={handleSuccessfulLogin}
            onLoadingChange={setLoading}
          />
        ) : family ? (
          <FamilyOverview 
            family={family}
            guests={guests}
            onGuestsUpdate={setGuests}
          />
        ) : (
          <div className="text-center" style={{ color: '#8b6c5c' }}>
            Fout met laai gesin data. Probeer weer.
          </div>
        )}
      </div>
    </div>
  );
}