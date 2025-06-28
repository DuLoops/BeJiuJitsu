import { Stack } from 'expo-router';
import React from 'react';
import FollowersListScreen from '../../../_features/profile/screens/FollowersListScreen';

// This page can be used to display the "followers" list for any user, by passing a userId param.
// If no userId param is passed, FollowersListScreen will default to the current authenticated user.
export default function FollowersPage() {
  return (
    <>
      <Stack.Screen options={{ title: 'Followers' }} />
      <FollowersListScreen />
    </>
  );
}
