import { supabase } from '@/src/lib/supabase';
import { Belt } from '@/src/supabase/constants';
import { TablesInsert } from '@/src/supabase/types';
import { Alert } from 'react-native';

export type ProfileInsert = TablesInsert<'profiles'>;

export const useProfileService = () => {
  const checkUserNameAvailability = async (
    username: string,
  ): Promise<boolean> => {
    if (!username) {
      return false; 
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking username availability:', error);
        throw new Error('Failed to check username availability');
      }
      return !data;
    } catch (err) {
      console.error(err);
      throw new Error('An unexpected error occurred while checking username.');
    }
  };

  const createProfile = async (profileData: {
    userName: string;
    belt: Belt;
    stripes: number;
    weight?: number;
    academy?: number;
    avatar?: string;
  }): Promise<void> => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error fetching user:', userError);
        Alert.alert('Error', 'Could not fetch user session. Please try again.');
        throw new Error('User not authenticated');
      }

      const profileToInsert: ProfileInsert = {
        id: user.id,
        username: profileData.userName,
        belt: profileData.belt,
        stripes: profileData.stripes,
        weight: profileData.weight,
        academy_id: profileData.academy,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        full_name: '', 
        role: 'user', 
      };
      
      const { error } = await supabase.from('profiles').upsert(profileToInsert, { onConflict: 'id' });

      if (error) {
        console.error('Error creating or updating profile:', error);
        Alert.alert('Error', `Failed to create or update profile: ${error.message}`);
        throw new Error(`Failed to create or update profile: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('An unexpected error occurred while creating the profile.');
    }
  };

  return { 
    checkUserNameAvailability, 
    createProfile
  };
};
