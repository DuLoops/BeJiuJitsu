import { AuthContext, AuthProvider } from '@/src/context/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Devtools can be added later if needed
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import { getProfile } from '@/src/features/profile/services/profileService'; // Assuming this service exists

// Create a client
const queryClient = new QueryClient();

function RootLayoutNav() {
  const auth = useContext(AuthContext);
  const segments = useSegments();

  useEffect(() => {
    if (auth?.loading) return; // Wait until auth state is determined

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)';

    const checkProfileAndRedirect = async () => {
      if (auth?.session?.user) {
        try {
          const profile = await getProfile(auth.session.user.id);
          if (!profile) {
            if (segments[1] !== 'create-profile') { // Avoid redirect loop
              router.replace('/(protected)/create-profile');
            }
          } else if (inAuthGroup || segments.length === 0 || segments[0] === '') {
            // If logged in and has profile, redirect from auth or root to protected home
            router.replace('/(protected)/');
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          // Handle error, maybe redirect to login or show an error message
          if (inProtectedGroup) { // If error occurs while in protected area, redirect to login
            router.replace('/(auth)/login');
          }
        }
      } else {
        // No session, redirect to login if not already in auth group
        if (!inAuthGroup) {
          router.replace('/(auth)/login');
        }
      }
    };

    checkProfileAndRedirect();

  }, [auth?.session, auth?.loading, segments]);


  // Before auth.loading is false, we can return a loading screen or null
  // For simplicity, returning null, but a splash screen or loading indicator is better UX
  if (auth?.loading) {
    return null; // Or a loading spinner
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
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DarkTheme}>
          <StatusBar style="auto" />
          <RootLayoutNav />
        </ThemeProvider>
      </AuthProvider>
      {/* {__DEV__ && <ReactQueryDevtools client={queryClient} />} */}
    </QueryClientProvider>
  );
}
