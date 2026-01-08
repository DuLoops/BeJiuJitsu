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

    if (session) {
      // User is authenticated
      if (inAuthGroup || isPotentiallyAtRootOrAppEntry) {
        router.replace('/(protected)/(tabs)');
      } else {
        hideSplashSafely();
      }
    } else {
      // User is not authenticated
      if (!inAuthGroup) {
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
    <Stack >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

// ... (imports remain the same)

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background,
      text: Colors.light.text,
      card: Colors.light.card || Colors.light.background,
      border: Colors.light.border,
      primary: Colors.light.tint,
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.dark.background,
      text: Colors.dark.text,
      card: Colors.dark.card || Colors.dark.background,
      border: Colors.dark.border,
      primary: Colors.dark.tint,
    },
  };


  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'light' ? MyTheme : MyDarkTheme}>
          <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />
          <RootLayoutNav />
        </ThemeProvider>
        {/* {__DEV__ && <ReactQueryDevtools client={queryClient} />} */}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
