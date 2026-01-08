import React, { useState, useMemo } from 'react';
import { StyleSheet, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { ProgressCalendar } from '../components/ProgressCalendar';
import { ActivityFilter } from '../components/ActivityFilter';
import { ActivityList } from '../components/ActivityList';
import { ActivityDetailModal } from '../components/ActivityDetailModal';
import { SkillStatsCard } from '../components/SkillStatsCard';
import { AchievementStatsCard } from '../components/AchievementStatsCard';
import { useProgressData, useActivityCounts } from '../hooks/useProgressData';
import { ActivityType, UnifiedActivityLog } from '../types/progress';
import { useAuthStore } from '@/src/stores/authStore';
import { useRouter } from 'expo-router';
import { CustomHeader } from '@/src/components/ui/molecules/CustomHeader';
import { Avatar } from '@/src/components/ui/atoms/Avatar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFetchCurrentUserProfile } from '../../profile/hooks/useProfileQueries';

import { fetchUserSkills } from '@/src/_features/skill/services/skillService';
import { useFetchGoals } from '@/src/_features/profile/hooks/useGoals';

interface ProgressScreenProps {
  testID?: string;
}

export function ProgressScreen({ testID = 'progress-screen' }: ProgressScreenProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFilter, setSelectedFilter] = useState<'all' | ActivityType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [displayCount, setDisplayCount] = useState(10); // Pagination: show 10 at a time
  const [modalVisible, setModalVisible] = useState(false);
  const [modalActivities, setModalActivities] = useState<UnifiedActivityLog[]>([]);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);
  const textColor = useThemeColor({}, 'text');

  const secondaryTextColor = useThemeColor({}, 'icon');
  const router = useRouter();
  const { data: profile } = useFetchCurrentUserProfile();
  const iconColor = useThemeColor({}, 'icon');


  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  // Fetch all activities (no date filtering - will paginate on client side)
  const {
    data: activities = [],
    error,
    refetch
  } = useProgressData();

  const activityCounts = useActivityCounts(activities);

  // Fetch User Skills Count
  const { data: userSkills = [] } = useQuery({
    queryKey: ['user-skills', userId],
    queryFn: () => userId ? fetchUserSkills(userId) : Promise.resolve([]),
    enabled: !!userId,
  });

  // Fetch Goals
  const { data: goals = [] } = useFetchGoals(userId);

  // Calculate Achievement Stats
  const achievementStats = useMemo(() => {
    const completedGoals = goals.filter(g => g.completed).length;

    // Calculate Medals (Wins in competitions)
    const medalsCount = activities
      .filter(a => a.type === 'competition')
      .reduce((count, activity) => {
        // Check matches for wins if details exist, otherwise just count the competition as an event
        const compActivity = activity as UnifiedActivityLog & { matches?: any[] };
        if (compActivity.matches) {
          return count + compActivity.matches.filter((m: any) => m.outcome === 'WIN' || m.outcome === 'Win').length;
        }
        return count;
      }, 0);

    const practicesCount = activities.filter(a => a.type === 'training').length;

    return {
      completedGoals,
      medalsCount,
      practicesCount
    };
  }, [goals, activities]);

  // Auto-refetch when tab gains focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
      // Invalidate calendar summary to ensure it stays fresh
      queryClient.invalidateQueries({ queryKey: ['activity-summary'] });
      queryClient.invalidateQueries({ queryKey: ['user-skills'] });
    }, [refetch, queryClient])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ['activity-summary'] }),
        queryClient.invalidateQueries({ queryKey: ['user-skills'] }),
        queryClient.invalidateQueries({ queryKey: ['goals'] })
      ]);
      setDisplayCount(10); // Reset pagination on refresh
    } finally {
      setRefreshing(false);
    }
  };

  // Paginate activities: show only displayCount items
  const paginatedActivities = useMemo(() => {
    return activities.slice(0, displayCount);
  }, [activities, displayCount]);

  // Filter count based on selected filter
  const filteredCount = useMemo(() => {
    if (selectedFilter === 'all') return activities.length;
    return activities.filter(a => a.type === selectedFilter).length;
  }, [activities, selectedFilter]);

  const paginatedFilteredCount = useMemo(() => {
    if (selectedFilter === 'all') return paginatedActivities.length;
    return paginatedActivities.filter(a => a.type === selectedFilter).length;
  }, [paginatedActivities, selectedFilter]);

  // Load more handler
  const handleLoadMore = () => {
    if (displayCount < activities.length) {
      setDisplayCount(prev => prev + 10);
    }
  };

  // Render loading indicator at bottom when there are more items
  const renderFooter = () => {
    // Check if we've loaded all items considering the current filter
    if (paginatedFilteredCount >= filteredCount) return null;

    return (
      <ThemedCard style={styles.footerLoader}>
        <ActivityIndicator size="small" color={secondaryTextColor} />
        <ThemedText style={[styles.footerText, { color: secondaryTextColor }]}>
          Loading more...
        </ThemedText>
      </ThemedCard>
    );
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);

    // Get activities for the selected date
    const dateString = date.toISOString().split('T')[0];
    const activitiesOnDate = activities.filter(activity => {
      const activityDate = activity.date.split('T')[0];
      return activityDate === dateString;
    });

    if (activitiesOnDate.length > 0) {
      setModalActivities(activitiesOnDate);
      setModalInitialIndex(0);
      setModalVisible(true);
    }
  };

  const handleActivityPress = (activity: UnifiedActivityLog) => {
    setModalActivities([activity]);
    setModalInitialIndex(0);
    setModalVisible(true);
  };

  if (error) {
    return (
      <ThemedCard style={styles.container}>
        <ThemedCard style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            Error loading progress data
          </ThemedText>
          <ThemedText style={styles.errorSubtext}>
            Please try again later
          </ThemedText>
        </ThemedCard>
      </ThemedCard>
    );
  }

  const renderListHeader = () => (
    <>
      {/* Stats Section */}
      <View style={styles.statsRow}>
        <SkillStatsCard skillCount={userSkills.length} />
        <AchievementStatsCard
          completedGoalsCount={achievementStats.completedGoals}
          medalsCount={achievementStats.medalsCount}
          practicesCount={achievementStats.practicesCount}
        />
      </View>

      {/* Calendar Section */}
      <ProgressCalendar
        userId={userId}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        testID="progress-calendar"
      />

      {/* Recent Activity Header with Filter */}
      <View style={styles.recentActivityHeader}>
        <View style={styles.headerTitleRow}>
          <ThemedText type="subtitle" style={[styles.recentActivityTitle, { color: textColor }]}>
            Log
          </ThemedText>
          <ThemedText style={[styles.recentActivityCount, { color: secondaryTextColor }]}>
            {filteredCount}
          </ThemedText>
        </View>

        <ActivityFilter
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          activityCounts={activityCounts}
          testID="activity-filter"
        />
      </View>
    </>
  );

  const handleProfilePress = () => {
    if (profile?.id) {
      router.push(`/(protected)/profile/${profile.id}`);
    }
  };

  const handleSettingsPress = () => {
    router.push('/(protected)/settings');
  };

  return (
    <View style={styles.container} testID={testID}>
      <CustomHeader
        title="Progress"
        leftComponent={
          <Avatar
            source={profile?.avatar}
            size={32}
            onPress={handleProfilePress}
          />
        }
        rightComponent={
          <TouchableOpacity onPress={handleSettingsPress}>
            <Ionicons name="settings-outline" size={24} color={iconColor} />
          </TouchableOpacity>
        }
      />
      {/* Activity List */}
      <ActivityList
        activities={paginatedActivities}
        filter={selectedFilter}
        onActivityPress={handleActivityPress}
        onEndReached={handleLoadMore}
        ListHeaderComponent={renderListHeader()}
        ListFooterComponent={renderFooter()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        testID="activity-list"
      />

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        visible={modalVisible}
        activities={modalActivities}
        initialIndex={modalInitialIndex}
        onClose={() => setModalVisible(false)}
        testID="activity-detail-modal"
      />
    </View>
  );
}

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingVertical: 4
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 0, // Removed padding to match calendar
    marginBottom: 8,
    marginTop: 8,
    gap: 0,
  },
  recentActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0, // Removed padding to match general alignment
    marginTop: 16,
    marginBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  recentActivityCount: {
    fontSize: 14,
    fontWeight: '500',
  },
});