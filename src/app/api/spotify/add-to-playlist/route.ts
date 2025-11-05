import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { trackIds } = await request.json();

    if (!trackIds?.length) {
      return NextResponse.json({ error: 'No track IDs provided' }, { status: 400 });
    }

    const playlistId = process.env.SPOTIFY_PLAYLIST_ID!;
    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

    const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    const tokenData = await refreshResponse.json();

    if (!refreshResponse.ok) {
      //console.error('Token refresh failed:', tokenData);
      return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 });
    }

    const access_token = tokenData.access_token;

    const addResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackIds.map((id: string) => `spotify:track:${id}`),
        }),
      }
    );

    const data = await addResponse.json();

    if (!addResponse.ok) {
      //console.error('Spotify API error');
      return NextResponse.json(
        { error: data.error?.message || 'Failed to add to playlist' },
        { status: addResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      snapshot_id: data.snapshot_id,
    });
  } catch (error) {
    //console.error('Spotify playlist error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
