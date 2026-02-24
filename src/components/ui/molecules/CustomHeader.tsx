import React from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomHeaderProps {
    title: string;
    leftComponent?: React.ReactNode;
    rightComponent?: React.ReactNode;
    style?: ViewStyle;
}

export function CustomHeader({ title, leftComponent, rightComponent, style }: CustomHeaderProps) {
    const backgroundColor = useThemeColor({}, 'background');

    return (
        <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor }, style]}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    {leftComponent}
                </View>
                <View style={styles.centerContainer}>
                    <ThemedText type="title" style={styles.title}>{title}</ThemedText>
                </View>
                <View style={styles.rightContainer}>
                    {rightComponent}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        // backgroundColor handled by prop
    },
    container: {
        height: 56, // Standard app bar height
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    centerContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20, // Slightly smaller than default title for header context
        textAlign: 'center',
    },
});
