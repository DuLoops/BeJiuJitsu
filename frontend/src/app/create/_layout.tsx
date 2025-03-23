import { Stack } from 'expo-router';
import { SkillProvider } from '@/src/context/SkillContext';
import { useTheme } from '@/src/context/ThemeContext';

export default function CreateLayout() {
  const { activeTheme } = useTheme();
  
  return (
    <SkillProvider>
      <Stack 
        screenOptions={{
          headerShown: true,
          contentStyle: { backgroundColor: activeTheme.background.default },
          headerTintColor: activeTheme.text.primary,
          headerStyle: { backgroundColor: activeTheme.background.paper }
        }}
      >
        <Stack.Screen 
          name="CreateSkillScreen" 
          options={{ title: "Skill", }} 
        />
        <Stack.Screen 
          name="CreateCompetitionScreen" 
          options={{ title: "Competition" }}
        />
        <Stack.Screen 
          name="CreateTrainingScreen" 
          options={{ title: "Training" }}
        />
      </Stack>
    </SkillProvider>
  );
}
