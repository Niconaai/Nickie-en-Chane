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
  invite_sent?: boolean; 
  confirmation_sent?: boolean; 
}

export interface Guest {
  id: string;
  family_id: string;
  name: string;
  is_adult: boolean;
  is_attending: boolean;
  dietary_requirements: string;
  meal_preference: string;
  song_request: string; 
  drink_preferences: string[]; 
  extra_notes: string; 
  created_at: string;
}

export interface Payment {
  id: string;
  family_id: string;
  amount: number;
  payment_method: 'yoco' | 'eft';
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

export interface Product {
  name: string;
  price: string;
  volume: string;
  department: string;
  category: string;
  image_url: string;
  source_url: string;
}