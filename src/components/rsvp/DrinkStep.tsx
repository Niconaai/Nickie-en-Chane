// src/components/rsvp/DrinkStep.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RSVPSessionData } from '@/types/rsvp-session';
import { updateGuestDrinkPreferences, updateSessionStep } from '@/utils/rsvp-session';
import { getDrinkById, DRINK_CATEGORIES, searchDrinksInCategory } from '@/data/drink-options';

interface DrinkStepProps {
  session: RSVPSessionData;
  onSessionUpdate: (session: RSVPSessionData) => void;
  onBack: () => void;
  onCancelRSVP: () => void;
}

export default function DrinkStep({ session, onSessionUpdate, onBack, onCancelRSVP }: DrinkStepProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerms, setSearchTerms] = useState<{ [guestId: string]: string }>({});

  const attendingAdultGuests = session.guests.filter(guest => guest.is_attending && guest.is_adult);

  const handleSearchChange = (guestId: string, searchTerm: string) => {
    setSearchTerms(prevTerms => ({
      ...prevTerms,
      [guestId]: searchTerm,
    }));
  };

  const handleDrinkSelection = (guestId: string, drinkId: string) => {
    const guest = session.guests.find(g => g.id === guestId);
    if (!guest) return;

    let newPreferences: string[];

    if (guest.drinkPreferences.includes(drinkId)) {
      newPreferences = guest.drinkPreferences.filter(id => id !== drinkId);
    } else {
      if (guest.drinkPreferences.length >= 4) return; // Prevent adding more than 3
      newPreferences = [...guest.drinkPreferences, drinkId];
    }

    const updatedSession = updateGuestDrinkPreferences(session, guestId, newPreferences);
    onSessionUpdate(updatedSession);
  };

  const handleContinue = () => {
    const guestsWithoutCompletePreferences = attendingAdultGuests.filter(
      guest => guest.drinkPreferences.length < 4
    );

    if (guestsWithoutCompletePreferences.length > 0) {
      setMessage(`Kies asseblief 4 drank voorkeure vir: ${guestsWithoutCompletePreferences.map(g => g.name).join(', ')}`);
      return;
    }

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
            {/* ... (no changes to header or message blocks) ... */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#3d251e' }}>
                Drank Voorkeure
                </h2>
                <p style={{ color: '#8b6c5c' }}>
                Kies jou top 4 drank voorkeure (1ste, 2de, 3de, 4de keuse)
                </p>
                <p style={{ color: '#8b6c5c' }}>
                (hierdie keuses gaan ons help om beter voorbereid te wees)
                </p>
            </div>

            {message && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-red-600">
                {message}
                </div>
            )}
            
            <div className="space-y-8">
                {attendingAdultGuests.map((guest) => (
                    <div key={guest.id} className="bg-white rounded-lg border border-gray-200 p-6">
                        {/* ... (no changes to guest name, selected summary, or search input) ... */}
                        <h3 className="text-2xl font-medium mb-4" style={{ color: '#3d251e' }}>
                            {guest.name}
                        </h3>
                        
                        <div className="mb-4">
                            <p className="text-md mb-2" style={{ color: '#5c4033' }}>
                                Gekose voorkeure ({guest.drinkPreferences.length}/4):
                            </p>
                            <p className="text-md mb-2" style={{ color: '#5c4033' }}>
                                Om &apos;n keuse weg te vat druk op die gekose keuse &apos;n tweede keer, of druk op die kruisie:
                            </p>
                            <div className="flex flex-wrap gap-2">
                            {guest.drinkPreferences.map((drinkId, index) => {
                                const drink = getDrinkById(drinkId);
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

                        <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Soek vir 'n drankie..."
                            value={searchTerms[guest.id] || ''}
                            onChange={(e) => handleSearchChange(guest.id, e.target.value)}
                            className="w-full p-2 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-[#3d251e] focus:border-[#3d251e]"
                        />
                        </div>

                        <div className="space-y-6">
                            {DRINK_CATEGORIES.map((category) => {
                                const displayedDrinks = searchDrinksInCategory(searchTerms[guest.id] || '', category.id);
                                if (displayedDrinks.length === 0) {
                                    return null;
                                }

                                return (
                                <div key={category.id}>
                                    <h4 className="font-medium mb-3 text-lg" style={{ color: '#3d251e' }}>
                                    {category.name}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {displayedDrinks.map((drink) => (
                                        // --- MODIFICATION 2 ---
                                        // We'll change the button to be a flex container
                                        // to position the image and text nicely.
                                        <button
                                            key={drink.id}
                                            onClick={() => handleDrinkSelection(guest.id, drink.id)}
                                            disabled={guest.drinkPreferences.length >= 4 && !guest.drinkPreferences.includes(drink.id)}
                                            className={`rounded-lg border text-left transition-colors flex items-center p-2 space-x-3 ${
                                                guest.drinkPreferences.includes(drink.id)
                                                ? 'bg-green-50 border-green-300 text-green-800'
                                                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                                            } ${
                                                guest.drinkPreferences.length >= 4 && !guest.drinkPreferences.includes(drink.id)
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                            }`}
                                        >
                                            {/* --- MODIFICATION 3 --- */}
                                            {/* Render the image if the URL exists */}
                                            {drink.imageUrl && (
                                                <div className="flex-shrink-0 w-12 h-12 relative">
                                                    <Image
                                                        src={drink.imageUrl}
                                                        alt={drink.name}
                                                        layout="fill"
                                                        objectFit="contain"
                                                        className="rounded-md"
                                                    />
                                                </div>
                                            )}
                                            {/* Text container */}
                                            <div className="flex-grow">
                                                <div className="font-medium text-sm leading-tight">{drink.name}</div>
                                            </div>
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
            
            {/* ... (no changes to navigation buttons) ... */}
            <div className="mt-8 flex justify-between items-center">
                <button
                onClick={onBack}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                Terug
                </button>
                <div className="flex space-x-4">
                <button
                    onClick={onCancelRSVP}
                    className="px-4 py-3 text-red-600 hover:text-red-800 underline"
                >
                    Kanselleer RSVP
                </button>
                <button
                    onClick={handleContinue}
                    className="px-8 py-3 rounded-lg font-medium text-white text-lg"
                    style={{ backgroundColor: '#3d251e' }}
                >
                    Volgende
                </button>
                </div>
            </div>
        </div>
    );
}