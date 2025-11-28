import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Devtools can be added later if needed
import { SplashScreen, Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { useAuthStore } from '../stores/authStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
    const isPotentiallyAtRootOrAppEntry = !inAuthGroup && !inProtectedGroup;

    console.log('Auth check - session:', !!session, 'segments:', segments);

    if (session) {
      // User is authenticated
      if (inAuthGroup || isPotentiallyAtRootOrAppEntry) {
        console.log('Redirecting authenticated user to protected area');
        router.replace('/(protected)/(tabs)');
      } else {
        hideSplashSafely();
      }
    } else {
      // User is not authenticated
      if (!inAuthGroup) {
        console.log('Redirecting unauthenticated user to login');
        router.replace('/(auth)/login');
      } else {
        hideSplashSafely();
      }
    }

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
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DarkTheme}>
          <StatusBar style="auto" />
          <RootLayoutNav />
        </ThemeProvider>
        {/* {__DEV__ && <ReactQueryDevtools client={queryClient} />} */}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
