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
import { supabase } from '@/lib/supabase';

export default function RSVPPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [family, setFamily] = useState<Family | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<RSVPSessionData | null>(null);

  // Check for existing session on component mount
  // Check for existing session on component mount
  useEffect(() => {
    const existingSession = getRSVPSession();
    if (existingSession && !existingSession.submitted) {
      // Probeer die familie data laai gebaseer op session
      const loadFamilyFromSession = async () => {
        setLoading(true);
        try {
          const { data: familyData, error } = await supabase
            .from('families')
            .select('*')
            .eq('id', existingSession.familyId)
            .single();

          if (error || !familyData) {
            // Familie nie gevind nie - clear session
            console.error('Family not found for session:', existingSession.familyId);
            clearRSVPSession();
            setLoading(false);
            return;
          }

          // Laai gaste
          const { data: guestsData } = await supabase
            .from('guests')
            .select('*')
            .eq('family_id', existingSession.familyId)
            .order('is_adult', { ascending: false })
            .order('name');

          setFamily(familyData);
          setGuests(guestsData || []);
          setSession(existingSession);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error loading session data:', error);
          clearRSVPSession();
        } finally {
          setLoading(false);
        }
      };

      loadFamilyFromSession();
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
            <div className="max-w-md mx-auto text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-6">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#3d251e' }}>
                  Sessie Fout
                </h3>
                <p style={{ color: '#5c4033' }} className="mb-4">
                  Daar was &apos;n fout met die laai jou RSVP data.
                </p>
                <p style={{ color: '#8b6c5c' }} className="text-sm mb-4">
                  Dit kan wees omdat die sessie verval het, of daar was &apos;n fout.
                </p>
              </div>

              <button
                onClick={() => {
                  // Clear alles en gaan terug na login
                  clearRSVPSession();
                  setIsLoggedIn(false);
                  setFamily(null);
                  setGuests([]);
                  setSession(null);
                }}
                className="px-8 py-3 rounded-lg font-medium text-white transition-colors"
                style={{ backgroundColor: '#3d251e' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5c4033'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3d251e'}
              >
                Teken Weer In
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
