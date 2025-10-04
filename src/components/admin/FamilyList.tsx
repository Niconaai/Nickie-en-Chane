'use client';

import { useState } from 'react';
import { Family, Guest, Payment } from './types';
import AddGuestModal from './AddGuestModal';

interface FamilyListProps {
  families: Family[];
  guests: Guest[];
  payments: Payment[]; // ✅ Nuwe prop
  onEditFamily: (family: Family) => void;
  onEditGuest: (guest: Guest) => void;
  onDeleteFamily: (id: string) => void;
  onDeleteGuest: (id: string) => void;
  onAddGuest: (familyId: string, name: string, isAdult: boolean) => void;
  onCreatePayment: (familyId: string) => void; // ✅ Nuwe prop
  onUpdatePayment: (paymentId: string, updates: Partial<Payment>) => void; // ✅ Nuwe prop
}

export default function FamilyList({
  families,
  guests,
  payments,
  onEditFamily,
  onEditGuest,
  onDeleteFamily,
  onDeleteGuest,
  onAddGuest,
  onCreatePayment,
  onUpdatePayment
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

  // Kry payment status vir 'n gesin
  const getFamilyPayment = (familyId: string) => {
    return payments.find(p => p.family_id === familyId);
  };

  // Bereken deposito bedrag vir 'n gesin
  const calculateDeposit = (familyId: string) => {
    const familyGuests = guests.filter(g => g.family_id === familyId);
    const attendingAdults = familyGuests.filter(g => g.is_attending && g.is_adult).length;
    return attendingAdults * 30000; // R300 per volwassene in sent
  };

  // Handle skep betaling
  const handleCreatePayment = (familyId: string) => {
    onCreatePayment(familyId);
  };

  // Handle merk as betaal
  const handleMarkAsPaid = (payment: Payment) => {
    const paidAmount = prompt('Hoeveelheid betaal (in Rand):', (payment.amount / 100).toString());
    const paidBy = prompt('Naam van persoon wat betaal het:');

    if (!paidAmount || !paidBy) return;

    onUpdatePayment(payment.id, {
      payment_status: 'paid',
      paid_amount: Math.round(parseFloat(paidAmount) * 100),
      paid_by: paidBy,
      paid_at: new Date().toISOString()
    });
  };

  // Handle verander betaal metode
  const handleChangePaymentMethod = (payment: Payment) => {
    const newMethod = payment.payment_method === 'ikhoka' ? 'eft' : 'ikhoka';
    onUpdatePayment(payment.id, { payment_method: newMethod });
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
          {families.map((family) => {
            const payment = getFamilyPayment(family.id);
            const depositAmount = calculateDeposit(family.id);
            const familyGuests = guests.filter(g => g.family_id === family.id);
            const attendingAdults = familyGuests.filter(g => g.is_attending && g.is_adult).length;

            return (
              <div key={family.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{family.family_name}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${family.rsvp_status === 'confirmed' ? 'bg-green-100 text-green-800' :
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

                    <p className="text-gray-700">{family.email}</p>
                    <div className="flex space-x-4 mt-2 text-sm text-gray-700">
                      <span>Kode: {family.invite_code}</span>
                      <span>Volwassenes: {family.total_adults}</span>
                      <span>Kinders: {family.total_children}</span>
                    </div>

                    {/* Payment Status */}
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-900 mb-2">Betaling Status:</h4>
                      {payment ? (
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded text-sm ${payment.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                              payment.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {payment.payment_status === 'paid' ? 'Betaal' :
                              payment.payment_status === 'failed' ? 'Misluk' : 'Hangend'}
                          </span>
                          <span className="text-sm text-gray-700">
                            {payment.payment_method === 'ikhoka' ? 'Kaart Betaling' : 'EFT'}
                          </span>
                          <span className="text-sm text-gray-700">
                            R{(payment.amount / 100).toFixed(2)}
                          </span>

                          {payment.payment_status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleMarkAsPaid(payment)}
                                className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                Merk as Betaal
                              </button>
                              <button
                                onClick={() => handleChangePaymentMethod(payment)}
                                className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                Verander na {payment.payment_method === 'ikhoka' ? 'EFT' : 'Kaart'}
                              </button>
                            </div>
                          )}

                          {payment.payment_status === 'paid' && (
                            <div className="text-sm text-gray-600">
                              Betaal op: {new Date(payment.paid_at!).toLocaleDateString('af-ZA')}
                              {payment.paid_by && ` • deur ${payment.paid_by}`}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">Geen betaling</span>
                          <button
                            onClick={() => handleCreatePayment(family.id)}
                            disabled={family.total_adults === 0} // ✅ Disable as geen volwassenes
                            className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            title={family.total_adults === 0 ? 'Geen volwassene gaste - geen deposito nodig' : 'Skep betaling'}
                          >
                            Skep Betaling
                          </button>
                          {family.total_adults === 0 && (
                            <span className="text-xs text-gray-500">(Geen volwassenes)</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Family Guests */}
                    <div className="mt-3">
                      <h4 className="font-medium mb-2 text-gray-900">Gaste:</h4>
                      <div className="flex flex-wrap gap-2">
                        {familyGuests.map((guest) => (
                          <div key={guest.id} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm text-gray-800 border border-gray-300">
                            <span>
                              {guest.name} {guest.is_adult ? '(V)' : '(K)'}
                            </span>
                            <button
                              onClick={() => onEditGuest(guest)}
                              className="text-blue-600 hover:text-blue-800 text-xs ml-1"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => onDeleteGuest(guest.id)}
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
            );
          })}
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