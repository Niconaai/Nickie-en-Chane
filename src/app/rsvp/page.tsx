'use client';

import { useState, useEffect } from 'react';
import RSVPLogin from '../../components/rsvp/RSVPLogin';
import FamilyOverview from '../../components/rsvp/FamilyOverview';
import { Family, Guest, Payment } from '../../components/admin/types';
import {
  getRSVPSession,
  saveRSVPSession,
  createNewSession,
  clearRSVPSession
} from '../../utils/rsvp-session';
import { RSVPSessionData } from '../../types/rsvp-session';
import { supabase } from '@/lib/supabase';
import RSVPSummary from '../../components/rsvp/RSVPSummary';

export default function RSVPPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [family, setFamily] = useState<Family | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<RSVPSessionData | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Volledige loadData funksie
  // Volledige loadData funksie
  const loadData = async () => {
    setLoading(true);
    try {
      // Load families
      const { data: familiesData } = await supabase
        .from('families')
        .select('*')
        .order('created_at', { ascending: false });

      // Load guests
      const { data: guestsData } = await supabase
        .from('guests')
        .select('*')
        .order('name');

      // Load payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (familiesData && familiesData.length > 0) {
        // As ons net een familie nodig het, gebruik die eerste een
        // Maar in RSVP konteks, werk ons net met een familie per sessie
        // So ons hoef nie die hele families lys te stoor nie
      }

      if (guestsData) setGuests(guestsData);
      if (paymentsData) setPayments(paymentsData);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

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

          // Laai payments
          const { data: paymentsData } = await supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false });

          setFamily(familyData);
          setGuests(guestsData || []);
          setPayments(paymentsData || []);
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
    } else {
      // Laai payments vir alle gevalle
      const loadPayments = async () => {
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });

        if (paymentsData) setPayments(paymentsData);
      };
      loadPayments();
    }
  }, []);

  const handleCancelRSVP = async () => {
    if (confirm('Is jy seker jy wil hierdie RSVP kanselleer? Alle veranderinge sal verlore gaan.')) {
      try {
        // 1. Reset familie status na "pending"
        if (family) {
          const { error } = await supabase
            .from('families')
            .update({ rsvp_status: 'pending' })
            .eq('id', family.id);

          if (error) throw error;
        }

        // 2. Clear alles en reset na login screen
        clearRSVPSession();
        setIsLoggedIn(false);
        setFamily(null);
        setGuests([]);
        setSession(null);

        // 3. Toon 'n bevestiging (opsioneel)
        alert('RSVP gekanselleer. Jy kan weer begin wanneer jy gereed is.');

      } catch (error) {
        console.error('Cancel error:', error);
        alert('Fout met kanselleer. Probeer weer.');
      }
    }
  };

  const handleSuccessfulLogin = async (familyData: Family, guestsData: Guest[]) => {
    setFamily(familyData);
    setGuests(guestsData);

    // Laai payments
    const { data: paymentsData } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (paymentsData) setPayments(paymentsData);

    // Check of familie reeds RSVP ingedien het
    if (familyData.rsvp_status === 'submitted') {
      // Toon opsomming bladsy direk
      const summarySession: RSVPSessionData = {
        familyId: familyData.id,
        familyName: familyData.family_name,
        guests: guestsData.map(guest => ({
          id: guest.id,
          name: guest.name,
          is_adult: guest.is_adult,
          is_attending: guest.is_attending,
          songRequest: guest.song_request || '',
          drinkPreferences: guest.drink_preferences || [],
          extraNotes: guest.extra_notes || ''
        })),
        currentStep: 'complete' as const,
        submitted: true,
        depositOption: familyData.deposit_option as 'gift' | 'refund'
      };
      setSession(summarySession);
      setIsLoggedIn(true);
      return;
    }

    // Anders, gaan voort met gewone RSVP vloei
    const existingSession = getRSVPSession();
    if (existingSession && existingSession.familyId === familyData.id && !existingSession.submitted) {
      setSession(existingSession);
    } else {
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
        {/* Header - Sentreer die titel */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold" style={{ color: '#3d251e' }}>RSVP</h1>
                {isLoggedIn && family && (
                  <div className="flex items-center space-x-4">
                    <span style={{ color: '#5c4033' }}>Hallo, hierdie moet regs wees {family.family_name}</span> 
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
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {!isLoggedIn ? (
            <RSVPLogin
              onLoginSuccess={handleSuccessfulLogin}
              onLoadingChange={setLoading}
            />
          ) : family && session ? (
            // Check of RSVP reeds ingedien is
            session.submitted || family.rsvp_status === 'submitted' ? (
              <RSVPSummary
                familyName={family.family_name}
                session={session}
                familyId={family.id}
                payments={payments}
                onLogout={handleLogout}
              />
            ) : (
              <FamilyOverview
                family={family}
                guests={guests}
                session={session}
                onSessionUpdate={updateSession}
                onGuestsUpdate={handleGuestsUpdate}
                onLogout={handleLogout}
                onCancelRSVP={handleCancelRSVP}
              />
            )
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