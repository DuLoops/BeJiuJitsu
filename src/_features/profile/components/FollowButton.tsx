import {
  followUser,
  getFollowStatus,
  unfollowUser,
} from '@/src/_features/profile/services/socialService';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
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

  const { data: isFollowing, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['followStatus', currentUserId, targetUserId],
    queryFn: () => getFollowStatus(currentUserId!, targetUserId),
    enabled: !!currentUserId,
  });

  const { mutate: follow, isPending: isFollowingAction } = useMutation({
    mutationFn: () => followUser(currentUserId!, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', currentUserId, targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['followCounts', targetUserId] });
    },
    onError: (err: any) => {
      Alert.alert('Error', 'Could not follow user.');
    },
  });

  const { mutate: unfollow, isPending: isUnfollowingAction } = useMutation({
    mutationFn: () => unfollowUser(currentUserId!, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', currentUserId, targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['followCounts', targetUserId] });
    },
    onError: (err: any) => {
      Alert.alert('Error', 'Could not unfollow user.');
    },
  });

  const handlePress = () => {
    if (!currentUserId) {
      Alert.alert('Please sign in to follow users.');
      return;
    }
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  if (!currentUserId || currentUserId === targetUserId) {
    return null;
  }

  return (
    <ThemedButton
      onPress={handlePress}
      title={isFollowing ? 'Unfollow' : 'Follow'}
      disabled={isLoadingStatus || isFollowingAction || isUnfollowingAction}
    />
  );
}
