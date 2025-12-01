'use client';

import { Guest, Family } from './types';
import { getDrinkById } from '@/data/drink-options';

interface GuestListProps {
  guests: Guest[];
  families: Family[];
}

export default function GuestList({ guests, families }: GuestListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Alle Gaste ({guests.length})</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {guests.map((guest) => {
          const family = families.find(f => f.id === guest.family_id);
          
          // Kry drank name
          const drinkNames = guest.drink_preferences && guest.drink_preferences.length > 0
            ? guest.drink_preferences
                .map(id => getDrinkById(id)?.name)
                .filter(Boolean)
                .join(', ')
            : null;

          return (
            <div key={guest.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-lg">{guest.name}</span>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      guest.is_adult ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                    }`}>
                      {guest.is_adult ? 'Volwassene' : 'Kind'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Gesin:</span> {family?.family_name} ({family?.email})
                  </div>

                  {/* Dieet Vereistes */}
                  {guest.dietary_requirements && (
                    <div className="text-sm text-red-600 font-medium bg-red-50 p-1 rounded inline-block">
                      ⚠️ Dieet: {guest.dietary_requirements}
                    </div>
                  )}

                  {/* Liedjie Versoek */}
                  {guest.song_request && (
                    <div className="text-sm text-purple-700 mt-1">
                      🎵 <span className="font-medium">Liedjie:</span> {guest.song_request}
                    </div>
                  )}

                  {/* Drank Voorkeure */}
                  {drinkNames && (
                    <div className="text-sm text-amber-700 mt-1">
                      🥂 <span className="font-medium">Drankies:</span> {drinkNames}
                    </div>
                  )}

                  {/* Extra Notas */}
                  {guest.extra_notes && (
                    <div className="text-sm text-gray-500 italic mt-1">
                      📝 Nota: {guest.extra_notes}
                    </div>
                  )}
                </div>

                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  guest.is_attending 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {guest.is_attending ? 'Bywonend' : 'Nie Bywonend'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}