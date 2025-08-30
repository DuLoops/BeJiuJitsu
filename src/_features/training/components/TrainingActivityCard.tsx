import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import VideoPlayer from '@/src/components/ui/molecules/VideoPlayer';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export interface TrainingValue {
  id: string;
  value: number;
  unit: string;
  order: number;
}

export interface TrainingActivityRecord {
  id: string;
  type: string;
  title: string | null;
  notes: string | null;
  video_url: string | null;
  activity_order: number;
  isExpanded?: boolean;
  training_values?: TrainingValue[];
}

interface TrainingActivityCardProps {
  activity: TrainingActivityRecord;
  index: number;
  onToggleExpansion: (activityId: string) => void;
  children?: React.ReactNode;
}

const TrainingActivityCard: React.FC<TrainingActivityCardProps> = ({
  activity,
  index,
  onToggleExpansion,
  children
}) => {
  const iconColor = useThemeColor({}, 'icon');

  const renderTags = () => {
    if (activity.isExpanded) return null;

    return (
      <ThemedView style={styles.collapsedTagsContainer}>
        {activity.video_url && (
          <ThemedView style={[styles.tag, styles.videoTag]}>
            <Ionicons name="videocam" size={12} color="white" />
            <ThemedText style={styles.tagText}>Video</ThemedText>
          </ThemedView>
        )}
        {activity.notes && (
          <ThemedView style={[styles.tag, styles.noteTag]}>
            <Ionicons name="document-text" size={12} color="white" />
            <ThemedText style={styles.tagText}>Note</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.activityContainer}>
      <ThemedView style={styles.activityHeader}>
        <ThemedText style={styles.activityNumber}>{index + 1}.</ThemedText>
        <ThemedView style={styles.activityInfo}>
          <ThemedText style={styles.typeText}>
            {activity.type}
          </ThemedText>
        </ThemedView>
        
        {renderTags()}

        {/* Expand/Collapse button */}
        <TouchableOpacity onPress={() => onToggleExpansion(activity.id)}>
          <Ionicons 
            name={activity.isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={iconColor} 
          />
        </TouchableOpacity>
      </ThemedView>

      {/* Video Player if video exists and collapsed */}
      {!activity.isExpanded && activity.video_url && (
        <ThemedView style={styles.videoSection}>
          <VideoPlayer />
        </ThemedView>
      )}

      {/* Expanded content */}
      {activity.isExpanded && children}
    </ThemedView>
  );
};

export default TrainingActivityCard;

const styles = {
  activityContainer: {
    backgroundColor: '#ffffff', // White background for card
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
    minHeight: 40,
  },
  activityNumber: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginRight: 10,
  },
  activityInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  typeText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginRight: 10,
  },
  collapsedTagsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginRight: 10,
    marginLeft: 10,
  },
  tag: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#007bff',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 6,
    marginVertical: 2,
  },
  videoTag: {
    backgroundColor: '#28a745',
  },
  noteTag: {
    backgroundColor: '#dc3545',
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    lineHeight: 14,
  },
  videoSection: {
    marginBottom: 15,
  },
};