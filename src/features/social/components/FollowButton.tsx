import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import {
  followUser,
  getFollowStatus,
  unfollowUser,
} from '@/src/features/social/services/socialService';
import { useAuthStore } from '@/src/store/authStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Alert } from 'react-native';

interface FollowButtonProps {
  targetUserId: string;
}

export default function FollowButton({ targetUserId }: FollowButtonProps) {
  const { session } = useAuthStore();
  const currentUserId = session?.user?.id;
  const queryClient = useQueryClient();

  const queryKey = ['followStatus', currentUserId, targetUserId];

  const { data: isFollowing, isLoading: isLoadingStatus } = useQuery<boolean, Error>({
    queryKey: queryKey,
    queryKeyHashFn: () => `followStatus-${currentUserId}-${targetUserId}`,
    queryFn: () => getFollowStatus(currentUserId!, targetUserId),
    enabled: !!currentUserId && !!targetUserId && currentUserId !== targetUserId,
  });

  const followMutation = useMutation({
    mutationFn: () => followUser(currentUserId!, targetUserId),
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey });
      const previousStatus = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, true);
      return { previousStatus };
    },
    onError: (err, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(queryKey, context.previousStatus);
      }
      Alert.alert('Error', 'Failed to follow user.');
      console.error('Follow error:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey }); // Own status
      queryClient.invalidateQueries({ queryKey: ['followCounts', currentUserId] });
      queryClient.invalidateQueries({ queryKey: ['followCounts', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['followingList', currentUserId] });
      queryClient.invalidateQueries({ queryKey: ['followersList', currentUserId] });
      queryClient.invalidateQueries({ queryKey: ['followingList', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['followersList', targetUserId] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(currentUserId!, targetUserId),
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey });
      const previousStatus = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, false);
      return { previousStatus };
    },
    onError: (err, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(queryKey, context.previousStatus);
      }
      Alert.alert('Error', 'Failed to unfollow user.');
      console.error('Unfollow error:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey }); // Own status
      queryClient.invalidateQueries({ queryKey: ['followCounts', currentUserId] });
      queryClient.invalidateQueries({ queryKey: ['followCounts', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['followingList', currentUserId] });
      queryClient.invalidateQueries({ queryKey: ['followersList', currentUserId] });
      queryClient.invalidateQueries({ queryKey: ['followingList', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['followersList', targetUserId] });
    },
  });

  if (!currentUserId || currentUserId === targetUserId) {
    return null; // Don't show button if not logged in or for self
  }

  if (isLoadingStatus) {
    return <ThemedButton title="Loading..." disabled style={{ paddingHorizontal: 10, paddingVertical: 6 }} />;
  }

  const handlePress = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <ThemedButton
      title={isFollowing ? 'Unfollow' : 'Follow'}
      onPress={handlePress}
      disabled={followMutation.isPending || unfollowMutation.isPending}
      // Example: Use buttonColor prop if ThemedButton supports it, or pass style
      // For simplicity, direct style is used here, but ideally ThemedButton handles variants
      style={{ 
        paddingHorizontal: 10, 
        paddingVertical: 6, 
        backgroundColor: isFollowing ? 'grey' : 'royalblue' // Example theme-friendly colors
      }}
    />
  );
}
