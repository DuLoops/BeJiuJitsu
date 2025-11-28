import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import ThemedText  from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { ProgressCalendar } from '../components/ProgressCalendar';
import { ActivityFilter } from '../components/ActivityFilter';
import { ActivityList } from '../components/ActivityList';
import { ActivityDetailModal } from '../components/ActivityDetailModal';
import { useProgressData, useActivitySummary, useActivityCounts } from '../hooks/useProgressData';
import { ActivityType, UnifiedActivityLog } from '../types/progress';
import { useAuthStore } from '@/src/stores/authStore';
import { getActivitySummaryByDate } from '../services/progressService';

interface ProgressScreenProps {
  testID?: string;
}

export function ProgressScreen({ testID = 'progress-screen' }: ProgressScreenProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFilter, setSelectedFilter] = useState<'all' | ActivityType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [displayCount, setDisplayCount] = useState(10); // Pagination: show 10 at a time
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalActivities, setModalActivities] = useState<UnifiedActivityLog[]>([]);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');
  const cardBackgroundColor = useThemeColor({ light: '#F9FAFB', dark: '#1F2937' }, 'background');

  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  // Fetch all activities (no date filtering - will paginate on client side)
  const {
    data: activities = [],
    error,
    refetch
  } = useProgressData();

  const {
    data: activitySummary = {},
    refetch: refetchSummary
  } = useActivitySummary(currentYear, currentMonth);

  const activityCounts = useActivityCounts(activities);

  // Prefetch adjacent months for smoother navigation
  const prefetchAdjacentMonths = useCallback((year: number, month: number) => {
    if (!userId) return;

    // Calculate prev month
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    // Calculate next month
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    // Prefetch prev month
    queryClient.prefetchQuery({
      queryKey: ['activity-summary', userId, prevYear, prevMonth],
      queryFn: () => getActivitySummaryByDate(userId, prevYear, prevMonth),
      staleTime: 10 * 60 * 1000,
    });

    // Prefetch next month
    queryClient.prefetchQuery({
      queryKey: ['activity-summary', userId, nextYear, nextMonth],
      queryFn: () => getActivitySummaryByDate(userId, nextYear, nextMonth),
      staleTime: 10 * 60 * 1000,
    });
  }, [userId, queryClient]);

  // Handle month change from calendar
  const handleMonthChange = useCallback((year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    prefetchAdjacentMonths(year, month);
  }, [prefetchAdjacentMonths]);

  // Auto-refetch when tab gains focus (e.g., after creating training/competition)
  useFocusEffect(
    React.useCallback(() => {
      refetch();
      refetchSummary();
      prefetchAdjacentMonths(currentYear, currentMonth);
    }, [refetch, refetchSummary, prefetchAdjacentMonths, currentYear, currentMonth])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch(), refetchSummary()]);
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
      <ThemedView style={styles.footerLoader}>
        <ActivityIndicator size="small" color={secondaryTextColor} />
        <ThemedText style={[styles.footerText, { color: secondaryTextColor }]}>
          Loading more...
        </ThemedText>
      </ThemedView>
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

  const renderListHeader = () => (
    <>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          Progress
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: secondaryTextColor }]}>
          Track your Jiu-Jitsu journey
        </ThemedText>
      </ThemedView>

      {/* Calendar Section with Collapse Toggle */}
      <ThemedView
        style={[
          styles.calendarSection,
          {
            backgroundColor: cardBackgroundColor,
            borderColor: borderColor,
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => setIsCalendarCollapsed(!isCalendarCollapsed)}
          style={styles.calendarHeader}
          testID="calendar-toggle-button"
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.calendarHeaderText, { color: textColor }]}>
            Calendar
          </ThemedText>
          <Ionicons
            name={isCalendarCollapsed ? 'chevron-down' : 'chevron-up'}
            size={24}
            color={secondaryTextColor}
          />
        </TouchableOpacity>

        {!isCalendarCollapsed && (
          <ProgressCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            activitySummary={activitySummary}
            onMonthChange={handleMonthChange}
            testID="progress-calendar"
          />
        )}
      </ThemedView>

      {/* Activity Filter */}
      <ActivityFilter
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        activityCounts={activityCounts}
        testID="activity-filter"
      />
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} testID={testID} edges={['top']}>
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
    </SafeAreaView>
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
    paddingTop:10
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
  calendarSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',

  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  calendarHeaderText: {
    fontSize: 18,
    fontWeight: '600',
  },
});