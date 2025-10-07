import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { ActivityType } from '../types/progress';

interface FilterOption {
  key: 'all' | ActivityType;
  label: string;
  icon: string;
}

interface ActivityFilterProps {
  selectedFilter: 'all' | ActivityType;
  onFilterChange: (filter: 'all' | ActivityType) => void;
  activityCounts?: {
    total: number;
    training: number;
    competition: number;
    footage: number;
  };
  testID?: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'All', icon: '⚡' },
  { key: 'training', label: 'Training', icon: '🥋' },
  { key: 'footage', label: 'Footage', icon: '📹' },
  { key: 'competition', label: 'Competition', icon: '🏆' },
];

export function ActivityFilter({
  selectedFilter,
  onFilterChange,
  activityCounts = { total: 0, training: 0, competition: 0, footage: 0 },
  testID = 'activity-filter'
}: ActivityFilterProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const getCount = (filterKey: string) => {
    switch (filterKey) {
      case 'all':
        return activityCounts.total;
      case 'training':
        return activityCounts.training;
      case 'competition':
        return activityCounts.competition;
      case 'footage':
        return activityCounts.footage;
      default:
        return 0;
    }
  };

  return (
    <ThemedView style={styles.container} testID={testID}>
      {FILTER_OPTIONS.map(option => {
        const isSelected = selectedFilter === option.key;
        const count = getCount(option.key);

        return (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterButton,
              {
                backgroundColor: isSelected ? tintColor : backgroundColor,
                borderColor: isSelected ? tintColor : borderColor,
              }
            ]}
            onPress={() => onFilterChange(option.key)}
            testID={`filter-${option.key}`}
          >
            <ThemedText style={styles.filterIcon}>
              {option.icon}
            </ThemedText>
            <ThemedText
              style={[
                styles.filterLabel,
                { color: isSelected ? '#fff' : textColor }
              ]}
            >
              {option.label}
            </ThemedText>
            {count > 0 && (
              <ThemedView
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : tintColor,
                  }
                ]}
              >
                <ThemedText
                  style={[
                    styles.countText,
                    { color: isSelected ? '#fff' : '#fff' }
                  ]}
                >
                  {count}
                </ThemedText>
              </ThemedView>
            )}
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    position: 'relative',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  countBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
});