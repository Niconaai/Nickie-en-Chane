'use client';

import { useState } from 'react';
import { Family, Guest, GuestFormData } from './types';
import AddGuestModal from './AddGuestModal';

interface FamilyListProps {
  families: Family[];
  guests: Guest[];
  onEditFamily: (family: Family) => void;
  onEditGuest: (guest: Guest) => void;
  onDeleteFamily: (id: string) => void;
  onDeleteGuest: (id: string) => void;
  onAddGuest: (familyId: string, name: string, isAdult: boolean) => void;
}

export default function FamilyList({
  families,
  guests,
  onEditFamily,
  onEditGuest,
  onDeleteFamily,
  onDeleteGuest,
  onAddGuest
}: FamilyListProps) {
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);

  const handleAddGuestClick = (familyId: string) => {
    setSelectedFamilyId(familyId);
    setShowGuestModal(true);
  };

  const handleGuestSubmit = (name: string, isAdult: boolean) => {
    if (selectedFamilyId) {
      onAddGuest(selectedFamilyId, name, isAdult);
    }
  };

  const handleGuestModalClose = () => {
    setShowGuestModal(false);
    setSelectedFamilyId(null);
  };

  const handleEditGuest = (guest: Guest) => {
    onEditGuest(guest);
  };

  const handleDeleteGuest = (guestId: string) => {
    if (confirm('Is jy seker jy wil hierdie gas skrap?')) {
      onDeleteGuest(guestId);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Gesins Bestuur</h2>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {families.map((family) => (
            <div key={family.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{family.family_name}</h3>
                  <p className="text-gray-700">{family.email}</p>
                  <div className="flex space-x-4 mt-2 text-sm text-gray-700">
                    <span>Kode: {family.invite_code}</span>
                    <span>Volwassenes: {family.total_adults}</span>
                    <span>Kinders: {family.total_children}</span>
                    <span className={`px-2 py-1 rounded ${
                      family.rsvp_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      family.rsvp_status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      family.rsvp_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {family.rsvp_status === 'pending' && 'Hangend'}
                      {family.rsvp_status === 'submitted' && 'Ingedien'}
                      {family.rsvp_status === 'confirmed' && 'Bevestig'}
                      {family.rsvp_status === 'cancelled' && 'Gekanselleer'}
                    </span>
                  </div>
                  
                  {/* Family Guests */}
                  <div className="mt-3">
                    <h4 className="font-medium mb-2 text-gray-900">Gaste:</h4>
                    <div className="flex flex-wrap gap-2">
                      {guests
                        .filter(guest => guest.family_id === family.id)
                        .map(guest => (
                          <div key={guest.id} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm text-gray-800 border border-gray-300">
                            <span>
                              {guest.name} {guest.is_adult ? '(V)' : '(K)'}
                            </span>
                            <button
                              onClick={() => handleEditGuest(guest)}
                              className="text-blue-600 hover:text-blue-800 text-xs ml-1"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteGuest(guest.id)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      <button
                        onClick={() => handleAddGuestClick(family.id)}
                        className="bg-gray-800 text-white px-2 py-1 rounded text-sm hover:bg-gray-900 transition-colors"
                      >
                        + Voeg Gas By
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditFamily(family)}
                    className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900 transition-colors"
                  >
                    Wysig
                  </button>
                  <button
                    onClick={() => onDeleteFamily(family.id)}
                    className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 transition-colors"
                  >
                    Skrap
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddGuestModal
        isOpen={showGuestModal}
        onClose={handleGuestModalClose}
        onAddGuest={handleGuestSubmit}
      />
    </>
  );
}