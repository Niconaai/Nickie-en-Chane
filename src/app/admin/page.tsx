// src/app/admin/page.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import FamilyModal, { generateAlphanumericCode } from '../../components/admin/FamilyModal';
import FamilyList from '../../components/admin/FamilyList';
import GuestList from '../../components/admin/GuestList';
import PaymentsList from '../../components/admin/PaymentsList';
import AdminTabs from '../../components/admin/AdminTabs';
import { Family, Guest, Payment, FamilyFormData, GuestFormData, ModalType } from '../../components/admin/types';
import { RSVPSessionData } from '@/types/rsvp-session';

const ADMIN_PASSWORD = 'ThunderMerwe2026';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [families, setFamilies] = useState<Family[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'families' | 'guests' | 'payments'>('families');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('add-family');
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);
  const [familyForm, setFamilyForm] = useState<FamilyFormData>({
    email: '',
    invite_code: '',
    family_name: '',
    total_adults: 2,
    total_children: 0,
    rsvp_status: 'pending'
  });
  const [guestForm, setGuestForm] = useState<GuestFormData>({
    name: '',
    is_adult: true,
    is_attending: false,
    dietary_requirements: '',
    meal_preference: 'standard',
    song_request: '',
    drink_preferences: [],
    extra_notes: ''
  });
  const [sendingInviteId, setSendingInviteId] = useState<string | null>(null);
  const [sendingConfirmationId, setSendingConfirmationId] = useState<string | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: familiesData } = await supabase.from('families').select('*').order('created_at', { ascending: false });
    const { data: guestsData } = await supabase.from('guests').select('*').order('name');
    const { data: paymentsData } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
    if (familiesData) setFamilies(familiesData);
    if (guestsData) setGuests(guestsData);
    if (paymentsData) setPayments(paymentsData);
    setLoading(false);
  };

  const handleLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      loadData();
      return true;
    }
    return false;
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  const openAddFamilyModal = () => {
    setModalType('add-family');
    setCurrentFamily(null);
    setFamilyForm({ email: '', invite_code: generateAlphanumericCode(5), family_name: '', total_adults: 2, total_children: 0, rsvp_status: 'pending' });
    setShowModal(true);
  };

  const openEditFamilyModal = (family: Family) => {
    setModalType('edit-family');
    setCurrentFamily(family);
    setFamilyForm({ email: family.email, invite_code: family.invite_code, family_name: family.family_name, total_adults: family.total_adults, total_children: family.total_children, rsvp_status: family.rsvp_status });
    setShowModal(true);
  };

  const openEditGuestModal = (guest: Guest) => {
    setModalType('edit-guest');
    setCurrentGuest(guest);
    setGuestForm({ name: guest.name, is_adult: guest.is_adult, is_attending: guest.is_attending, dietary_requirements: guest.dietary_requirements || '', meal_preference: guest.meal_preference, song_request: guest.song_request || '', drink_preferences: guest.drink_preferences || [], extra_notes: guest.extra_notes || '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentFamily(null);
    setCurrentGuest(null);
  };

  const handleFamilyFormChange = (field: keyof FamilyFormData, value: string | number) => {
    setFamilyForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuestFormChange = (field: keyof GuestFormData, value: string | boolean | string[]) => {
    setGuestForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'add-family') {
      const { data, error } = await supabase.from('families').insert([familyForm]).select();
      if (error) { alert('Fout met byvoeg gesin: ' + error.message); return; }
      if (data) { setFamilies([data[0], ...families]); alert('Gesin suksesvol bygevoeg!'); }
    } else if (modalType === 'edit-family' && currentFamily) {
      const { error } = await supabase.from('families').update(familyForm).eq('id', currentFamily.id);
      if (error) { alert('Fout met wysig gesin: ' + error.message); return; }
      setFamilies(families.map(f => (f.id === currentFamily.id ? { ...f, ...familyForm } : f)));
      alert('Gesin suksesvol gewysig!');
    }
    closeModal();
  };

  const saveGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'edit-guest' && currentGuest) {
      const { error } = await supabase.from('guests').update(guestForm).eq('id', currentGuest.id);
      if (error) { alert('Fout met wysig gas: ' + error.message); return; }
      setGuests(guests.map(g => (g.id === currentGuest.id ? { ...g, ...guestForm } : g)));
      if (currentGuest.is_adult !== guestForm.is_adult) { await updateFamilyTotals(currentGuest.family_id); }
      alert('Gas suksesvol gewysig!');
      closeModal();
    }
  };
  
  const handleSave = (e: React.FormEvent) => {
    if (modalType.includes('family')) {
      saveFamily(e);
    } else if (modalType.includes('guest')) {
      saveGuest(e);
    }
  };

  const handleCreatePayment = async (familyId: string) => {
    const family = families.find(f => f.id === familyId);
    if (!family) { alert('Gesin nie gevind nie.'); return; }
    if (payments.find(p => p.family_id === familyId)) { alert(`Betaling bestaan reeds vir ${family.family_name}.`); return; }
    const depositAmount = family.total_adults * 30000;
    if (family.total_adults === 0) { alert(`${family.family_name} het geen volwassene gaste nie. Geen deposito nodig.`); return; }
    const { data, error } = await supabase.from('payments').insert([{ family_id: familyId, amount: depositAmount, payment_method: 'eft', payment_status: 'pending' }]).select();
    if (error) { alert('❌ Fout met skep betaling: ' + (error instanceof Error ? error.message : 'Onbekende fout')); return; }
    if (data) { setPayments([data[0], ...payments]); alert(`✅ Betaling geskep vir ${family.family_name}!\n${family.total_adults} volwassene(s) × R300 = R${(depositAmount / 100).toFixed(2)}`); }
  };

  const handleUpdatePayment = async (paymentId: string, updates: Partial<Payment>) => {
    const { error } = await supabase.from('payments').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', paymentId);
    if (error) { alert('Fout met opdateer betaling: ' + error); return; }
    setPayments(payments.map(p => (p.id === paymentId ? { ...p, ...updates } : p)));
    alert('Betaling suksesvol opgedateer!');
    if (updates.payment_status === 'paid') {
      const payment = payments.find(p => p.id === paymentId);
      if (payment) {
        const { error: familyError } = await supabase.from('families').update({ rsvp_status: 'submitted' }).eq('id', payment.family_id);
        if (!familyError) { setFamilies(families.map(f => (f.id === payment.family_id ? { ...f, rsvp_status: 'submitted' } : f))); }
      }
    }
  };

  const deleteFamily = async (id: string) => {
    if (!confirm('Is jy seker jy wil hierdie gesin skrap? Dit sal al die gaste ook skrap.')) return;
    const { error } = await supabase.from('families').delete().eq('id', id);
    if (error) { alert('Fout met skrap gesin: ' + error.message); return; }
    setFamilies(families.filter(f => f.id !== id));
    alert('Gesin suksesvol geskrap!');
  };

  const deleteGuest = async (id: string) => {
    const guestToDelete = guests.find(g => g.id === id);
    if (!guestToDelete) { alert('Gas nie gevind nie.'); return; }
    const { error } = await supabase.from('guests').delete().eq('id', id);
    if (error) { alert('Fout met byvoeg gas: ' + (error instanceof Error ? error.message : 'Onbekende fout')); return; }
    setGuests(guests.filter(g => g.id !== id));
    await updateFamilyTotals(guestToDelete.family_id);
    alert('Gas suksesvol geskrap!');
  };

  const addGuest = async (familyId: string, name: string, isAdult: boolean) => {
    const { data, error } = await supabase.from('guests').insert([{ family_id: familyId, name, is_adult: isAdult, is_attending: false, meal_preference: 'standard', song_request: '', drink_preferences: [], extra_notes: '' }]).select();
    if (error) { alert('Fout met byvoeg gas: ' + (error instanceof Error ? error.message : 'Onbekende fout')); return; }
    if (data) { setGuests([...guests, data[0]]); await updateFamilyTotals(familyId); alert('Gas suksesvol bygevoeg!'); }
  };
  
  const updateFamilyTotals = async (familyId: string) => {
    const { data: familyGuests, error } = await supabase.from('guests').select('is_adult').eq('family_id', familyId);
    if (error) { console.error('Error updating family totals'); return; }
    const total_adults = familyGuests.filter((g: { is_adult: boolean }) => g.is_adult).length;
    const total_children = familyGuests.filter((g: { is_adult: boolean }) => !g.is_adult).length;
    const { error: updateError } = await supabase.from('families').update({ total_adults, total_children }).eq('id', familyId);
    if (updateError) { console.error('Error updating family totals'); return; }
    setFamilies(families.map(f => (f.id === familyId ? { ...f, total_adults, total_children } : f)));
  };

  const handleSendInvite = async (familyId: string) => {
    if (!confirm('Are you sure you want to send an invitation email to this family?')) {
      return;
    }
    setSendingInviteId(familyId);
    try {
      // The Authorization header is no longer needed.
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ familyId }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invite.');
      }
      alert(result.message);
      setFamilies(families.map(f => f.id === familyId ? { ...f, invite_sent: true } : f));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setSendingInviteId(null);
    }
  };

  const handleResendConfirmation = async (familyId: string) => {
    if (!confirm('Are you sure you want to resend a confirmation email to this family?')) {
      return;
    }

    setSendingConfirmationId(familyId);
    try {
      // Find the specific family and their associated guests from the state.
      const family = families.find(f => f.id === familyId);
      if (!family) throw new Error('Family not found in state.');

      const familyGuests = guests.filter(g => g.family_id === familyId);

      const mockedSession: RSVPSessionData = {
        familyId: family.id,
        familyName: family.family_name,
        guests: familyGuests.map(g => ({
          id: g.id,
          name: g.name,
          is_adult: g.is_adult,
          is_attending: g.is_attending,
          songRequest: g.song_request || '',
          drinkPreferences: g.drink_preferences || [],
          extraNotes: g.extra_notes || '',
        })),
        currentStep: 'complete',
        submitted: true,
        depositOption: family.deposit_option,
      };

      // Call the existing confirmation API with the mocked data.
      const response = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockedSession),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send confirmation.');
      }
      alert(result.message);

      // Update the local state to instantly reflect the change in the UI.
      setFamilies(families.map(f =>
        f.id === familyId ? { ...f, confirmation_sent: true } : f
      ));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setSendingConfirmationId(null);
    }
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-[#3d251e] mb-2">Trou Admin</h1>
                        <p className="text-[#5c4033]">Voer die admin wagwoord in</p>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); const password = formData.get('password') as string; handleLogin(password); }} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#3d251e] mb-2">Admin Wagwoord</label>
                            <input id="password" name="password" type="password" className="w-full p-3 border border-gray-300 rounded-lg text-[#3d251e] focus:ring-2 focus:ring-[#3d251e] focus:border-transparent" placeholder="Voer wagwoord in" autoFocus required />
                        </div>
                        <button type="submit" className="w-full bg-[#3d251e] text-white py-3 rounded-lg hover:bg-[#5c4033] transition-colors font-medium">Teken In</button>
                    </form>
                </div>
            </div>
        </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-[#3d251e]">Laai...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#3d251e]">Trou Admin Paneel</h1>
          <div className="flex space-x-4">
            <Link href="/admin/liquor" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Manage Liquor</Link>
            <button onClick={openAddFamilyModal} className="bg-[#3d251e] text-white px-4 py-2 rounded-lg hover:bg-[#5c4033] transition-colors">Voeg Gesin By</button>
            <button onClick={handleLogout} className="bg-[#8b6c5c] text-white px-4 py-2 rounded-lg hover:bg-[#5c4033] transition-colors">Teken Uit</button>
          </div>
        </div>

        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} familiesCount={families.length} guestsCount={guests.length} paymentsCount={payments.length} />

        {activeTab === 'families' && (
          <FamilyList
            families={families}
            guests={guests}
            payments={payments}
            onEditFamily={openEditFamilyModal}
            onEditGuest={openEditGuestModal}
            onDeleteFamily={deleteFamily}
            onDeleteGuest={deleteGuest}
            onAddGuest={addGuest}
            onCreatePayment={handleCreatePayment}
            onUpdatePayment={handleUpdatePayment}
            onSendInvite={handleSendInvite}
            sendingInviteId={sendingInviteId}
            onResendConfirmation={handleResendConfirmation}
            sendingConfirmationId={sendingConfirmationId}
          />
        )}
        {activeTab === 'guests' && <GuestList guests={guests} families={families} />}
        {activeTab === 'payments' && <PaymentsList payments={payments} families={families} onUpdatePayment={handleUpdatePayment} />}
        
        <FamilyModal isOpen={showModal} modalType={modalType} family={currentFamily} guest={currentGuest} familyForm={familyForm} guestForm={guestForm} onFamilyFormChange={handleFamilyFormChange} onGuestFormChange={handleGuestFormChange} onSave={handleSave} onClose={closeModal} onDeleteGuest={currentGuest ? () => deleteGuest(currentGuest.id) : undefined} />
      </div>
    </div>
  );
}