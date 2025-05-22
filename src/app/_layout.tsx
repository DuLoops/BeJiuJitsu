import { AuthProvider } from '@/src/context/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const colorScheme = 'light';


  return (
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
  );
}
