// src/utils/rsvp-session.ts
import { Guest } from '@/components/admin/types';
import { RSVPSessionData, GuestSessionData, RSVPStep } from '@/types/rsvp-session';

const SESSION_KEY = 'rsvp_session';

export const saveRSVPSession = (data: RSVPSessionData): void => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Fout met stoor session:', error);
  }
};

export const getRSVPSession = (): RSVPSessionData | null => {
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Fout met laai session:', error);
    return null;
  }
};

export const clearRSVPSession = (): void => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Fout met skoonmaak session:', error);
  }
};

// Hulp funksie om nuwe session te skep (per guest data)
export const createNewSession = (familyId: string, familyName: string, guests: Guest[]): RSVPSessionData => {
  return {
    familyId,
    familyName,
    guests: guests.map(guest => ({
      id: guest.id,
      name: guest.name,
      is_adult: guest.is_adult,
      is_attending: guest.is_attending || false,
      songRequest: '',
      drinkPreferences: [],
      extraNotes: '',
      spotifyTrackId: undefined, 
      songAlbumArt: undefined 
    })),
    currentStep: 'attendance',
    submitted: false
  };
};

// Hulp funksies om guest data te update
export const updateGuestAttendance = (session: RSVPSessionData, guestId: string, attending: boolean): RSVPSessionData => {
  return {
    ...session,
    guests: session.guests.map(guest =>
      guest.id === guestId ? { ...guest, is_attending: attending } : guest
    )
  };
};

export const updateGuestSongRequest = (
  session: RSVPSessionData,
  guestId: string,
  songRequest: string,
  spotifyTrackId?: string,
  songAlbumArt?: string
): RSVPSessionData => {
  return {
    ...session,
    guests: session.guests.map(guest =>
      guest.id === guestId
        ? {
          ...guest,
          songRequest,
          spotifyTrackId,
          songAlbumArt
        }
        : guest
    )
  };
};

export const updateGuestDrinkPreferences = (session: RSVPSessionData, guestId: string, drinkPreferences: string[]): RSVPSessionData => {
  return {
    ...session,
    guests: session.guests.map(guest =>
      guest.id === guestId ? { ...guest, drinkPreferences } : guest
    )
  };
};

export const updateGuestNotes = (session: RSVPSessionData, guestId: string, extraNotes: string): RSVPSessionData => {
  return {
    ...session,
    guests: session.guests.map(guest =>
      guest.id === guestId ? { ...guest, extraNotes } : guest
    )
  };
};

export const updateSessionStep = (session: RSVPSessionData, step: RSVPStep): RSVPSessionData => {
  return {
    ...session,
    currentStep: step
  };
};

export const updateDepositOption = (session: RSVPSessionData, depositOption: 'gift' | 'refund'): RSVPSessionData => {
  return {
    ...session,
    depositOption
  };
};