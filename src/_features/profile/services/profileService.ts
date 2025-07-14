import { supabase } from '@/src/lib/supabase';
// import { Profile } from '@/src/types'; // Removed
import { Tables, TablesInsert, TablesUpdate } from '@/src/supabase/types'; // Added Tables helpers

type Profile = Tables<'profiles'>;

// For createProfile, we expect the user's ID to be passed in.
// The actual DB schema might autogenerate `id` if it's a serial type, 
// but Supabase client often expects `id` for `insert` if it's a UUID set by auth.
// Assuming `id` is provided by the caller (e.g., from auth.session.user.id)
export const createProfile = async (profileData: TablesInsert<'profiles'>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
        ...profileData, 
        // updated_at is often handled by DB trigger or should be set here if not.
        // If your DB auto-updates updated_at, you might not need to set it here.
        // For consistency, let's assume it's set here as in updateProfile.
        updated_at: new Date().toISOString(), 
    }])
    .select()
    .single(); // Assuming you want to return the single created profile

  if (error) throw error;
  return data as Profile | null; // Return single profile or null
};

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  return data as Profile | null;
};

// For updateProfile, id is used in eq, and other fields are in profileData.
// created_at should not be updatable. updated_at will be set.
export const updateProfile = async (userId: string, profileData: TablesUpdate<'profiles'>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...profileData, updated_at: new Date().toISOString() })
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
