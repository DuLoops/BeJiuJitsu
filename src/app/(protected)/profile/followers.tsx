import FollowersListScreen from '@/src/features/social/screens/FollowersListScreen';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText';

// This page can be used to display the "followers" list for any user, by passing a userId param.
// If no userId param is passed, FollowersListScreen will default to the current authenticated user.
export default function FollowersListPage() {
  const params = useLocalSearchParams<{ userId?: string; username?: string }>();
  const title = params.username ? `${params.username}'s Followers` : 'Followers';

  return (
    <>
      <Stack.Screen options={{ title: title, headerBackTitleVisible: false }} />
      <FollowersListScreen userIdProp={params.userId} />
    </>
  );
}
