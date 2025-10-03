'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import FamilyModal from '@/components/admin/FamilyModal';
import FamilyList from '@/components/admin/FamilyList';
import GuestList from '@/components/admin/GuestList';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminLogin from '@/components/admin/AdminLogin';
import { Family, Guest, FamilyFormData, GuestFormData, ModalType } from '@/components/admin/types';

// Hard-coded admin wagwoord - verander dit na iets veilig!
const ADMIN_PASSWORD = 'ThunderMerwe2026';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [families, setFamilies] = useState<Family[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'families' | 'guests'>('families');
  
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
    
    const { data: familiesData } = await supabase
      .from('families')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: guestsData } = await supabase
      .from('guests')
      .select('*')
      .order('name');

    if (familiesData) setFamilies(familiesData);
    if (guestsData) setGuests(guestsData);
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
    return <AdminLogin onLogin={handleLogin} />;
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
        {/* Header met logout knoppie */}
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
        />

        {activeTab === 'families' && (
          <FamilyList
            families={families}
            guests={guests}
            onEditFamily={openEditFamilyModal}
            onEditGuest={openEditGuestModal}
            onDeleteFamily={deleteFamily}
            onDeleteGuest={deleteGuest}
            onAddGuest={addGuest}
          />
        )}

        {activeTab === 'guests' && (
          <GuestList
            guests={guests}
            families={families}
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