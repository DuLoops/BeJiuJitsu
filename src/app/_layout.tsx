import { AuthProvider } from '@/src/context/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const colorScheme = 'light';


  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DarkTheme}>
          <StatusBar style="auto" />
          <Stack>
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
      {/* Conditionally render Devtools for React Native - usually triggered by a gesture or button in dev mode */}
      {/* For simplicity here, we'll always include them if __DEV__ is true */}
      {__DEV__ && <ReactQueryDevtools client={queryClient} />}
    </QueryClientProvider>
  );
}
