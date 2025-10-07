import { NextResponse } from 'next/server';

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const redirectUri = 'https://thundermerwefees.co.za/api/spotify/callback';
const scope = 'playlist-modify-public playlist-modify-private';

export async function GET() {
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.search = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
  }).toString();

  return NextResponse.redirect(authUrl.toString());
}
