export interface Family {
  id: string;
  email: string;
  invite_code: string;
  family_name: string;
  rsvp_status: string;
  total_adults: number;
  total_children: number;
  created_at: string;
  deposit_option?: 'gift' | 'refund';
}

export interface Guest {
  id: string;
  family_id: string;
  name: string;
  is_adult: boolean;
  is_attending: boolean;
  dietary_requirements: string;
  meal_preference: string;
  song_request: string; // ✅ NUUT
  drink_preferences: string[]; // ✅ NUUT - JSON array van drink IDs
  extra_notes: string; // ✅ NUUT
  created_at: string;
}

export interface Payment {
  id: string;
  family_id: string;
  amount: number;
  payment_method: 'ikhoka' | 'eft';
  payment_status: 'pending' | 'paid' | 'failed';
  paid_amount?: number;
  paid_at?: string;
  payment_proof?: string;
  paid_by?: string;
  deposit_option?: 'gift' | 'refund';
  created_at: string;
  updated_at: string;
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
  song_request: string; 
  drink_preferences: string[]; 
  extra_notes: string; 
}

export type ModalType = 'add-family' | 'edit-family' | 'edit-guest' | 'manage-payment';