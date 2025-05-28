import { supabase } from '@/src/lib/supabase'; // For getting current user ID
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import {
  checkSupabaseUsername,
  fetchProfileByUserId,
  Profile,
  UpsertProfileParams,
  upsertSupabaseProfile,
} from '../../auth/services/profileService';

export const PROFILE_QUERY_KEY_PREFIX = 'profile';

// Hook to fetch the current user's profile
export const useFetchCurrentUserProfile = () => {
  return useQuery<Profile | null, Error>({
    queryKey: [PROFILE_QUERY_KEY_PREFIX, 'me'],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user?.id) {
        console.warn('No active session to fetch current user profile.');
        // For a query, returning null or throwing an error are options.
        // If profile is essential, throwing error might be better for error state.
        throw new Error('User not authenticated or session not found.'); 
      }
      return fetchProfileByUserId(session.user.id);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    // onError removed, will be handled by component using isError and error properties
  });
};

// Hook to check username availability (as a query, re-fetches on username change if enabled)
// Consider if this should be a manually triggered mutation if checks are expensive or not always needed.
export const useCheckUsernameAvailability = (username: string) => {
  return useQuery<boolean, Error>({
    queryKey: [PROFILE_QUERY_KEY_PREFIX, 'checkUsername', username],
    queryFn: () => checkSupabaseUsername(username),
    enabled: !!username && username.trim().length > 2, // Only run if username is non-empty and has min length
    staleTime: Infinity, // Typically, availability doesn't change unless someone takes it
    gcTime: 0, // Changed from cacheTime for v5 compatibility
    retry: false, // Don't retry on failure for this, user will likely change input
    // onError removed
  });
};

// Hook for creating or updating a profile
export const useUpsertProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<Profile, Error, UpsertProfileParams>({
    mutationFn: upsertSupabaseProfile,
    onSuccess: (updatedProfile: Profile) => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY_PREFIX, 'me'] });
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY_PREFIX, updatedProfile.id] });
      Alert.alert('Success', 'Profile saved successfully!');
    },
    onError: (error: Error) => { // onError is valid for useMutation
      Alert.alert('Profile Save Error', error.message || 'Could not save profile.');
    },
  });
}; 