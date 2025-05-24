import { supabase } from '@/src/lib/supabase';
import { Profile } from '@/src/types'; // Assuming you have a Profile type defined

export const createProfile = async (profileData: Omit<Profile, 'id' | 'updated_at'> & { id: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        ...profileData,
        updated_at: new Date(),
      },
    ])
    .select(); // Optionally select the created profile to return it

  if (error) throw error;
  return data ? data[0] : null;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: single row not found
    throw error;
  }
  return data;
};

export const updateProfile = async (userId: string, profileData: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...profileData, updated_at: new Date() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
  return data as Profile;
};

// Add other profile-related service functions here
