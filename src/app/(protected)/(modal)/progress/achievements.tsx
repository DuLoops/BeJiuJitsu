import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';

export default function AchievementsModal() {
    const backgroundColor = useThemeColor({}, 'background');

    return (
        <>
            <Stack.Screen options={{
                title: 'Achievements',
                headerShown: true,
                presentation: 'modal',
            }} />
            <View style={[styles.container, { backgroundColor }]}>
                <ThemedText type="title">Achievements</ThemedText>
                <ThemedText>This is a dummy achievements screen.</ThemedText>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
});
