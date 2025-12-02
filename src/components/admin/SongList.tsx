/* eslint-disable @next/next/no-img-element */
'use client';

import { Guest, Family } from './types';

interface SongListProps {
  guests: Guest[];
  families: Family[];
}

interface SongGroup {
  name: string;
  albumArt: string | null;
  count: number;
  requestedBy: string[];
}

export default function SongList({ guests }: SongListProps) {
  // 1. Groepeer liedjies
  const songMap = new Map<string, SongGroup>();

  guests.forEach((guest) => {
    // Slaan oor as gas nie kom nie of geen liedjie het nie
    if (!guest.is_attending || !guest.song_request || guest.song_request.trim() === '') {
      return;
    }

    const songName = guest.song_request;
    
    // Kry bestaande groep of skep nuwe een
    const existing = songMap.get(songName) || {
      name: songName,
      albumArt: null,
      count: 0,
      requestedBy: []
    };

    // Dateer inligting op
    existing.count += 1;
    existing.requestedBy.push(guest.name);
    
    // As ons nog nie album art het nie, maar hierdie gas het dit wel in die DB, stoor dit.
    // Ons gebruik 'album_art_url' soos jy gespesifiseer het.
    if (!existing.albumArt && guest.album_art_url) {
      existing.albumArt = guest.album_art_url;
    }

    songMap.set(songName, existing);
  });

  // 2. Skakel om na array en sorteer (Gewildste bo)
  const sortedSongs = Array.from(songMap.values()).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 uppercase">Totale Liedjies Aangevra</h3>
        <p className="mt-2 text-3xl font-bold text-[#3d251e]">{sortedSongs.length}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Top Treffers ({sortedSongs.length})</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sortedSongs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Geen liedjies is nog aangevra nie.</div>
          ) : (
            sortedSongs.map((song, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                
                {/* Album Art */}
                <div className="flex-shrink-0">
                  {song.albumArt ? (
                    <img 
                      src={song.albumArt} 
                      alt="Album Art" 
                      className="w-16 h-16 rounded-md object-cover shadow-sm border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-2xl border border-gray-200 text-gray-400">
                      🎵
                    </div>
                  )}
                </div>

                {/* Song Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 truncate pr-4">
                      {index + 1}. {song.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {song.count} {song.count === 1 ? 'stem' : 'stemme'}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Aangevra deur:</p>
                    <div className="flex flex-wrap gap-1">
                      {song.requestedBy.map((name, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}