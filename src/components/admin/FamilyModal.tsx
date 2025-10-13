'use client';

import { Family, Guest, FamilyFormData, GuestFormData, ModalType } from './types';
import { DRINK_OPTIONS } from '@/data/drink-options';

interface FamilyModalProps {
  isOpen: boolean;
  modalType: ModalType;
  family: Family | null;
  guest: Guest | null;
  familyForm: FamilyFormData;
  guestForm: GuestFormData;
  onFamilyFormChange: (field: keyof FamilyFormData, value: string | number) => void;
  onGuestFormChange: (field: keyof GuestFormData, value: string | boolean | string[]) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
  onDeleteGuest?: () => void;
}

export function generateAlphanumericCode(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export default function FamilyModal({
  isOpen,
  modalType,
  family,
  guest,
  familyForm,
  guestForm,
  onFamilyFormChange,
  onGuestFormChange,
  onSave,
  onClose,
  onDeleteGuest
}: FamilyModalProps) {
  if (!isOpen) return null;

  //const invite = generateAlphanumericCode(5);

  const isFamilyModal = modalType.includes('family');
  const isEdit = modalType.includes('edit');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {modalType === 'add-family' && 'Voeg Nuwe Gesin By'}
            {modalType === 'edit-family' && 'Wysig Gesin'}
            {modalType === 'edit-guest' && 'Wysig Gas'}
          </h2>

          <form onSubmit={onSave} className="space-y-4">
            {/* Family Form Fields */}
            {isFamilyModal && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-pos
                  </label>
                  <input
                    type="email"
                    value={familyForm.email}
                    onChange={(e) => onFamilyFormChange('email', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uitnodigingskode
                  </label>
                  <input
                    type="text disabled"
                    value={familyForm.invite_code}
                    onChange={(e) => onFamilyFormChange('invite_code', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gesinsnaam
                  </label>
                  <input
                    type="text"
                    value={familyForm.family_name}
                    onChange={(e) => onFamilyFormChange('family_name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    required
                  />
                </div>



                {isEdit && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RSVP Status
                    </label>
                    <select
                      value={familyForm.rsvp_status}
                      onChange={(e) => onFamilyFormChange('rsvp_status', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    >
                      <option value="pending">Hangend</option>
                      <option value="submitted">Ingedien</option>
                      <option value="confirmed">Bevestig</option>
                      <option value="cancelled">Gekanselleer</option>
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Guest Form Fields */}
            {modalType === 'edit-guest' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Naam
                  </label>
                  <input
                    type="text"
                    value={guestForm.name}
                    onChange={(e) => onGuestFormChange('name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={guestForm.is_adult}
                      onChange={(e) => onGuestFormChange('is_adult', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Volwassene</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={guestForm.is_attending}
                      onChange={(e) => onGuestFormChange('is_attending', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Woon by</span>
                  </label>
                </div>

                {/* Song Request */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Liedjie Versoek
                  </label>
                  <input
                    type="text"
                    value={guestForm.song_request || ''}
                    onChange={(e) => onGuestFormChange('song_request', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    placeholder="Bv. Sweet Caroline - Neil Diamond"
                  />
                </div>

                {/* Drink Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Drank Voorkeure (Kies tot 3)
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
                    {DRINK_OPTIONS.map((drink) => (
                      <label key={drink.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={guestForm.drink_preferences?.includes(drink.id) || false}
                          onChange={(e) => {
                            const currentPreferences = guestForm.drink_preferences || [];
                            let newPreferences: string[];

                            if (e.target.checked) {
                              // Add drink (max 3)
                              newPreferences = [...currentPreferences, drink.id].slice(0, 3);
                            } else {
                              // Remove drink
                              newPreferences = currentPreferences.filter(id => id !== drink.id);
                            }

                            onGuestFormChange('drink_preferences', newPreferences);
                          }}
                          disabled={!guestForm.is_attending}
                          className="mr-2"
                        />
                        <span className={`text-sm ${!guestForm.is_attending ? 'text-gray-400' : 'text-gray-700'}`}>
                          {drink.name} {drink.description && `- ${drink.description}`}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Gekose: {guestForm.drink_preferences?.length || 0}/4
                    {!guestForm.is_attending && ' (Slegs beskikbaar vir bywonende gaste)'}
                  </p>
                </div>

                {/* Extra Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extra Notas
                  </label>
                  <textarea
                    value={guestForm.extra_notes || ''}
                    onChange={(e) => onGuestFormChange('extra_notes', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    rows={3}
                    placeholder="Bv. Naam verkeerd gespel, allergies, spesiale versoeke, ens."
                  />
                </div>

                {/* Oorspronklike velde (dietary requirements en meal preference) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dieet Vereistes
                  </label>
                  <textarea
                    value={guestForm.dietary_requirements || ''}
                    onChange={(e) => onGuestFormChange('dietary_requirements', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    rows={2}
                    placeholder="Bv. Vegetaries, allergies, ens."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eetlus Voorkeur
                  </label>
                  <select
                    value={guestForm.meal_preference}
                    onChange={(e) => onGuestFormChange('meal_preference', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  >
                    <option value="standard">Standaard</option>
                    <option value="vegetarian">Vegetaries</option>
                    <option value="vegan">Veganisties</option>
                    <option value="other">Ander</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex space-x-3 pt-4">
              {modalType === 'edit-guest' && onDeleteGuest && (
                <button
                  type="button"
                  onClick={onDeleteGuest}
                  className="flex-1 bg-red-700 text-white py-2 rounded-lg hover:bg-red-800 transition-colors"
                >
                  Skrap Gas
                </button>
              )}
              <button
                type="submit"
                className={`${modalType === 'edit-guest' && onDeleteGuest ? 'flex-1' : 'flex-1'} bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors`}
              >
                {modalType === 'add-family' && 'Voeg Gesin By'}
                {modalType === 'edit-family' && 'Stoor Veranderinge'}
                {modalType === 'edit-guest' && 'Stoor Veranderinge'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Kanselleer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}