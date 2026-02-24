import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { UnifiedActivityLog, ActivityType } from '../types/progress';
import { getActivityColor, getMedalColor } from '@/src/constants/Colors';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import { Ionicons } from '@expo/vector-icons';

interface ActivityListProps {
  activities: UnifiedActivityLog[];
  filter: 'all' | ActivityType;
  onActivityPress?: (activity: UnifiedActivityLog) => void;
  onEndReached?: () => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
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

  // ...

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'training':
        return <Ionicons name="barbell" size={24} color="white" />;
      case 'competition':
        return <Ionicons name="trophy" size={24} color="white" />;
      case 'footage':
        return <Ionicons name="videocam" size={24} color="white" />;
      default:
        return <Ionicons name="document-text" size={24} color="white" />;
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
        if (activity.activities && activity.activities.length > 0) {
          return (
            <View style={{ marginTop: 4 }}>
              {activity.activities.map((act, index) => (
                <ThemedText key={index} style={[styles.detailText, { color: secondaryTextColor, fontSize: 13 }]}>
                  • {act.type} {act.duration ? `(${act.duration})` : ''}
                </ThemedText>
              ))}
            </View>
          );
        } else if (activity.duration) {
          return (
            <ThemedText style={[styles.detailText, { color: secondaryTextColor }]}>
              {activity.duration}
              {activity.details && ` • ${activity.details}`}
            </ThemedText>
          );
        }
        break;
      case 'competition':
        if (activity.divisions && activity.divisions.length > 0) {
          return (
            <View style={{ marginTop: 4, gap: 4 }}>
              {activity.divisions.map((div, index) => (
                <View key={index} style={styles.divisionRow}>
                  <View style={styles.divisionHeader}>
                    {div.divisionName !== 'All Matches' && (
                      <ThemedText style={[styles.divisionName, { color: textColor }]}>
                        {div.divisionName}
                      </ThemedText>
                    )}
                    {div.rank && (
                      <View style={[styles.medalBadge, { backgroundColor: getMedalColor(div.rank) }]}>
                        <ThemedText style={styles.medalText}>
                          {div.rank === 1 ? 'GOLD' : div.rank === 2 ? 'SILVER' : 'BRONZE'}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText style={[styles.statsText, { color: secondaryTextColor }]}>
                    {div.wins}W - {div.losses}L - {div.ties}D
                  </ThemedText>
                </View>
              ))}
            </View>
          );
        } else if (activity.location || activity.details) {
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
      <ThemedCard style={styles.activityContent}>
        <View style={styles.leftContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getActivityColor(activity.type) }
            ]}
          >
            {getActivityIcon(activity.type)}
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
      </ThemedCard>
    </TouchableOpacity>
  );
};

export function ActivityList({
  activities,
  filter,
  onActivityPress,
  onEndReached,
  ListHeaderComponent,
  ListFooterComponent,
  refreshing,
  onRefresh,
  testID = 'activity-list'
}: ActivityListProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const renderInternalHeader = () => (
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

  const combinedHeader = () => (
    <>
      {ListHeaderComponent}
    </>
  );

  return (
    <FlatList
      data={filteredActivities}
      renderItem={({ item }) => (
        <ActivityItem activity={item} onPress={onActivityPress} />
      )}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={combinedHeader()}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={ListFooterComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.listContent}
      style={{ backgroundColor }}
      testID={testID}
    />
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
    marginBottom: 8,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  divisionRow: {
    marginBottom: 4,
  },
  divisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
    gap: 6,
  },
  divisionName: {
    fontSize: 14,
    fontWeight: '600',
  },
  medalBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  statsText: {
    fontSize: 13,
    fontWeight: '500',
  },
});