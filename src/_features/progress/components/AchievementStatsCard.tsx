import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';

interface AchievementStatsCardProps {
    completedGoalsCount: number;
    medalsCount: number;
    practicesCount: number;
}

export function AchievementStatsCard({
    completedGoalsCount,
    medalsCount,
    practicesCount
}: AchievementStatsCardProps) {
    const router = useRouter();
    const iconColor = useThemeColor({}, 'icon');

    // Logic: Max 2 items.
    // Priority: Completed Goals -> Medals -> Practices
    const items = [];

    if (completedGoalsCount > 0) {
        items.push({
            icon: 'flag-outline' as const,
            count: completedGoalsCount,
            label: 'Goals'
        });
    }

    // If we have room, add medals
    if (items.length < 2) {
        items.push({
            icon: 'medal-outline' as const,
            count: medalsCount,
            label: 'Medals'
        });
    }

    // If we still have room, add practices
    if (items.length < 2) {
        items.push({
            icon: 'barbell-outline' as const,
            count: practicesCount,
            label: 'Practices'
        });
    }

    const handlePress = () => {
        router.push('/(protected)/(modal)/progress/achievements');
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.container}>
            <ThemedCard style={styles.card}>
                <View style={styles.header}>
                    <ThemedText type="defaultSemiBold" style={styles.title}>Achievements</ThemedText>
                    <Ionicons name="chevron-forward-circle-outline" size={24} color={iconColor} style={{ opacity: 0.5 }} />
                </View>

                <View style={styles.statsContainer}>
                    {items.map((item, index) => (
                        <View key={index} style={styles.statRow}>
                            {/* Removed inline Item Icon */}
                            <ThemedText style={styles.statText}>
                                <ThemedText style={styles.count}>{item.count}</ThemedText> {item.label}
                            </ThemedText>
                        </View>
                    ))}
                </View>

                <View style={styles.backgroundIcon}>
                    <Ionicons name="trophy" size={120} color={iconColor} style={{ opacity: 0.05 }} />
                </View>
            </ThemedCard>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 8,
    },
    card: {
        padding: 12, // Reduced padding
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
        marginBottom: 12,
        marginTop: 'auto',
        gap: 4,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    statText: {
        fontSize: 14,
        fontWeight: '500',
    },
    count: {
        fontSize: 18, // Slightly smaller than single main stat but still bold
        fontWeight: 'bold',
    },
    backgroundIcon: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        zIndex: -1,
    }
});
