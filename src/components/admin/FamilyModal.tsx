'use client';

import { Family, Guest, FamilyFormData, GuestFormData, ModalType } from './types';

interface FamilyModalProps {
  isOpen: boolean;
  modalType: ModalType;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  family: Family | null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  guest: Guest | null;
  familyForm: FamilyFormData;
  guestForm: GuestFormData;
  onFamilyFormChange: (field: keyof FamilyFormData, value: string | number) => void;
  onGuestFormChange: (field: keyof GuestFormData, value: string | boolean) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
  onDeleteGuest?: () => void;
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
                    type="text"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volwassenes
                    </label>
                    <input
                      type="number"
                      value={familyForm.total_adults}
                      onChange={(e) => onFamilyFormChange('total_adults', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kinders
                    </label>
                    <input
                      type="number"
                      value={familyForm.total_children}
                      onChange={(e) => onFamilyFormChange('total_children', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      min="0"
                      required
                    />
                  </div>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dieet Vereistes
                  </label>
                  <textarea
                    value={guestForm.dietary_requirements || ''}
                    onChange={(e) => onGuestFormChange('dietary_requirements', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    rows={3}
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