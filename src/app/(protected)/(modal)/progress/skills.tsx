import SkillScreen from '@/src/_features/progress/screens/SkillScreen';
import { Stack } from 'expo-router';

export default function SkillsModal() {
    return (
        <>
            <Stack.Screen options={{
                title: 'Skills',
                headerShown: true,
                presentation: 'modal',
                headerLeft: () => null, // Native modals usually have a close button or we can add one
            }} />
            <SkillScreen />
        </>
    );
}
