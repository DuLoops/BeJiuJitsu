import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { useProtectedRoute } from '@/src/hooks/useProtectedRoute';
import { ThemeProvider } from "@/src/context/ThemeContext";
import { useTheme } from '@/src/context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


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
  const { isAuthenticated } = useAuth();
  useProtectedRoute();
  const { activeTheme } = useTheme();

  return (
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: activeTheme.background.default } }}>
        {/* Auth Stack */}
        <Stack.Screen name="(auth)/Landing" />
        <Stack.Screen name="(auth)/Login" />
        <Stack.Screen name="(auth)/Signup" />
        {/* <Stack.Screen name="(auth)/ForgotPassword" />
      <Stack.Screen name="(auth)/CreateProfile" /> */}
        {/* Onboarding Stack */}
        <Stack.Screen name="(onboarding)/CreateProfile" />
        {/* <Stack.Screen name="(onboarding)/ConfirmEmail" /> */}

        {/* Main App Stack */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Create Stack - reference only the folder, not individual screens */}
        <Stack.Screen
          name="create"
          options={{
            headerShown: false  // Let the nested layout handle headers
          }}
        />

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