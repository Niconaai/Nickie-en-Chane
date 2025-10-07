import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { trackIds } = await request.json();
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!trackIds || !Array.isArray(trackIds) || trackIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one Track ID is required' },
        { status: 400 }
      );
    }

    if (!playlistId || !clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Spotify credentials or playlist ID missing' },
        { status: 500 }
      );
    }

    // 1️⃣ Kry access token via client_credentials flow
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':
          'Basic ' +
          Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      console.error('Token fetch failed:', err);
      return NextResponse.json({ error: 'Failed to get token' }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;

    // 2️⃣ Voeg liedjies by publieke playlist
    const addResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackIds.map((id: string) => `spotify:track:${id}`),
        }),
      }
    );

    const data = await addResponse.json();

    if (!addResponse.ok) {
      console.error('Spotify API error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Failed to add to playlist' },
        { status: addResponse.status }
      );
    }

    // 3️⃣ Alles reg
    return NextResponse.json({
      success: true,
      snapshot_id: data.snapshot_id,
    });
  } catch (error) {
    console.error('Spotify playlist error:', error);
    return NextResponse.json(
      { error: 'Failed to add songs to playlist' },
      { status: 500 }
    );
  }
}
