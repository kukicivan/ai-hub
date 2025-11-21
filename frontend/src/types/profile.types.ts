export interface UserProfile {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  bio: string | null;
  avatar: string | null;
  user_type_id: number;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
  message: string;
}
