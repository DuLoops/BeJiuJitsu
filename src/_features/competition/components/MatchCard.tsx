import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import VideoPlayer from '@/src/components/ui/molecules/VideoPlayer';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { MatchRecord } from '@/src/types/match';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { DivisionData } from '@/src/_features/competition/components/DivisionCard';

interface MatchCardProps {
  match: MatchRecord;
  index: number;
  onToggleExpansion: (matchId: string) => void;
  children?: React.ReactNode;
  divisions: DivisionData[];
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  index,
  onToggleExpansion,
  children,
  divisions
}) => {
  const iconColor = useThemeColor({}, 'icon');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const getOutcomeText = () => {
    const outcome = match.outcome === 'DRAW' ? 'Tie' : match.outcome.charAt(0).toUpperCase() + match.outcome.slice(1).toLowerCase();

    // Find division name
    let divisionText = '';
    if (match.divisionTempId) {
      const division = divisions.find(d => d.tempId === match.divisionTempId);
      if (division) {
        divisionText = ` - ${division.bjjType} ${division.weightType === 'open' ? 'Open' : `${division.weightClassUnderKg} ${division.weightType.replace('_', ' ')}`}`;
      }
    }

    // Method
    let methodText = '';
    if (match.outcomeMethod) {
      methodText = ` - (${match.outcomeMethod.replace('_', ' ').toLowerCase()})`;
    }

    return `${outcome}${divisionText}${methodText}`;
  };

  const renderTags = () => {
    if (match.isExpanded) return null;

    const tags = [];

    if (match.note) {
      tags.push(
        <ThemedCard key="note" style={[styles.tag, styles.noteTag]}>
          <ThemedText style={styles.tagText}>(note)</ThemedText>
        </ThemedCard>
      );
    }

    if (match.skillUsages.length > 0) {
      match.skillUsages.forEach((skill, idx) => {
        tags.push(
          <ThemedCard key={`skill-${idx}`} style={[styles.tag, styles.skillTag]}>
            <ThemedText style={styles.tagText}>('{skill.skill.name}')</ThemedText>
          </ThemedCard>
        );
      });
    }

    if (match.videoUrl) {
      tags.push(
        <ThemedCard key="video" style={[styles.tag, styles.videoTag]}>
          <ThemedText style={styles.tagText}>(video)</ThemedText>
        </ThemedCard>
      );
    }

    if (tags.length === 0) return null;

    return (
      <ThemedCard style={styles.collapsedTagsContainer}>
        {tags}
      </ThemedCard>
    );
  };

  return (
    <ThemedCard style={styles.matchContainer}>
      <ThemedCard style={styles.matchHeader}>
        <ThemedText style={styles.matchNumber}>{index + 1}.</ThemedText>
        <ThemedCard style={styles.matchResult}>
          <ThemedText style={[
            styles.resultText,
            match.outcome === 'WIN' && styles.winText,
            match.outcome === 'LOSE' && styles.loseText,
            match.outcome === 'DRAW' && styles.tieText,
          ]}>
            {getOutcomeText()}
          </ThemedText>
        </ThemedCard>

        {renderTags()}

        {/* Expand/Collapse button */}
        <TouchableOpacity onPress={() => onToggleExpansion(match.id)}>
          <Ionicons
            name={match.isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={iconColor}
          />
        </TouchableOpacity>
      </ThemedCard>

      {/* Video Player if video exists and collapsed */}
      {!match.isExpanded && match.videoUrl && (
        <ThemedCard style={styles.videoSection}>
          <VideoPlayer />
        </ThemedCard>
      )}

      {/* Expanded content */}
      {match.isExpanded && children}
    </ThemedCard>
  );
};

export default MatchCard;

const styles = {
  matchContainer: {
    // backgroundColor: '#ffffff', // Handled by ThemedCard
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
    justifyContent: 'space-between' as const, // Center tags within their container
    marginRight: 10,
    marginLeft: 10,
  },
  tag: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 4,
    marginVertical: 2, // Add vertical margin for better spacing
    backgroundColor: 'transparent',
  },
  videoTag: {
    // backgroundColor: '#28a745',
  },
  skillTag: {
    // backgroundColor: '#6c757d',
  },
  noteTag: {
    // backgroundColor: '#dc3545',
  },
  tagText: {
    // color: '#666', // Handled by ThemedText default or override
    fontSize: 12,
    marginLeft: 0,
    lineHeight: 14, // Ensure consistent line height
  },
  videoSection: {
    marginBottom: 15,
  },
}; 