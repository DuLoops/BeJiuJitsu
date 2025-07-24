import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import VideoPlayer from '@/src/components/ui/molecules/VideoPlayer';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { MatchRecord } from '@/src/types/match';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface MatchCardProps {
  match: MatchRecord;
  index: number;
  onToggleExpansion: (matchId: string) => void;
  children?: React.ReactNode;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  index,
  onToggleExpansion,
  children
}) => {
  const iconColor = useThemeColor({}, 'icon');

  const getDisplayText = (outcome: string) => {
    if (outcome === 'DRAW') return 'Tie';
    return outcome.charAt(0).toUpperCase() + outcome.slice(1).toLowerCase();
  };

  const renderTags = () => {
    if (match.isExpanded) return null;

    return (
      <ThemedView style={styles.collapsedTagsContainer}>
        {match.videoUrl && (
          <ThemedView style={[styles.tag, styles.videoTag]}>
            <Ionicons name="videocam" size={12} color="white" />
            <ThemedText style={styles.tagText}>Video</ThemedText>
          </ThemedView>
        )}
        {match.skillUsages.length > 0 && (
          <ThemedView style={[styles.tag, styles.skillTag]}>
            <Ionicons name="fitness" size={12} color="white" />
            <ThemedText style={styles.tagText}>Skills ({match.skillUsages.length})</ThemedText>
          </ThemedView>
        )}
        {match.note && (
          <ThemedView style={[styles.tag, styles.noteTag]}>
            <Ionicons name="document-text" size={12} color="white" />
            <ThemedText style={styles.tagText}>Note</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.matchContainer}>
      <ThemedView style={styles.matchHeader}>
        <ThemedText style={styles.matchNumber}>{index + 1}.</ThemedText>
        <ThemedView style={styles.matchResult}>
          <ThemedText style={[
            styles.resultText,
            match.outcome === 'WIN' && styles.winText,
            match.outcome === 'LOSE' && styles.loseText,
            match.outcome === 'DRAW' && styles.tieText,
          ]}>
            {getDisplayText(match.outcome)}
          </ThemedText>
        </ThemedView>
        
        {renderTags()}

        {/* Expand/Collapse button */}
        <TouchableOpacity onPress={() => onToggleExpansion(match.id)}>
          <Ionicons 
            name={match.isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={iconColor} 
          />
        </TouchableOpacity>
      </ThemedView>

      {/* Video Player if video exists and collapsed */}
      {!match.isExpanded && match.videoUrl && (
        <ThemedView style={styles.videoSection}>
          <VideoPlayer />
        </ThemedView>
      )}

      {/* Expanded content */}
      {match.isExpanded && children}
    </ThemedView>
  );
};

export default MatchCard;

const styles = {
  matchContainer: {
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
  matchHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
    minHeight: 40, // Ensure consistent height for proper centering
  },
  matchNumber: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginRight: 10,
  },
  matchResult: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginRight: 5,
  },
  winText: {
    color: 'green',
  },
  loseText: {
    color: 'red',
  },
  tieText: {
    color: 'gray',
  },
  collapsedTagsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    alignItems: 'center' as const, // Center tags vertically
    justifyContent: 'center' as const, // Center tags within their container
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
    marginVertical: 2, // Add vertical margin for better spacing
  },
  videoTag: {
    backgroundColor: '#28a745',
  },
  skillTag: {
    backgroundColor: '#6c757d',
  },
  noteTag: {
    backgroundColor: '#dc3545',
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4, // Reduced margin for tighter spacing
    lineHeight: 14, // Ensure consistent line height
  },
  videoSection: {
    marginBottom: 15,
  },
}; 