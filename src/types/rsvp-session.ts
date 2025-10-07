// src/types/rsvp-session.ts
export interface GuestSessionData {
  id: string;
  name: string;
  is_adult: boolean;
  is_attending: boolean;
  songRequest: string;
  drinkPreferences: string[];
  extraNotes: string;
  songAlbumArt?: string;
}

export interface RSVPSessionData {
  familyId: string;
  familyName: string;
  guests: GuestSessionData[];
  currentStep: 'attendance' | 'songs' | 'drinks' | 'notes' | 'payment' | 'complete';
  submitted: boolean;
}

export type RSVPStep = RSVPSessionData['currentStep'];