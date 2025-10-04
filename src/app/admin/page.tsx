'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import FamilyModal from '@/components/admin/FamilyModal';
import FamilyList from '@/components/admin/FamilyList';
import GuestList from '@/components/admin/GuestList';
import PaymentsList from '@/components/admin/PaymentsList';
import AdminTabs from '@/components/admin/AdminTabs';
import { Family, Guest, Payment, FamilyFormData, GuestFormData, ModalType } from '@/components/admin/types';

// Hard-coded admin wagwoord - verander dit na iets veilig!
const ADMIN_PASSWORD = 'ThunderMerwe2026';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [families, setFamilies] = useState<Family[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'families' | 'guests' | 'payments'>('families');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('add-family');
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);

  // Form states
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
    meal_preference: 'standard'
  });

  // Check of gebruiker reeds ingeteken is (bv. na page refresh)
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

    if (familiesData) setFamilies(familiesData);
    if (guestsData) setGuests(guestsData);
    if (paymentsData) setPayments(paymentsData);
    setLoading(false);
  };

  // Login funksie
  const handleLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      loadData();
      return true;
    }
    return false;
  };

  // Logout funksie
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  // Family modal functions
  const openAddFamilyModal = () => {
    setModalType('add-family');
    setCurrentFamily(null);
    setFamilyForm({
      email: '',
      invite_code: '',
      family_name: '',
      total_adults: 2,
      total_children: 0,
      rsvp_status: 'pending'
    });
    setShowModal(true);
  };

  const openEditFamilyModal = (family: Family) => {
    setModalType('edit-family');
    setCurrentFamily(family);
    setFamilyForm({
      email: family.email,
      invite_code: family.invite_code,
      family_name: family.family_name,
      total_adults: family.total_adults,
      total_children: family.total_children,
      rsvp_status: family.rsvp_status
    });
    setShowModal(true);
  };

  // Guest modal functions
  const openEditGuestModal = (guest: Guest) => {
    setModalType('edit-guest');
    setCurrentGuest(guest);
    setGuestForm({
      name: guest.name,
      is_adult: guest.is_adult,
      is_attending: guest.is_attending,
      dietary_requirements: guest.dietary_requirements || '',
      meal_preference: guest.meal_preference
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentFamily(null);
    setCurrentGuest(null);
  };

  const handleFamilyFormChange = (field: keyof FamilyFormData, value: string | number) => {
    setFamilyForm(prev => ({ ...prev, [field]: value }));
  };

  const handleGuestFormChange = (field: keyof GuestFormData, value: string | boolean) => {
    setGuestForm(prev => ({ ...prev, [field]: value }));
  };

  // Save operations
  const saveFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalType === 'add-family') {
      const { data, error } = await supabase
        .from('families')
        .insert([familyForm])
        .select();

      if (error) {
        alert('Fout met byvoeg gesin: ' + error.message);
        return;
      }

      if (data) {
        setFamilies([data[0], ...families]);
        alert('Gesin suksesvol bygevoeg!');
      }
    } else if (modalType === 'edit-family') {
      if (!currentFamily) return;
      
      const { error } = await supabase
        .from('families')
        .update(familyForm)
        .eq('id', currentFamily.id);

      if (error) {
        alert('Fout met wysig gesin: ' + error.message);
        return;
      }

      setFamilies(families.map(f => 
        f.id === currentFamily.id ? { ...f, ...familyForm } : f
      ));
      alert('Gesin suksesvol gewysig!');
    }

    closeModal();
  };

  const saveGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalType === 'edit-guest' && currentGuest) {
      const { error } = await supabase
        .from('guests')
        .update(guestForm)
        .eq('id', currentGuest.id);

      if (error) {
        alert('Fout met wysig gas: ' + error.message);
        return;
      }

      setGuests(guests.map(g => 
        g.id === currentGuest.id ? { ...g, ...guestForm } : g
      ));
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

  // Calculate deposit using family's total_adults (eenvoudig en betroubaar)
const calculateDeposit = (familyId: string) => {
  const family = families.find(f => f.id === familyId);
  if (!family) {
    console.error('Family not found:', familyId);
    return 0;
  }
  
  const amount = family.total_adults * 30000;
  console.log(`Deposit for ${family.family_name}: ${family.total_adults} adults × R300 = R${(amount / 100).toFixed(2)}`);
  return amount;
};

// Create payment for a family
const handleCreatePayment = async (familyId: string) => {
  try {
    const family = families.find(f => f.id === familyId);
    if (!family) {
      alert('Gesin nie gevind nie.');
      return;
    }

    // Check if payment already exists
    const existingPayment = payments.find(p => p.family_id === familyId);
    if (existingPayment) {
      alert(`Betaling bestaan reeds vir ${family.family_name}.`);
      return;
    }

    // Bereken deposito gebaseer op total_adults
    const depositAmount = family.total_adults * 30000;

    if (family.total_adults === 0) {
      alert(`${family.family_name} het geen volwassene gaste nie. Geen deposito nodig.`);
      return;
    }

    const { data, error } = await supabase
      .from('payments')
      .insert([{
        family_id: familyId,
        amount: depositAmount,
        payment_method: 'eft',
        payment_status: 'pending'
      }])
      .select();

    if (error) throw error;

    if (data) {
      setPayments([data[0], ...payments]);
      alert(`✅ Betaling geskep vir ${family.family_name}!\n${family.total_adults} volwassene(s) × R300 = R${(depositAmount / 100).toFixed(2)}`);
    }

  } catch (error) {
    console.error('Full error details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';
    alert('❌ Fout met skep betaling: ' + errorMessage);
  }
};

  // Update payment
  const handleUpdatePayment = async (paymentId: string, updates: Partial<Payment>) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;

      // Update local state
      setPayments(payments.map(p => 
        p.id === paymentId ? { ...p, ...updates } : p
      ));

      alert('Betaling suksesvol opgedateer!');

      // If payment marked as paid, also update family RSVP status to allow RSVP
      if (updates.payment_status === 'paid') {
        const payment = payments.find(p => p.id === paymentId);
        if (payment) {
          // Update family RSVP status to submitted (allow them to RSVP)
          const { error: familyError } = await supabase
            .from('families')
            .update({ rsvp_status: 'submitted' })
            .eq('id', payment.family_id);

          if (!familyError) {
            setFamilies(families.map(f => 
              f.id === payment.family_id ? { ...f, rsvp_status: 'submitted' } : f
            ));
          }
        }
      }

    } catch (error) {
      alert('Fout met opdateer betaling: ' + error);
    }
  };

  // Delete operations
  const deleteFamily = async (id: string) => {
    if (!confirm('Is jy seker jy wil hierdie gesin skrap? Dit sal al die gaste ook skrap.')) {
      return;
    }

    const { error } = await supabase
      .from('families')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Fout met skrap gesin: ' + error.message);
      return;
    }

    setFamilies(families.filter(f => f.id !== id));
    alert('Gesin suksesvol geskrap!');
  };

  const deleteGuest = async (id: string) => {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Fout met skrap gas: ' + error.message);
      return;
    }

    setGuests(guests.filter(g => g.id !== id));
    alert('Gas suksesvol geskrap!');
  };

  // Add guest
  const addGuest = async (familyId: string, name: string, isAdult: boolean) => {
    const { data, error } = await supabase
      .from('guests')
      .insert([{
        family_id: familyId,
        name,
        is_adult: isAdult,
        is_attending: false,
        meal_preference: 'standard'
      }])
      .select();

    if (error) {
      alert('Fout met byvoeg gas: ' + error.message);
      return;
    }

    if (data) {
      setGuests([...guests, data[0]]);
      alert('Gas suksesvol bygevoeg!');
    }
  };

  // Toon login screen as nie geauthentiseer nie
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Trou Admin</h1>
              <p className="text-gray-600">Voer die admin wagwoord in</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const password = formData.get('password') as string;
              handleLogin(password);
            }} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Wagwoord
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  placeholder="Voer wagwoord in"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
              >
                Teken In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-800">Laai...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trou Admin Paneel</h1>
          <div className="flex space-x-4">
            <button
              onClick={openAddFamilyModal}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Voeg Gesin By
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Teken Uit
            </button>
          </div>
        </div>

        <AdminTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          familiesCount={families.length}
          guestsCount={guests.length}
          paymentsCount={payments.length}
        />

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
          />
        )}

        {activeTab === 'guests' && (
          <GuestList
            guests={guests}
            families={families}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsList
            payments={payments}
            families={families}
            onUpdatePayment={handleUpdatePayment}
          />
        )}

        <FamilyModal
          isOpen={showModal}
          modalType={modalType}
          family={currentFamily}
          guest={currentGuest}
          familyForm={familyForm}
          guestForm={guestForm}
          onFamilyFormChange={handleFamilyFormChange}
          onGuestFormChange={handleGuestFormChange}
          onSave={handleSave}
          onClose={closeModal}
          onDeleteGuest={currentGuest ? () => deleteGuest(currentGuest.id) : undefined}
        />
      </div>
    </div>
  );
}