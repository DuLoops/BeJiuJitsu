import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { UnifiedActivityLog, ActivityType } from '../types/progress';

interface ActivityListProps {
  activities: UnifiedActivityLog[];
  filter: 'all' | ActivityType;
  onActivityPress?: (activity: UnifiedActivityLog) => void;
  testID?: string;
}

interface ActivityItemProps {
  activity: UnifiedActivityLog;
  onPress?: (activity: UnifiedActivityLog) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onPress }) => {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'training':
        return '🥋';
      case 'competition':
        return '🏆';
      case 'footage':
        return '📹';
      default:
        return '📝';
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'training':
        return '#4CAF50';
      case 'competition':
        return '#FF9800';
      case 'footage':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const renderDetails = () => {
    switch (activity.type) {
      case 'training':
        if (activity.duration) {
          return (
            <ThemedText style={[styles.detailText, { color: secondaryTextColor }]}>
              {activity.duration}
              {activity.details && ` • ${activity.details}`}
            </ThemedText>
          );
        }
        break;
      case 'competition':
        if (activity.location || activity.details) {
          return (
            <ThemedText style={[styles.detailText, { color: secondaryTextColor }]}>
              {activity.location || activity.details}
            </ThemedText>
          );
        }
        break;
      case 'footage':
        if (activity.source) {
          return (
            <ThemedText style={[styles.detailText, { color: secondaryTextColor }]}>
              {activity.source}
            </ThemedText>
          );
        }
        break;
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={[styles.activityItem, { backgroundColor, borderColor }]}
      onPress={() => onPress?.(activity)}
      testID={`activity-item-${activity.id}`}
    >
      <View style={styles.activityContent}>
        <View style={styles.leftContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getActivityColor(activity.type) }
            ]}
          >
            <ThemedText style={styles.iconText}>
              {getActivityIcon(activity.type)}
            </ThemedText>
          </View>
          <View style={styles.textContent}>
            <ThemedText style={[styles.titleText, { color: textColor }]} numberOfLines={1}>
              {activity.title}
            </ThemedText>
            {renderDetails()}
          </View>
        </View>
        <View style={styles.rightContent}>
          <ThemedText style={[styles.dateText, { color: secondaryTextColor }]}>
            {formatDate(activity.date)}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export function ActivityList({ activities, filter, onActivityPress, testID = 'activity-list' }: ActivityListProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedText style={[styles.headerTitle, { color: textColor }]}>
        Recent Activity
      </ThemedText>
      <ThemedText style={[styles.headerCount, { color: secondaryTextColor }]}>
        {filteredActivities.length} record{filteredActivities.length !== 1 ? 's' : ''}
      </ThemedText>
    </ThemedView>
  );

  const renderEmpty = () => (
    <ThemedView style={styles.emptyContainer}>
      <ThemedText style={[styles.emptyText, { color: secondaryTextColor }]}>
        {filter === 'all'
          ? 'No activities recorded yet'
          : `No ${filter} activities recorded yet`
        }
      </ThemedText>
      <ThemedText style={[styles.emptySubtext, { color: secondaryTextColor }]}>
        Start tracking your Jiu-Jitsu journey!
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]} testID={testID}>
      {renderHeader()}
      <FlatList
        data={filteredActivities}
        renderItem={({ item }) => (
          <ActivityItem activity={item} onPress={onActivityPress} />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  activityItem: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    overflow: 'hidden',
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
  },
  textContent: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
  },
});