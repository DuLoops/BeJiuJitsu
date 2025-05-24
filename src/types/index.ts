export interface Profile {
  id: string; // Foreign key to auth.users.id
  username: string;
  full_name?: string;
  avatar_url?: string;
  belt_color?: 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';
  stripes?: number; // 0-4
  weight?: number; // in kg or lbs, define a unit or let user specify
  // Add any other fields you need for a user profile
  updated_at: Date;
}

// You can add other shared types here
