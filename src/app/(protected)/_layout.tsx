import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useAuthStore } from '@/src/stores/authStore';

import { Stack, router, usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

export default function ProtectedLayout() {
  const { session, loading, isInitialized } = useAuthStore();
  const userId = session?.user?.id;
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) return;

    // DEVELOPMENT: Protection disabled for easier testing
    console.log('Protected layout - dev mode, allowing access, pathname:', pathname);

    // if (!loading && !session) {
    //   router.replace({ pathname: '/(auth)/login', params: { redirect: pathname || '/' } });
    // }
  }, [session, loading, isInitialized, pathname]);

  if (loading || !isInitialized) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  // DEVELOPMENT: Session check disabled for easier testing
  // if (!loading && !session) {
  //   return (
  //     <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" />
  //     </ThemedView>
  //   );
  // }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(modal)" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="profile/index" options={{ title: 'User Profile'}} />
      <Stack.Screen name="create-profile" options={{ title: 'Create Profile' }} />
    </Stack>
  );
}
