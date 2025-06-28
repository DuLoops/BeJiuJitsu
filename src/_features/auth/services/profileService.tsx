import { supabase } from '@/src/lib/supabase';
// import { Belt } from '@/src/supabase/constants'; // Removed
import { Enums, Tables, TablesInsert } from '@/src/supabase/types'; // Added Enums

export type Profile = Tables<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;

type BeltType = Enums<'Belts'>; // Using Enums helper for Belt type

export const checkSupabaseUsername = async (
  username: string,
): Promise<boolean> => {
  if (!username || username.trim() === '') {
    return false;
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking username availability in service:', error);
      throw new Error(error.message || 'Failed to check username availability');
    }
    return !data;
  } catch (err) {
    console.error('Catch block error in checkSupabaseUsername:', err);
    if (err instanceof Error) throw err;
    throw new Error('An unexpected error occurred while checking username.');
  }
};

export interface UpsertProfileParams {
  id: string;
  username: string;
  belt: BeltType; // Changed to BeltType
  stripes: number;
  weight?: number;
  academy_id?: number;
  full_name?: string;
  role?: string;
}

export const upsertSupabaseProfile = async (profileData: UpsertProfileParams): Promise<Profile> => {
  try {
    const profileToUpsert: ProfileInsert = {
      ...profileData,
      // belt: profileData.belt as any, // Ensure belt type is compatible with DB enum if needed
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileToUpsert, { onConflict: 'id' })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating/updating profile in service:', error);
      throw new Error(error?.message || 'Failed to create or update profile. No data returned.');
    }
    return data;
  } catch (err) {
    console.error('Catch block error in upsertSupabaseProfile:', err);
    if (err instanceof Error) throw err;
    throw new Error('An unexpected error occurred while creating/updating the profile.');
  }
};

export const fetchProfileByUserId = async (userId: string): Promise<Profile | null> => {
  if (!userId) {
    throw new Error('User ID is required to fetch profile.');
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile in service:', error);
      throw new Error(error.message || 'Failed to fetch profile.');
    }
    return data;
  } catch (err) {
    console.error('Catch block error in fetchProfileByUserId:', err);
    if (err instanceof Error) throw err;
    throw new Error('An unexpected error occurred while fetching profile.');
  }
};
