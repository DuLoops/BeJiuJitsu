import React, { useRef } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  View,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { UnifiedActivityLog, TrainingActivityLog, CompetitionActivityLog, FootageActivityLog } from '../types/progress';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ActivityDetailModalProps {
  visible: boolean;
  activities: UnifiedActivityLog[];
  initialIndex?: number;
  onClose: () => void;
  testID?: string;
}

export function ActivityDetailModal({
  visible,
  activities,
  initialIndex = 0,
  onClose,
  testID = 'activity-detail-modal',
}: ActivityDetailModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const scrollViewRef = useRef<ScrollView>(null);
  const pan = useRef(new Animated.ValueXY()).current;

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');
  const cardBackgroundColor = useThemeColor({ light: '#F9FAFB', dark: '#1F2937' }, 'background');
  const primaryColor = useThemeColor({}, 'tint');

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, visible]);

  React.useEffect(() => {
    if (visible && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: currentIndex * SCREEN_WIDTH, animated: false });
    }
  }, [visible, currentIndex]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (activities.length > 1) {
          pan.setValue({ x: gestureState.dx, y: 0 });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (activities.length <= 1) return;

        if (gestureState.dx > 50 && currentIndex > 0) {
          // Swipe right - go to previous
          handlePrevious();
        } else if (gestureState.dx < -50 && currentIndex < activities.length - 1) {
          // Swipe left - go to next
          handleNext();
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handleNext = () => {
    if (currentIndex < activities.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollViewRef.current?.scrollTo({ x: newIndex * SCREEN_WIDTH, animated: true });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollViewRef.current?.scrollTo({ x: newIndex * SCREEN_WIDTH, animated: true });
    }
  };

  const currentActivity = activities[currentIndex];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'training':
        return 'barbell-outline';
      case 'competition':
        return 'trophy-outline';
      case 'footage':
        return 'videocam-outline';
      default:
        return 'document-outline';
    }
  };

  const renderTrainingDetails = (activity: TrainingActivityLog) => (
    <ThemedView style={styles.detailsContainer}>
      <ThemedView style={styles.infoRow}>
        <Ionicons name="time-outline" size={20} color={secondaryTextColor} />
        <ThemedText style={[styles.infoText, { color: textColor }]}>
          {activity.duration || 'No duration'}
        </ThemedText>
      </ThemedView>

      {activity.activities && activity.activities.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Activities</ThemedText>
          {activity.activities.map((act, index) => (
            <ThemedView
              key={index}
              style={[styles.activityItem, { backgroundColor: cardBackgroundColor, borderColor }]}
            >
              <ThemedText style={[styles.activityType, { color: textColor }]}>{act.type}</ThemedText>
              {act.duration && (
                <ThemedText style={[styles.activityDuration, { color: secondaryTextColor }]}>
                  {act.duration}
                </ThemedText>
              )}
              {act.notes && (
                <ThemedText style={[styles.activityNotes, { color: secondaryTextColor }]}>
                  {act.notes}
                </ThemedText>
              )}
            </ThemedView>
          ))}
        </ThemedView>
      )}
    </ThemedView>
  );

  const renderCompetitionDetails = (activity: CompetitionActivityLog) => (
    <ThemedView style={styles.detailsContainer}>
      {activity.location && (
        <ThemedView style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color={secondaryTextColor} />
          <ThemedText style={[styles.infoText, { color: textColor }]}>{activity.location}</ThemedText>
        </ThemedView>
      )}

      {activity.details && (
        <ThemedView style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={20} color={secondaryTextColor} />
          <ThemedText style={[styles.infoText, { color: textColor }]}>{activity.details}</ThemedText>
        </ThemedView>
      )}

      {activity.matches && activity.matches.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Matches</ThemedText>
          {activity.matches.map((match, index) => (
            <ThemedView
              key={index}
              style={[styles.matchItem, { backgroundColor: cardBackgroundColor, borderColor }]}
            >
              <ThemedView style={styles.matchHeader}>
                <ThemedText style={[styles.matchName, { color: textColor }]}>{match.name}</ThemedText>
                <ThemedView
                  style={[
                    styles.outcomeBadge,
                    {
                      backgroundColor:
                        match.outcome === 'Win'
                          ? '#10B981'
                          : match.outcome === 'Loss'
                          ? '#EF4444'
                          : '#6B7280',
                    },
                  ]}
                >
                  <ThemedText style={styles.outcomeText}>{match.outcome}</ThemedText>
                </ThemedView>
              </ThemedView>
              {match.opponent && (
                <ThemedText style={[styles.matchOpponent, { color: secondaryTextColor }]}>
                  vs {match.opponent}
                </ThemedText>
              )}
              {match.score && (
                <ThemedText style={[styles.matchScore, { color: textColor }]}>
                  Score: {match.score}
                </ThemedText>
              )}
            </ThemedView>
          ))}
        </ThemedView>
      )}

      {activity.notes && (
        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Notes</ThemedText>
          <ThemedText style={[styles.notesText, { color: secondaryTextColor }]}>{activity.notes}</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );

  const renderFootageDetails = (activity: FootageActivityLog) => (
    <ThemedView style={styles.detailsContainer}>
      {activity.skillName && (
        <ThemedView style={styles.infoRow}>
          <Ionicons name="ribbon-outline" size={20} color={secondaryTextColor} />
          <ThemedText style={[styles.infoText, { color: textColor }]}>{activity.skillName}</ThemedText>
        </ThemedView>
      )}

      {activity.source && (
        <ThemedView style={styles.infoRow}>
          <Ionicons name="link-outline" size={20} color={secondaryTextColor} />
          <ThemedText style={[styles.infoText, { color: textColor }]}>{activity.source}</ThemedText>
        </ThemedView>
      )}

      {activity.videoUrl && (
        <ThemedView style={styles.infoRow}>
          <Ionicons name="videocam-outline" size={20} color={secondaryTextColor} />
          <ThemedText style={[styles.infoText, { color: primaryColor }]} numberOfLines={1}>
            {activity.videoUrl}
          </ThemedText>
        </ThemedView>
      )}

      {activity.notes && (
        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Notes</ThemedText>
          <ThemedText style={[styles.notesText, { color: secondaryTextColor }]}>{activity.notes}</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );

  if (!currentActivity) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      testID={testID}
    >
      <ThemedView style={[styles.modalContainer, { backgroundColor }]}>
        {/* Header */}
        <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
          <ThemedView style={styles.headerContent}>
            {activities.length > 1 && (
              <TouchableOpacity
                onPress={handlePrevious}
                disabled={currentIndex === 0}
                style={styles.navButton}
                testID="previous-activity-button"
              >
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color={currentIndex === 0 ? borderColor : primaryColor}
                />
              </TouchableOpacity>
            )}

            <ThemedView style={styles.headerTitleContainer}>
              <ThemedView style={styles.iconTitleRow}>
                <Ionicons
                  name={getActivityIcon(currentActivity.type) as any}
                  size={24}
                  color={primaryColor}
                />
                <ThemedText style={[styles.headerTitle, { color: textColor }]}>
                  {currentActivity.title}
                </ThemedText>
              </ThemedView>
              {activities.length > 1 && (
                <ThemedText style={[styles.pageIndicator, { color: secondaryTextColor }]}>
                  {currentIndex + 1} of {activities.length}
                </ThemedText>
              )}
            </ThemedView>

            {activities.length > 1 && (
              <TouchableOpacity
                onPress={handleNext}
                disabled={currentIndex === activities.length - 1}
                style={styles.navButton}
                testID="next-activity-button"
              >
                <Ionicons
                  name="chevron-forward"
                  size={28}
                  color={currentIndex === activities.length - 1 ? borderColor : primaryColor}
                />
              </TouchableOpacity>
            )}
          </ThemedView>

          <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="close-modal-button">
            <Ionicons name="close" size={28} color={textColor} />
          </TouchableOpacity>
        </ThemedView>

        {/* Swipable Content */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={styles.scrollView}
        >
          {activities.map((activity, index) => (
            <Animated.View
              key={activity.id}
              style={[
                styles.contentContainer,
                {
                  width: SCREEN_WIDTH,
                  transform: index === currentIndex ? [{ translateX: pan.x }] : [],
                },
              ]}
              {...(index === currentIndex && activities.length > 1 ? panResponder.panHandlers : {})}
            >
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Date */}
                <ThemedView style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={20} color={secondaryTextColor} />
                  <ThemedText style={[styles.dateText, { color: secondaryTextColor }]}>
                    {formatDate(activity.date)}
                  </ThemedText>
                </ThemedView>

                {/* Type-specific details */}
                {activity.type === 'training' && renderTrainingDetails(activity as TrainingActivityLog)}
                {activity.type === 'competition' && renderCompetitionDetails(activity as CompetitionActivityLog)}
                {activity.type === 'footage' && renderFootageDetails(activity as FootageActivityLog)}
              </ScrollView>
            </Animated.View>
          ))}
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  pageIndicator: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  navButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailsContainer: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  activityItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityDuration: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  matchItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  outcomeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  outcomeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  matchOpponent: {
    fontSize: 14,
    fontWeight: '500',
  },
  matchScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
