import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { CalendarDay } from '../types/progress';

interface ProgressCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  activitySummary?: Record<string, { count: number; types: string[] }>;
  testID?: string;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function ProgressCalendar({
  selectedDate,
  onDateSelect,
  activitySummary = {},
  testID = 'progress-calendar'
}: ProgressCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const textColor = useThemeColor({}, 'text');

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

  const getActivityIndicator = (activities: string[]) => {
    if (activities.length === 0) return null;

    const colors = {
      training: '#4CAF50', // Green
      competition: '#FF9800', // Orange
      footage: '#2196F3', // Blue
    };

    if (activities.length === 1) {
      return (
        <View
          style={[styles.activityDot, { backgroundColor: colors[activities[0] as keyof typeof colors] }]}
        />
      );
    }

    return (
      <View style={styles.multiActivityContainer}>
        {activities.slice(0, 3).map((type, index) => (
          <View
            key={type}
            style={[
              styles.smallActivityDot,
              { backgroundColor: colors[type as keyof typeof colors] },
              { marginLeft: index > 0 ? -2 : 0 }
            ]}
          />
        ))}
      </View>
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <ThemedView style={styles.container} testID={testID}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.calendarTitle}>📅 Calendar</ThemedText>
      </ThemedView>

      <ThemedView style={styles.monthHeader}>
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
      </ThemedView>

      <ThemedView style={styles.daysHeader}>
        {DAYS_OF_WEEK.map(day => (
          <ThemedText key={day} style={styles.dayHeaderText}>
            {day}
          </ThemedText>
        ))}
      </ThemedView>

      <ThemedView style={styles.calendar}>
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
                calendarDay.isToday && styles.todayContainer,
                isSelected && styles.selectedContainer,
                !calendarDay.isCurrentMonth && styles.otherMonthContainer,
              ]}
              onPress={() => handleDayPress(calendarDay)}
              disabled={!calendarDay.isCurrentMonth}
              testID={`calendar-day-${calendarDay.day}`}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: textColor },
                  calendarDay.isToday && { color: '#fff' },
                  isSelected && { color: '#fff' },
                  !calendarDay.isCurrentMonth && styles.otherMonthText,
                ]}
              >
                {calendarDay.day}
              </Text>
              {calendarDay.hasActivity && getActivityIndicator(calendarDay.activities)}
            </TouchableOpacity>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 8,
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
  },
  dayContainer: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  todayContainer: {
    backgroundColor: '#000',
    borderRadius: 8,
  },
  selectedContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  otherMonthContainer: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  otherMonthText: {
    opacity: 0.3,
  },
  activityDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  multiActivityContainer: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallActivityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});