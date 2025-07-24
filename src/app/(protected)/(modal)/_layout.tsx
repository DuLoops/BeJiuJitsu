import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="create/competition" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="create/skill" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="create/training" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
}
