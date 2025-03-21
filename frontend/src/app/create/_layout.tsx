import { Stack } from 'expo-router';
import { SkillProvider } from '@/src/context/SkillContext';

export default function CreateLayout() {
  return (
    <SkillProvider>
      <Stack>
        <Stack.Screen 
          name="index"
          options={{
            title: 'Create New Entry',
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </SkillProvider>
  );
}
