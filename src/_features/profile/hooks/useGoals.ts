import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import {
  addGoalToSupabase,
  AddSupabaseGoalParams,
  deleteSupabaseGoal,
  fetchGoalsByProfileId,
  Goal,
  updateSupabaseGoal,
  UpdateSupabaseGoalParams,
} from '../services/goalService';

export const GOALS_QUERY_KEY_PREFIX = 'goals';

// Hook to fetch goals for a specific profile ID
export const useFetchGoals = (profileId: string | undefined) => {
  return useQuery<Goal[], Error>(
    {
      queryKey: [GOALS_QUERY_KEY_PREFIX, 'byProfile', profileId],
      queryFn: () => {
        if (!profileId) {
          // Or return Promise.resolve([]) if an empty list is acceptable for no ID
          throw new Error('Profile ID is required to fetch goals.');
        }
        return fetchGoalsByProfileId(profileId);
      },
      enabled: !!profileId, // Only run query if profileId is available
      staleTime: 1000 * 60 * 2, // Data fresh for 2 minutes
      // Query-level onError removed, will be handled by component
    }
  );
};

// Hook to add a new goal
export const useAddGoal = () => {
  const queryClient = useQueryClient();
  return useMutation<Goal, Error, AddSupabaseGoalParams>(
    {
      mutationFn: addGoalToSupabase,
      onSuccess: (newGoal) => {
        // Invalidate queries related to goals to refetch and show the new goal.
        // Be specific if possible, e.g., invalidate goals for the specific profile.
        queryClient.invalidateQueries({ queryKey: [GOALS_QUERY_KEY_PREFIX, 'byProfile', newGoal.profile_id] });
        Alert.alert('Success', 'Goal added successfully!');
      },
      onError: (error: Error) => {
        Alert.alert('Error Adding Goal', error.message || 'Could not add goal.');
      },
    }
  );
};

// Hook to update an existing goal
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation<Goal, Error, UpdateSupabaseGoalParams>(
    {
      mutationFn: updateSupabaseGoal,
      onSuccess: (updatedGoal) => {
        // Invalidate all goals queries for this profile or be more specific if needed
        queryClient.invalidateQueries({ queryKey: [GOALS_QUERY_KEY_PREFIX, 'byProfile', updatedGoal.profile_id] });
        // Potentially update the specific goal in the cache directly for optimistic updates or faster UI response
        // queryClient.setQueryData([GOALS_QUERY_KEY_PREFIX, 'detail', updatedGoal.id], updatedGoal);
        Alert.alert('Success', 'Goal updated successfully!');
      },
      onError: (error: Error) => {
        Alert.alert('Error Updating Goal', error.message || 'Could not update goal.');
      },
    }
  );
};

// Hook to delete a goal
export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  // Assuming deleteSupabaseGoal takes goalId and we also need profile_id for invalidation
  // The mutation variables will be { goalId: number; profileId: string; }
  return useMutation<void, Error, { goalId: number; profileId: string | undefined }>(
    {
      mutationFn: ({ goalId }) => deleteSupabaseGoal(goalId), // Pass only goalId to service if that's what it expects
      onSuccess: (_, variables) => {
        // Invalidate goals for the specific profile.
        if (variables.profileId) {
          queryClient.invalidateQueries({ queryKey: [GOALS_QUERY_KEY_PREFIX, 'byProfile', variables.profileId] });
        } else {
          // If profileId wasn't available for some reason, invalidate all goals queries as a fallback (less ideal)
          queryClient.invalidateQueries({ queryKey: [GOALS_QUERY_KEY_PREFIX] });
        }
        Alert.alert('Success', 'Goal deleted successfully!');
      },
      onError: (error: Error) => {
        Alert.alert('Error Deleting Goal', error.message || 'Could not delete goal.');
      },
    }
  );
}; 