import FollowingListScreen from '@/src/features/social/screens/FollowingListScreen';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText';

// This page can be used to display the "following" list for any user, by passing a userId param.
// If no userId param is passed, FollowingListScreen will default to the current authenticated user.
export default function FollowingListPage() {
  const params = useLocalSearchParams<{ userId?: string; username?: string }>();
  const title = params.username ? `${params.username}'s Following` : 'Following';

  return (
    <>
      <Stack.Screen options={{ title: title, headerBackTitleVisible: false }} />
      <FollowingListScreen userIdProp={params.userId} />
    </>
  );
}
