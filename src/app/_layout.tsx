import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Devtools can be added later if needed
import { SplashScreen, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { useAuthStore } from '../stores/authStore';

// Create a client
const queryClient = new QueryClient();

function RootLayoutNav() {
  const { session, loading, isInitialized, initializeAuth } = useAuthStore();
  const pathname = usePathname();
  const isMounted = useRef(false); // To prevent splash hide on unmount or during initial fast transitions

  useEffect(() => {
    isMounted.current = true;
    initializeAuth();
    return () => {
      isMounted.current = false;
    };
  }, []); // Remove initializeAuth dependency to prevent re-initialization on every render

  useEffect(() => {
    if (!isMounted.current) return;

    if (loading || !isInitialized) {
      SplashScreen.preventAutoHideAsync();
      return;
    }

    // DEVELOPMENT: Route protection disabled for easier testing
    console.log('Dev mode - allowing all routes, pathname:', pathname);
    if (isMounted.current) {
      SplashScreen.hideAsync();
    }

    // TODO: Re-enable route protection logic here when ready for production

  }, [session, loading, isInitialized, pathname]);

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
