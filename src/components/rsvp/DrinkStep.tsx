'use client';

import { useState } from 'react';
import { RSVPSessionData } from '@/types/rsvp-session';
import { updateGuestDrinkPreferences, updateSessionStep } from '@/utils/rsvp-session';
import { DRINK_OPTIONS, DRINK_CATEGORIES, getDrinkOptionsByCategory } from '@/data/drink-options';

interface DrinkStepProps {
  session: RSVPSessionData;
  onSessionUpdate: (session: RSVPSessionData) => void;
  onBack: () => void;
}

export default function DrinkStep({ session, onSessionUpdate, onBack }: DrinkStepProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Slegs volwasse gaste wat bywoon
  const attendingAdultGuests = session.guests.filter(guest => guest.is_attending && guest.is_adult);

  const handleDrinkSelection = (guestId: string, drinkId: string) => {
    const guest = session.guests.find(g => g.id === guestId);
    if (!guest) return;

    let newPreferences: string[];
    
    if (guest.drinkPreferences.includes(drinkId)) {
      // Remove drink if already selected
      newPreferences = guest.drinkPreferences.filter(id => id !== drinkId);
    } else {
      // Add drink (max 3)
      newPreferences = [...guest.drinkPreferences, drinkId].slice(0, 3);
    }

    const updatedSession = updateGuestDrinkPreferences(session, guestId, newPreferences);
    onSessionUpdate(updatedSession);
  };

  const handleContinue = () => {
    // Check of elke volwassene guest 3 drank keuses het
    const guestsWithoutCompletePreferences = attendingAdultGuests.filter(
      guest => guest.drinkPreferences.length < 3
    );
    
    if (guestsWithoutCompletePreferences.length > 0) {
      setMessage(`Kies asseblief 3 drank voorkeure vir: ${guestsWithoutCompletePreferences.map(g => g.name).join(', ')}`);
      return;
    }

    // Gaan na volgende stap
    const updatedSession = updateSessionStep(session, 'notes');
    onSessionUpdate(updatedSession);
  };

  if (attendingAdultGuests.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#3d251e' }}>
          Drank Voorkeure
        </h2>
        <p style={{ color: '#8b6c5c' }} className="mb-6">
          Geen volwassene gaste gaan bywoon nie - gaan voort na volgende stap.
        </p>
        <button
          onClick={() => {
            const updatedSession = updateSessionStep(session, 'notes');
            onSessionUpdate(updatedSession);
          }}
          className="px-6 py-2 rounded-lg text-white"
          style={{ backgroundColor: '#3d251e' }}
        >
          Volgende
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#3d251e' }}>
          Drank Voorkeure
        </h2>
        <p style={{ color: '#8b6c5c' }}>
          Kies jou top 3 drank voorkeure (1ste, 2de, 3de keuse)
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-red-600">
          {message}
        </div>
      )}

      {/* Guests List */}
      <div className="space-y-8">
        {attendingAdultGuests.map((guest) => (
          <div key={guest.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium mb-4" style={{ color: '#3d251e' }}>
              {guest.name}
            </h3>
            
            {/* Selected Drinks Summary */}
            <div className="mb-6">
              <p className="text-sm mb-2" style={{ color: '#5c4033' }}>
                Gekose voorkeure ({guest.drinkPreferences.length}/3):
              </p>
              <div className="flex flex-wrap gap-2">
                {guest.drinkPreferences.map((drinkId, index) => {
                  const drink = DRINK_OPTIONS.find(d => d.id === drinkId);
                  return drink ? (
                    <div 
                      key={drinkId}
                      className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      <span className="mr-2 font-medium">{index + 1}.</span>
                      {drink.name}
                      <button
                        onClick={() => handleDrinkSelection(guest.id, drinkId)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Drink Options by Category */}
            <div className="space-y-6">
              {DRINK_CATEGORIES.map((category) => {
                const categoryDrinks = getDrinkOptionsByCategory(category.id);
                
                return (
                  <div key={category.id}>
                    <h4 className="font-medium mb-3 text-lg" style={{ color: '#3d251e' }}>
                      {category.name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryDrinks.map((drink) => (
                        <button
                          key={drink.id}
                          onClick={() => handleDrinkSelection(guest.id, drink.id)}
                          disabled={guest.drinkPreferences.length >= 3 && !guest.drinkPreferences.includes(drink.id)}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            guest.drinkPreferences.includes(drink.id)
                              ? 'bg-green-50 border-green-300 text-green-800'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                          } ${guest.drinkPreferences.length >= 3 && !guest.drinkPreferences.includes(drink.id) 
                              ? 'opacity-50 cursor-not-allowed' 
                              : ''}`}
                        >
                          <div className="font-medium">{drink.name}</div>
                          {drink.description && (
                            <div className="text-xs mt-1" style={{ color: '#8b6c5c' }}>
                              {drink.description}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Terug
        </button>
        
        <button
          onClick={handleContinue}
          disabled={saving}
          className="px-8 py-3 rounded-lg font-medium text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ backgroundColor: '#3d251e' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5c4033'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3d251e'}
        >
          {saving ? 'Stoor...' : 'Volgende'}
        </button>
      </div>
    </div>
  );
}