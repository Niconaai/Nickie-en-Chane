'use client';

import { useState, useEffect } from 'react';
import { RSVPSessionData } from '@/types/rsvp-session';
import { updateGuestSongRequest, updateSessionStep } from '@/utils/rsvp-session';

interface SongStepProps {
  session: RSVPSessionData;
  onSessionUpdate: (session: RSVPSessionData) => void;
  onBack: () => void;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
  external_urls: { spotify: string };
}

export default function SongStep({ session, onSessionUpdate, onBack }: SongStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Slegs gaste wat bywoon
  const attendingGuests = session.guests.filter(guest => guest.is_attending);

  // Spotify search funksie
  const searchSpotify = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // Eerstens, kry access token
      const tokenResponse = await fetch('/api/spotify/token');
      const { access_token } = await tokenResponse.json();

      // Soek liedjies
      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        }
      );

      const data = await searchResponse.json();
      setSearchResults(data.tracks?.items || []);
    } catch (error) {
      console.error('Spotify search error:', error);
      setMessage('Fout met soek liedjies. Probeer weer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSongSelect = (guestId: string, track: SpotifyTrack) => {
    const songString = `${track.name} - ${track.artists.map(artist => artist.name).join(', ')}`;
    const updatedSession = updateGuestSongRequest(session, guestId, songString);
    onSessionUpdate(updatedSession);
    setSearchTerm('');
    setSearchResults([]);
    setSelectedGuest(null);
  };

  const handleContinue = () => {
    // Check of elke guest wat bywoon 'n liedjie het
    const guestsWithoutSongs = attendingGuests.filter(guest => !guest.songRequest.trim());
    
    if (guestsWithoutSongs.length > 0) {
      setMessage(`Verskaf asseblief 'n liedjie vir: ${guestsWithoutSongs.map(g => g.name).join(', ')}`);
      return;
    }

    // Gaan na volgende stap
    const updatedSession = updateSessionStep(session, 'drinks');
    onSessionUpdate(updatedSession);
  };

  if (attendingGuests.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#3d251e' }}>
          Liedjie Versoeke
        </h2>
        <p style={{ color: '#8b6c5c' }} className="mb-6">
          Geen gaste gaan bywoon nie - gaan voort na volgende stap.
        </p>
        <button
          onClick={() => {
            const updatedSession = updateSessionStep(session, 'drinks');
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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#3d251e' }}>
          Liedjie Versoeke
        </h2>
        <p style={{ color: '#8b6c5c' }}>
          Soek en kies &apos;n liedjie wat jy graag op die dansvloer wil hoor
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-red-600">
          {message}
        </div>
      )}

      {/* Guests List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200 mb-8">
        {attendingGuests.map((guest) => (
          <div key={guest.id} className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-4" style={{ color: '#3d251e' }}>
                {guest.name}
              </h3>
              
              {/* Gekose liedjie */}
              {guest.songRequest && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Gekose liedjie:</p>
                  <p className="text-green-700">{guest.songRequest}</p>
                  <button
                    onClick={() => {
                      const updatedSession = updateGuestSongRequest(session, guest.id, '');
                      onSessionUpdate(updatedSession);
                    }}
                    className="text-sm text-green-600 hover:text-green-800 mt-1"
                  >
                    Verander liedjie
                  </button>
                </div>
              )}

              {/* Soek veld */}
              {(!guest.songRequest || selectedGuest === guest.id) && (
                <div>
                  <input
                    type="text"
                    value={selectedGuest === guest.id ? searchTerm : ''}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedGuest(guest.id);
                      // Debounced search
                      setTimeout(() => searchSpotify(e.target.value), 300);
                    }}
                    placeholder="Tik om liedjies te soek..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    style={{ color: '#3d251e' }}
                  />
                  
                  {/* Search Results */}
                  {selectedGuest === guest.id && searchResults.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                      {searchResults.map((track) => (
                        <button
                          key={track.id}
                          onClick={() => handleSongSelect(guest.id, track)}
                          className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                        >
                          {track.album.images[0] && (
                            <img 
                              src={track.album.images[0].url} 
                              alt={track.album.name}
                              className="w-10 h-10 rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{track.name}</p>
                            <p className="text-gray-600 text-xs">
                              {track.artists.map(artist => artist.name).join(', ')}
                            </p>
                            <p className="text-gray-500 text-xs">{track.album.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedGuest === guest.id && loading && (
                    <div className="mt-2 text-center py-4">
                      <p className="text-gray-500">Soek liedjies...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Begin soek knoppie */}
              {!guest.songRequest && !selectedGuest && (
                <button
                  onClick={() => setSelectedGuest(guest.id)}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                >
                  Klik om &apos;n liedjie te soek
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Terug
        </button>
        
        <button
          onClick={handleContinue}
          className="px-8 py-3 rounded-lg font-medium text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ backgroundColor: '#3d251e' }}
        >
          Volgende
        </button>
      </div>
    </div>
  );
}