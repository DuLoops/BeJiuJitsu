import React from 'react';
import { StyleSheet, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';

export interface CardButtonItem {
    count: number | string;
    icon?: React.ReactNode;
    label?: string;
}

interface CardButtonProps {
    title: string;
    items: CardButtonItem[];
    onPress: () => void;
    /** Element to render as the large faded background icon */
    backgroundIcon: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function CardButton({ title, items, onPress, backgroundIcon, style }: CardButtonProps) {
    const iconColor = useThemeColor({}, 'icon');

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.container, style]}>
            <ThemedCard style={styles.card}>
                <View style={styles.header}>
                    <ThemedText type="defaultSemiBold" style={styles.title}>{title}</ThemedText>
                    <Ionicons name="chevron-forward-circle-outline" size={24} color={iconColor} style={{ opacity: 0.5 }} />
                </View>

                <View style={styles.statsContainer}>
                    {items.map((item, index) => (
                        <View key={index} style={styles.statRow}>
                            <ThemedText style={styles.count}>{item.count}</ThemedText>
                            {item.icon && <View style={styles.iconWrapper}>{item.icon}</View>}
                            {item.label && <ThemedText style={styles.label}>{item.label}</ThemedText>}
                        </View>
                    ))}
                </View>

                <View style={styles.backgroundIconWrapper}>
                    {backgroundIcon}
                </View>
            </ThemedCard>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        padding: 12,
        height: 140,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
    },
    statsContainer: {
        marginBottom: 0,
        marginTop: 'auto',
        gap: 8,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    count: {
        fontSize: 20,
    },
    iconWrapper: {
        marginLeft: 4,
        justifyContent: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
    backgroundIconWrapper: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        zIndex: -1,
    }
});
