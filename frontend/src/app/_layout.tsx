// src/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PostFormProvider, usePostForm } from '@/src/context/PostContext';
import { Button } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { SkillProvider } from '@/src/context/SkillContext';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'

function HeaderRight() {
  const { handleSubmit } = usePostForm();
  return <Button onPress={handleSubmit} title="Done" />;
}

export default function RootLayout() {
  const { isAuthenticated, hasAccount } = useAuth();
  const navigation = useNavigation();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setInitialRoute('(auth)/Login');
    } else if (!hasAccount) {
      setInitialRoute('(auth)/CreateAccount');
    } else {
      setInitialRoute('(tabs)');
    }
    console.log('initialRoute', initialRoute);
  }, [isAuthenticated, hasAccount]);

  if (initialRoute === null) {
    return null; // or a loading spinner
  }

  return (
    <AutocompleteDropdownContextProvider>
     <AuthProvider>
      <SafeAreaProvider>
        <SkillProvider>
          <PostFormProvider>
            <Stack initialRouteName={initialRoute}>
              <Stack.Screen name="(auth)/Login" options={{ headerShown: false, title: 'Login' }} />
              {/* <Stack.Screen name="(auth)/createAccount" options={{ headerShown: false, title: 'Create Account' }} /> */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Home' }} />
              <Stack.Screen
                name="create/CreateSkillScreen"
                options={{
                  title: "New Skill",
                  headerRight: HeaderRight,
                }}
              />
              <Stack.Screen
                name="create/CreateCompetitionScreen"
                options={{
                  title: "Competition",
                  headerRight: HeaderRight
                }}
              />
              <Stack.Screen
                name="create/CreateTrainingScreen"
                options={{
                  title: "Training",
                  headerRight: HeaderRight
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
          </PostFormProvider>
        </SkillProvider>
      </SafeAreaProvider>
    </AuthProvider>
    </AutocompleteDropdownContextProvider>

  );
}