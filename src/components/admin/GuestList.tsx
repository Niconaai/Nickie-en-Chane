'use client';

import { Guest, Family } from './types';

interface GuestListProps {
  guests: Guest[];
  families: Family[];
}

export default function GuestList({ guests, families }: GuestListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">All Guests</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {guests.map((guest) => {
          const family = families.find(f => f.id === guest.family_id);
          return (
            <div key={guest.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900">{guest.name}</span>
                  <span className={`ml-2 text-sm ${
                    guest.is_adult ? 'text-gray-700' : 'text-gray-600'
                  }`}>
                    {guest.is_adult ? '(Adult)' : '(Child)'}
                  </span>
                  <div className="text-sm text-gray-700">
                    Family: {family?.family_name} • {family?.email}
                  </div>
                  {guest.dietary_requirements && (
                    <div className="text-sm text-gray-600">
                      Dietary: {guest.dietary_requirements}
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  guest.is_attending 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {guest.is_attending ? 'Attending' : 'Not Attending'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}