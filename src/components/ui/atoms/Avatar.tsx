import React from 'react';
import { Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@/src/hooks/useThemeColor';

interface AvatarProps {
    source?: string | null;
    size?: number;
    onPress?: () => void;
    style?: ViewStyle;
}

export function Avatar({ source, size = 40, onPress, style }: AvatarProps) {
    const iconColor = useThemeColor({}, 'icon');
    const backgroundColor = useThemeColor({}, 'background');

    const content = source ? (
        <Image
            source={{ uri: source }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
        />
    ) : (
        <Ionicons name="person-circle-outline" size={size} color={iconColor} />
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
                {content}
            </TouchableOpacity>
        );
    }

    return <TouchableOpacity style={[styles.container, style]} disabled>{content}</TouchableOpacity>;
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
