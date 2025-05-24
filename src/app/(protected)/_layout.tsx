import React, { useContext, useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { AuthContext } from '@/src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function ProtectedLayout() {
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!auth) return;
    const { session, loading } = auth;
    if (!loading && !session) {
      router.replace('/(auth)/login');
    }
  }, [auth?.session, auth?.loading]);

  if (auth?.loading || !auth?.session) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create-profile" options={{ title: 'Create Profile' }} />
    </Stack>
  );
}
