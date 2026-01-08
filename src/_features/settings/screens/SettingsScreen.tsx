import React from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <ThemedText type="title">Settings</ThemedText>
                <ThemedText>This is a dummy settings screen.</ThemedText>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
