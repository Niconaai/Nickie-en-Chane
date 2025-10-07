'use client';

import { useState } from 'react';
import { RSVPSessionData } from '@/types/rsvp-session';
import { updateGuestSongRequest, updateSessionStep } from '@/utils/rsvp-session';

interface TokenCache { //to cache the api token to only get a new one when expired
  value: string | null;
  expiry: number | null;
}

const tokenCache: TokenCache = {
  value: null,
  expiry: null
};

interface SongStepProps {
  session: RSVPSessionData;
  onSessionUpdate: (session: RSVPSessionData) => void;
  onBack: () => void;
  onCancelRSVP: () => void;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
  external_urls: { spotify: string };
}

async function getToken(): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache.value && tokenCache.expiry && tokenCache.expiry > Date.now()) {
    return tokenCache.value;
  }

  try {
    // Fetch new token
    const tokenResponse = await fetch('/api/spotify/token');

    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token || !tokenData.expires_in) {
      throw new Error('Invalid token response structure');
    }

    // Cache the token with expiry (usually 1 hour for Spotify)
    tokenCache.value = tokenData.access_token;
    tokenCache.expiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // 1 minute buffer

    return tokenCache.value as string;

  } catch (error) {
    console.error('Error getting token:', error);
    // Clear cache on error
    tokenCache.value = null;
    tokenCache.expiry = null;
    throw error;
  }
}

export default function SongStep({ session, onSessionUpdate, onBack, onCancelRSVP }: SongStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [albumArtUrls, setAlbumArtUrls] = useState<{ [guestId: string]: string }>({});

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
      const access_token = await getToken();

      // Soek liedjies
      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=3`,
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
    const albumArtUrl = track.album.images[0]?.url || '';

    // Update session met alle Spotify data - gebruik die bestaande velde
    const updatedSession = {
      ...session,
      guests: session.guests.map(guest =>
        guest.id === guestId
          ? {
            ...guest,
            songRequest: songString,
            spotifyTrackId: track.id,
            songAlbumArt: albumArtUrl
          }
          : guest
      )
    };

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
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-2">Gekose liedjie:</p>
                  <div className="flex items-center space-x-3">
                    {/* Album Art - gebruik guest.songAlbumArt direk */}
                    {guest.songAlbumArt && (
                      <img
                        src={guest.songAlbumArt}
                        alt="Album cover"
                        className="w-12 h-12 rounded flex-shrink-0"
                      />
                    )}
                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-green-700 font-medium truncate">{guest.songRequest.split(' - ')[0]}</p>
                      <p className="text-green-600 text-sm truncate">
                        {guest.songRequest.split(' - ')[1]}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const updatedSession = {
                        ...session,
                        guests: session.guests.map(g =>
                          g.id === guest.id
                            ? {
                              ...g,
                              songRequest: '',
                              spotifyTrackId: undefined,
                              songAlbumArt: undefined
                            }
                            : g
                        )
                      };
                      onSessionUpdate(updatedSession);
                    }}
                    className="text-sm text-green-600 hover:text-green-800 mt-2"
                  >
                    Verander liedjie
                  </button>
                </div>
              )}

              {/* Soek veld */}
              {(!guest.songRequest || selectedGuest === guest.id) && (
                <div className="relative h-70">
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


            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
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

      {/* Add Powered by Spotify at the very bottom */}
      <div className="mt-15 flex items-center justify-center border rounded-lg space-x-2 text-sm">
        <span style={{ color: '#000000' }}>Powered by Spotify</span>
        {/* Spotify logo SVG */}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#1DB954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-2-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      </div>
    </div>
  );
}