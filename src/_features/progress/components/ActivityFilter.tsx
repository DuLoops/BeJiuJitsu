import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { ActivityType } from '../types/progress';
import { getActivityColor } from '@/src/constants/Colors';

interface FilterOption {
  key: 'all' | ActivityType;
  label: string;
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
  { key: 'all', label: 'All' },
  { key: 'training', label: 'Training' },
  { key: 'footage', label: 'Footage' },
  { key: 'competition', label: 'Comp' },
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
        const activityColor = getActivityColor(option.key);

        // Convert hex color to rgba with 0.1 opacity for light background
        const hexToRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        return (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterButton,
              {
                backgroundColor: isSelected ? activityColor : hexToRgba(activityColor, 0.1),
                borderColor: isSelected ? activityColor : borderColor,
              }
            ]}
            onPress={() => onFilterChange(option.key)}
            testID={`filter-${option.key}`}
          >
            <ThemedText
              style={[
                styles.filterLabel,
                { color: isSelected ? '#fff' : textColor }
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {option.label}
            </ThemedText>
            {count > 0 && (
              <ThemedView
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: isSelected ? '#fff' : activityColor,
                  }
                ]}
              >
                <ThemedText
                  style={[
                    styles.countText,
                    { color: isSelected ? activityColor : '#fff' }
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    position: 'relative',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  countBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});