import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
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
            <AutocompleteDropdownContextProvider>
              <RootLayoutNav />
            </AutocompleteDropdownContextProvider>
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
      <Stack.Screen
        name="create/CreateSkillScreen"
        options={{ headerShown: true, title: "New Skill" }}
      />
      <Stack.Screen
        name="create/CreateCompetitionScreen"
        options={{ headerShown: true, title: "Competition" }}
      />
      <Stack.Screen
        name="create/CreateTrainingScreen"
        options={{ headerShown: true, title: "Training" }}
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