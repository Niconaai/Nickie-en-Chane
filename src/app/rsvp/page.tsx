'use client';

import { useState, useEffect } from 'react';
import RSVPLogin from '../../components/rsvp/RSVPLogin';
import FamilyOverview from '../../components/rsvp/FamilyOverview';
import { Family, Guest } from '../../components/admin/types';
import { 
  getRSVPSession, 
  saveRSVPSession, 
  createNewSession, 
  clearRSVPSession 
} from '../../utils/rsvp-session';
import { RSVPSessionData } from '../../types/rsvp-session';

export default function RSVPPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [family, setFamily] = useState<Family | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<RSVPSessionData | null>(null);

  // Check for existing session on component mount
  useEffect(() => {
    const existingSession = getRSVPSession();
    if (existingSession && !existingSession.submitted) {
      setSession(existingSession);
      setIsLoggedIn(true);
      // We'll need to load the family data based on session.familyId
      // For now, we'll handle this when we implement the full flow
    }
  }, []);

  const handleSuccessfulLogin = (familyData: Family, guestsData: Guest[]) => {
    setFamily(familyData);
    setGuests(guestsData);
    
    // Check if there's an existing session for this family
    const existingSession = getRSVPSession();
    if (existingSession && existingSession.familyId === familyData.id && !existingSession.submitted) {
      // Continue with existing session
      setSession(existingSession);
    } else {
      // Create new session
      const newSession = createNewSession(familyData.id, familyData.family_name, guestsData);
      setSession(newSession);
      saveRSVPSession(newSession);
    }
    
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFamily(null);
    setGuests([]);
    setSession(null);
    clearRSVPSession();
  };

  const updateSession = (updatedSession: RSVPSessionData) => {
    setSession(updatedSession);
    saveRSVPSession(updatedSession);
  };

  const handleGuestsUpdate = (updatedGuests: Guest[]) => {
    setGuests(updatedGuests);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-xl" style={{ color: '#8b6c5c' }}>Laai...</div>
      </div>
    );
  }

  return (
    <>
      <title>C&N | RSVP</title>
      <div className="min-h-screen bg-transparent">
        {/* ... bestaande header ... */}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {!isLoggedIn ? (
            <RSVPLogin
              onLoginSuccess={handleSuccessfulLogin}
              onLoadingChange={setLoading}
            />
          ) : family && session ? (
            <FamilyOverview
              family={family}
              guests={guests}
              session={session}
              onSessionUpdate={updateSession}
              onGuestsUpdate={handleGuestsUpdate} 
              onLogout={handleLogout}
            />
          ) : (
            <div className="text-center" style={{ color: '#8b6c5c' }}>
              Fout met laai gesin data. Probeer weer.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
