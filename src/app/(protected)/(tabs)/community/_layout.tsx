import { Stack } from 'expo-router';
import React from 'react';

export default function CommunityStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
      }}
    >
        <Stack.Screen name="index" options={{
            title: 'Community',
        }} />
        <Stack.Screen name="profile" options={{
            title: 'Profile',
        }} />
    </Stack>
  );
}