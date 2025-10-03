export interface Family {
  id: string;
  email: string;
  invite_code: string;
  family_name: string;
  rsvp_status: string;
  total_adults: number;
  total_children: number;
  created_at: string;
}

export interface Guest {
  id: string;
  family_id: string;
  name: string;
  is_adult: boolean;
  is_attending: boolean;
  dietary_requirements: string;
  meal_preference: string;
  created_at: string;
}

export interface FamilyFormData {
  email: string;
  invite_code: string;
  family_name: string;
  total_adults: number;
  total_children: number;
  rsvp_status: string;
}

export interface GuestFormData {
  name: string;
  is_adult: boolean;
  is_attending: boolean;
  dietary_requirements: string;
  meal_preference: string;
}

export type ModalType = 'add-family' | 'edit-family' | 'edit-guest';