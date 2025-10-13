'use client';

import { useState } from 'react';
import { Family, Guest, Payment } from './types';
import AddGuestModal from './AddGuestModal';
import { getDrinkById } from '@/data/drink-options';

interface FamilyListProps {
  families: Family[];
  guests: Guest[];
  payments: Payment[];
  onEditFamily: (family: Family) => void;
  onEditGuest: (guest: Guest) => void;
  onDeleteFamily: (id: string) => void;
  onDeleteGuest: (id: string) => void;
  onAddGuest: (familyId: string, name: string, isAdult: boolean) => void;
  onCreatePayment: (familyId: string) => void;
  onUpdatePayment: (paymentId: string, updates: Partial<Payment>) => void;
  onSendInvite: (familyId: string) => void;
  sendingInviteId: string | null;
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
  onUpdatePayment,
  onSendInvite,
  sendingInviteId,
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

  const getFamilyPayment = (familyId: string) => {
    return payments.find(p => p.family_id === familyId);
  };

  const handleCreatePayment = (familyId: string) => {
    onCreatePayment(familyId);
  };

  const handleMarkAsPaid = (payment: Payment) => {
    const paidAmount = prompt('Hoeveelheid betaal (in Rand):', (payment.amount / 100).toString());
    const paidBy = prompt('Naam van persoon wat betaal het:');

    if (!paidAmount || !paidBy) return;

    onUpdatePayment(payment.id, {
      payment_status: 'paid',
      paid_amount: Math.round(parseFloat(paidAmount) * 100),
      paid_by: paidBy,
      paid_at: new Date().toISOString(),
    });
  };

  const handleChangePaymentMethod = (payment: Payment) => {
    const newMethod = payment.payment_method === 'yoco' ? 'eft' : 'yoco';
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
            const familyGuests = guests.filter((g) => g.family_id === family.id);

            return (
              <div key={family.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{family.family_name}</h3>
                      {family.invite_sent && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Invite Sent
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          family.rsvp_status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : family.rsvp_status === 'submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : family.rsvp_status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
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
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              payment.payment_status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : payment.payment_status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {payment.payment_status === 'paid'
                              ? 'Betaal'
                              : payment.payment_status === 'failed'
                              ? 'Misluk'
                              : 'Hangend'}
                          </span>
                          <span className="text-sm text-gray-700">
                            {payment.payment_method === 'yoco' ? 'Kaart Betaling' : 'EFT'}
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
                                Verander na {payment.payment_method === 'yoco' ? 'EFT' : 'Kaart'}
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
                            disabled={family.total_adults === 0}
                            className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            title={
                              family.total_adults === 0
                                ? 'Geen volwassene gaste - geen deposito nodig'
                                : 'Skep betaling'
                            }
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
                      <div className="space-y-3">
                        {familyGuests.map((guest) => (
                          <div key={guest.id} className="bg-gray-50 border border-gray-200 rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {guest.name} {guest.is_adult ? '(V)' : '(K)'}
                                </span>
                                <span
                                  className={`px-1 py-0.5 rounded text-xs ${
                                    guest.is_attending
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {guest.is_attending ? 'Bywonend' : 'Nie Bywonend'}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => onEditGuest(guest)}
                                  className="text-blue-600 hover:text-blue-800 text-xs"
                                  title="Wysig Gas"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => onDeleteGuest(guest.id)}
                                  className="text-red-600 hover:text-red-800 text-xs"
                                  title="Skrap Gas"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>

                            {guest.is_attending && guest.song_request && (
                              <div className="text-xs mb-1">
                                <span className="font-medium text-gray-700">Liedjie: </span>
                                <span className="text-gray-600">{guest.song_request}</span>
                              </div>
                            )}

                            {guest.is_attending &&
                              guest.drink_preferences &&
                              guest.drink_preferences.length > 0 && (
                                <div className="text-xs mb-1">
                                  <span className="font-medium text-gray-700">Drank: </span>
                                  <span className="text-gray-600">
                                    {guest.drink_preferences
                                      .map((drinkId) => getDrinkById(drinkId)?.name)
                                      .filter(Boolean)
                                      .join(', ')}
                                  </span>
                                </div>
                              )}

                            {guest.is_attending && guest.extra_notes && (
                              <div className="text-xs">
                                <span className="font-medium text-gray-700">Notas: </span>
                                <span className="text-gray-600">{guest.extra_notes}</span>
                              </div>
                            )}
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

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const message = `Hallo ${family.family_name}!\n\nOns bring goeie nuus! \n\n'n Epos met julle amptelike uitnodiging en RSVP besonderhede was gestuur na: ${family.email}. \nJulle unieke uitnodigings kode is ${family.invite_code}. \n\nBesoek ook solank ons trou-webtuiste: https://www.thundermerwefees.co.za/\nGaan loer asseblief in jou inbox (of miskien Gemorspos).\n\nOns sien uit om die #thunderMerweFees met julle te deel. \n\nGroete,\nChané en Nickie`;
                          navigator.clipboard.writeText(message);
                          //alert('WhatsApp message copied to clipboard!');
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors text-sm"
                      >
                        Copy WhatsApp Text
                      </button>
                      <button
                        onClick={() => onSendInvite(family.id)}
                        disabled={sendingInviteId === family.id || !!family.invite_sent}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed w-28 text-center"
                      >
                        {sendingInviteId === family.id
                          ? 'Sending...'
                          : family.invite_sent
                          ? 'Sent ✔️'
                          : 'Send Invite'}
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditFamily(family)}
                        className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900 transition-colors text-sm"
                      >
                        Wysig
                      </button>
                      <button
                        onClick={() => onDeleteFamily(family.id)}
                        className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 transition-colors text-sm"
                      >
                        Skrap
                      </button>
                    </div>
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