import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useUIStore } from '@/src/store/uiStore';
import { CalendarDay, ActivityType } from '../types/progress';
import { getActivityColor } from '@/src/constants/Colors';
import { useActivitySummary } from '../hooks/useProgressData';
import { getActivitySummaryByDate } from '../services/progressService';

interface ProgressCalendarProps {
  userId?: string;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  testID?: string;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function ProgressCalendar({
  userId,
  selectedDate,
  onDateSelect,
  testID = 'progress-calendar'
}: ProgressCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const { isCalendarCollapsed, toggleCalendarCollapsed } = useUIStore();

  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');

  const queryClient = useQueryClient();

  // Data fetching
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { data: activitySummary = {} } = useActivitySummary(currentYear, currentMonth);

  // Prefetch adjacent months
  const prefetchAdjacentMonths = useCallback((year: number, month: number) => {
    if (!userId) return;

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    queryClient.prefetchQuery({
      queryKey: ['activity-summary', userId, prevYear, prevMonth],
      queryFn: () => getActivitySummaryByDate(userId, prevYear, prevMonth),
      staleTime: 10 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: ['activity-summary', userId, nextYear, nextMonth],
      queryFn: () => getActivitySummaryByDate(userId, nextYear, nextMonth),
      staleTime: 10 * 60 * 1000,
    });
  }, [userId, queryClient]);

  useEffect(() => {
    prefetchAdjacentMonths(currentYear, currentMonth);
  }, [currentYear, currentMonth, prefetchAdjacentMonths]);

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    // First day of the month and how many days in the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();

    const days: CalendarDay[] = [];

    // Add previous month's trailing days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(year, month - 1, day);
      const dateKey = date.toISOString().split('T')[0];
      const activity = activitySummary[dateKey];

      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        hasActivity: !!activity,
        activities: activity?.types || [],
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      const activity = activitySummary[dateKey];
      const isToday = date.toDateString() === today.toDateString();

      days.push({
        day,
        isCurrentMonth: true,
        isToday,
        hasActivity: !!activity,
        activities: activity?.types || [],
      });
    }

    // Add next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateKey = date.toISOString().split('T')[0];
      const activity = activitySummary[dateKey];

      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        hasActivity: !!activity,
        activities: activity?.types || [],
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDayPress = (calendarDay: CalendarDay) => {
    if (!calendarDay.isCurrentMonth) return;

    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      calendarDay.day
    );
    onDateSelect?.(selectedDate);
  };

  const getActivityIndicator = (activities: ActivityType[], day: number, isToday: boolean, isSelected: boolean) => {
    if (activities.length === 0) return null;

    // Order: Training (innermost), Video (middle), Competition (outermost)
    const activityOrder: ActivityType[] = ['training', 'video', 'competition'];
    const sortedActivities = [...new Set(activities)].sort((a, b) =>
      activityOrder.indexOf(a) - activityOrder.indexOf(b)
    );

    // Single activity
    if (sortedActivities.length === 1) {
      const activityColor = getActivityColor(sortedActivities[0]);
      return (
        <View style={[styles.activityIndicator, { backgroundColor: activityColor }]}>
          <Text style={styles.activityDayText}>
            {day}
          </Text>
        </View>
      );
    }

    // Two activities: inner and outer ring
    if (sortedActivities.length === 2) {
      const innerColor = getActivityColor(sortedActivities[0]);
      const outerColor = getActivityColor(sortedActivities[1]);
      return (
        <View style={[styles.activityIndicatorOuter, { backgroundColor: outerColor }]}>
          <View style={[styles.activityIndicatorInner, { backgroundColor: innerColor }]}>
            <Text style={styles.activityDayText}>
              {day}
            </Text>
          </View>
        </View>
      );
    }

    // Three activities: three rings
    const innerColor = getActivityColor(sortedActivities[0]);
    const middleColor = getActivityColor(sortedActivities[1]);
    const outerColor = getActivityColor(sortedActivities[2]);
    return (
      <View style={[styles.activityIndicatorOuter, { backgroundColor: outerColor }]}>
        <View style={[styles.activityIndicatorMiddle, { backgroundColor: middleColor }]}>
          <View style={[styles.activityIndicatorInner, { backgroundColor: innerColor }]}>
            <Text style={styles.activityDayText}>
              {day}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const shadowColor = useThemeColor({}, 'shadow');
  const cardBackgroundColor = useThemeColor({}, 'card');

  const calendarDays = generateCalendarDays();

  return (
    <ThemedCard
      style={[
        styles.container,
        {
          borderColor: borderColor,
          shadowColor: shadowColor,
        }
      ]}
      testID={testID}
    >
      <TouchableOpacity
        onPress={toggleCalendarCollapsed}
        style={styles.header}
        testID="calendar-toggle-button"
        activeOpacity={0.7}
      >
        <ThemedText style={[styles.headerText, { color: textColor }]}>
          Calendar
        </ThemedText>
        <Ionicons
          name={isCalendarCollapsed ? 'chevron-down' : 'chevron-up'}
          size={24}
          color={secondaryTextColor}
        />
      </TouchableOpacity>

      {!isCalendarCollapsed && (
        <View style={styles.content}>
          <View style={[styles.monthHeader]}>
            <TouchableOpacity
              onPress={() => navigateMonth('prev')}
              style={styles.monthButton}
              testID="calendar-prev-month"
            >
              <Ionicons name="chevron-back" size={20} color={textColor} />
            </TouchableOpacity>

            <ThemedText style={styles.monthTitle}>
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </ThemedText>

            <TouchableOpacity
              onPress={() => navigateMonth('next')}
              style={styles.monthButton}
              testID="calendar-next-month"
            >
              <Ionicons name="chevron-forward" size={20} color={textColor} />
            </TouchableOpacity>
          </View>

          <View style={[styles.daysHeader]}>
            {DAYS_OF_WEEK.map(day => (
              <ThemedText key={day} style={styles.dayHeaderText}>
                {day}
              </ThemedText>
            ))}
          </View>

          <View style={[styles.calendar]}>
            {calendarDays.map((calendarDay, index) => {
              const isSelected = selectedDate &&
                selectedDate.getDate() === calendarDay.day &&
                selectedDate.getMonth() === currentDate.getMonth() &&
                selectedDate.getFullYear() === currentDate.getFullYear() &&
                calendarDay.isCurrentMonth;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayContainer,
                    ,
                    calendarDay.isToday && [styles.todayContainer, { borderColor: textColor }],
                    isSelected && styles.selectedContainer,
                    !calendarDay.isCurrentMonth && styles.otherMonthContainer,
                  ]}
                  onPress={() => handleDayPress(calendarDay)}
                  disabled={!calendarDay.isCurrentMonth}
                  testID={`calendar-day-${calendarDay.day}`}
                >
                  {calendarDay.hasActivity ? (
                    getActivityIndicator(calendarDay.activities, calendarDay.day, calendarDay.isToday, !!isSelected)
                  ) : (
                    <Text
                      style={[
                        styles.dayText,
                        { color: textColor },
                        isSelected && { color: '#fff' },
                        !calendarDay.isCurrentMonth && styles.otherMonthText,
                      ]}
                    >
                      {calendarDay.day}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0, // Removed margin to align with other elements
    marginVertical: 16,
    borderRadius: 2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',

  },
  content: {
    marginTop: 6,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  daysHeader: {
    flexDirection: 'row',
  },
  dayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 1,
  },
  dayContainer: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  todayContainer: {
    borderWidth: 2,
    borderRadius: 2,
  },
  selectedContainer: {
    backgroundColor: '#B73225', // Vermilion Stamp
    borderRadius: 2,
  },
  otherMonthContainer: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 16,
    margin: 'auto'
  },
  otherMonthText: {
    opacity: 0.3,
  },
  activityIndicator: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicatorOuter: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicatorMiddle: {
    width: '85%',
    aspectRatio: 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicatorInner: {
    width: '70%',
    aspectRatio: 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});