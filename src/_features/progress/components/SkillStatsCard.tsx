import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons, Foundation } from '@expo/vector-icons';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';

interface SkillStatsCardProps {
    skillCount: number;
}

export function SkillStatsCard({ skillCount }: SkillStatsCardProps) {
    const router = useRouter();
    const iconColor = useThemeColor({}, 'icon');
    const textColor = useThemeColor({}, 'text');

    const handlePress = () => {
        router.push('/(protected)/(modal)/progress/skills');
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.container}>
            <ThemedCard style={styles.card}>
                <View style={styles.header}>
                    <ThemedText type="defaultSemiBold" style={styles.title}>Skill</ThemedText>
                    <Ionicons name="chevron-forward-circle-outline" size={24} color={iconColor} style={{ opacity: 0.5 }} />
                </View>

                <View style={styles.content}>
                    <ThemedText style={styles.statsText}>
                        <ThemedText style={styles.count}>{skillCount}</ThemedText> skills
                    </ThemedText>
                </View>

                <View style={styles.backgroundIcon}>
                    <Foundation name="trees" size={120} color={iconColor} style={{ opacity: 0.05 }} />
                </View>
            </ThemedCard>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginRight: 8,
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
    content: {
        marginBottom: 12,
        marginTop: 'auto',
    },
    statsText: {
        fontSize: 14,
        fontWeight: '500',
    },
    count: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    backgroundIcon: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        zIndex: -1,
    }
});
