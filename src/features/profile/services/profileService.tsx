import { supabase } from '@/src/lib/supabase';
import { Belt } from '@/src/supabase/constants';
import { Tables, TablesInsert } from '@/src/supabase/types';

export type Profile = Tables<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;

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
  belt: Belt;
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
