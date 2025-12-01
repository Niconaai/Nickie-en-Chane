'use client';

import { Guest, Family } from './types';

interface SongListProps {
  guests: Guest[];
  families: Family[];
}

export default function SongList({ guests, families }: SongListProps) {
  // Filter gaste wat liedjies het EN wat bywoon
  const guestsWithSongs = guests.filter(
    g => g.song_request && g.song_request.trim() !== '' && g.is_attending
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Liedjie Versoeke</h2>
        <span className="text-sm text-gray-500">Totaal: {guestsWithSongs.length}</span>
      </div>
      
      <div className="divide-y divide-gray-200">
        {guestsWithSongs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Geen liedjies is nog aangevra nie.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liedjie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aangevra Deur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Familie</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guestsWithSongs.map((guest) => {
                const family = families.find(f => f.id === guest.family_id);
                return (
                  <tr key={guest.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-700">
                      🎵 {guest.song_request}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {guest.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {family?.family_name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}