import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Devtools can be added later if needed
import { SplashScreen, Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { getProfile } from '../_features/profile/services/profileService';
import { useAuthStore } from '../store/authStore';

// Create a client
const queryClient = new QueryClient();

function RootLayoutNav() {
  const { session, loading, isInitialized, initializeAuth } = useAuthStore();
  const segments = useSegments();
  const isMounted = useRef(false); // To prevent splash hide on unmount or during initial fast transitions

  useEffect(() => {
    isMounted.current = true;
    initializeAuth();
    return () => {
      isMounted.current = false;
    };
  }, [initializeAuth]);

  useEffect(() => {
    if (!isMounted.current) return;

    const hideSplashSafely = () => {
      if (isMounted.current) {
        SplashScreen.hideAsync();
      }
    };

    if (loading || !isInitialized) {
      SplashScreen.preventAutoHideAsync();
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)';
    // Simplified root check: if not in auth or protected, assume it's a root-like state or an unhandled path.
    // Redirection logic will handle if it's a valid logged-in user at such a path.
    const isPotentiallyAtRootOrAppEntry = !inAuthGroup && !inProtectedGroup;
    const isAtCreateProfile = segments.length > 1 && segments[0] === '(protected)' && segments[1] === 'create-profile';

    const checkProfileAndRedirect = async () => {
      try {
        if (session?.user) {
          const profile = await getProfile(session.user.id);
          if (!profile) {
            if (!isAtCreateProfile) {
              router.replace('/(protected)/create-profile');
            } else {
              hideSplashSafely(); 
            }
          } else if (inAuthGroup || isPotentiallyAtRootOrAppEntry) { // If logged in with profile, and in auth or at app entry, go to tabs
            router.replace('/(protected)/(tabs)');
          } else {
            hideSplashSafely(); 
          }
        } else { // No session
          if (!inAuthGroup) {
            router.replace('/(auth)/login');
          } else {
            hideSplashSafely(); 
          }
        }
      } catch (error) {
        console.error("Failed to process auth state or fetch profile:", error);
        if (inProtectedGroup && !isAtCreateProfile) {
          router.replace('/(auth)/login');
        } else {
          hideSplashSafely();
        }
      }
    };

    checkProfileAndRedirect();

  }, [session, loading, isInitialized, segments, initializeAuth]);

  if (loading || !isInitialized) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const colorScheme = 'light'; // Keep light theme for now

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DarkTheme}>
        <StatusBar style="auto" />
        <RootLayoutNav />
      </ThemeProvider>
      {/* {__DEV__ && <ReactQueryDevtools client={queryClient} />} */}
    </QueryClientProvider>
  );
}
