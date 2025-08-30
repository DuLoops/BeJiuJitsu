import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="create/record" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="create/post" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
      name="create/index" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
}
