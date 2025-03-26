// src/hooks/useProtectedRoute.ts
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';

const isDev = process.env.EXPO_PUBLIC_DEV_MODE === 'true';

export function useProtectedRoute() {
  const { isLoading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || isDev) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      console.log('Redirecting to /(auth)/Landing');
      router.replace('/(auth)/Landing');
    } 
  }, [user, isLoading, segments]);
}