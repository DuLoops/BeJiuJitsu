import React from 'react';
import { Stack} from "expo-router";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { useProtectedRoute } from '@/src/hooks/useProtectedRoute';
import { ThemeProvider } from "@/src/context/ThemeContext";
import { useTheme } from '@/src/context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoadingScreen } from '@/src/app/LoadingScreen';


export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <RootLayoutNav />
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  useProtectedRoute();  
  const { activeTheme } = useTheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false, 
        contentStyle: { backgroundColor: activeTheme.background.default },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="(auth)/Landing" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/Signup" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)/CreateProfile" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen
        name="+not-found"
        options={{
          title: 'Not Found',
          presentation: 'modal'
        }}
      />
    </Stack>
  );
}