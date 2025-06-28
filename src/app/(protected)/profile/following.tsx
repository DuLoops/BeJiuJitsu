import { Stack } from 'expo-router';
import React from 'react';
import FollowingListScreen from '../../../_features/profile/screens/FollowingListScreen';

// This page can be used to display the "following" list for any user, by passing a userId param.
// If no userId param is passed, FollowingListScreen will default to the current authenticated user.
export default function FollowingPage() {
  return (
    <>
      <Stack.Screen options={{ title: 'Following' }} />
      <FollowingListScreen />
    </>
  );
}
