import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useAuthStore } from '@/src/store/authStore';
import { useSkillDataStore } from '@/src/store/skillDataStore';
import { Stack, router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

export default function ProtectedLayout() {
  const { session, loading, isInitialized } = useAuthStore();
  const { fetchAllSkills, allSkills, isLoadingAllSkills } = useSkillDataStore();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!isInitialized) return;

    if (!loading && !session) {
      router.replace('/(auth)/login');
    }
  }, [session, loading, isInitialized]);

  useEffect(() => {
    if (userId && allSkills.length === 0 && !isLoadingAllSkills) {
      fetchAllSkills(userId);
    }
  }, [userId, fetchAllSkills, allSkills.length, isLoadingAllSkills]);

  if (loading || !isInitialized || (!loading && !session) || (allSkills.length === 0 && isLoadingAllSkills && userId)) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(modal)" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="create-profile" options={{ title: 'Create Profile' }} />
    </Stack>
  );
}
