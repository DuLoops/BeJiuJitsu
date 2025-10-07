import React, { useState } from 'react';
import { ScrollView, RefreshControl, StyleSheet } from 'react-native';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import ThemedText  from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { ProgressCalendar } from '../components/ProgressCalendar';
import { ActivityFilter } from '../components/ActivityFilter';
import { ActivityList } from '../components/ActivityList';
import { useProgressData, useActivitySummary, useActivityCounts } from '../hooks/useProgressData';
import { ActivityType, UnifiedActivityLog } from '../types/progress';

interface ProgressScreenProps {
  testID?: string;
}

export function ProgressScreen({ testID = 'progress-screen' }: ProgressScreenProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFilter, setSelectedFilter] = useState<'all' | ActivityType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');

  // Calculate date range for recent activities (last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const {
    data: activities = [],
    error,
    refetch
  } = useProgressData(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  const {
    data: activitySummary = {},
    refetch: refetchSummary
  } = useActivitySummary(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1
  );

  const activityCounts = useActivityCounts(activities);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch(), refetchSummary()]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Could potentially filter activities by selected date here
  };

  const handleActivityPress = (activity: UnifiedActivityLog) => {
    // TODO: Navigate to activity detail screen
    console.log('Activity pressed:', activity);
  };

  if (error) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={[styles.errorText, { color: textColor }]}>
            Error loading progress data
          </ThemedText>
          <ThemedText style={[styles.errorSubtext, { color: secondaryTextColor }]}>
            Please try again later
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]} testID={testID}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText style={[styles.title, { color: textColor }]}>
            Progress
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: secondaryTextColor }]}>
            Track your Jiu-Jitsu journey
          </ThemedText>
        </ThemedView>

        {/* Calendar */}
        <ProgressCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          activitySummary={activitySummary}
          testID="progress-calendar"
        />

        {/* Activity Filter */}
        <ActivityFilter
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          activityCounts={activityCounts}
          testID="activity-filter"
        />

        {/* Activity List */}
        <ActivityList
          activities={activities}
          filter={selectedFilter}
          onActivityPress={handleActivityPress}
          testID="activity-list"
        />
      </ScrollView>
    </ThemedView>
  );
}

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
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
});