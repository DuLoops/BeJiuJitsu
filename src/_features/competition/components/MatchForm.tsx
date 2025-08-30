import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import DropdownPicker, { DropdownPickerRef } from '@/src/components/ui/molecules/DropdownPicker';
import VideoPlayer from '@/src/components/ui/molecules/VideoPlayer';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import {
  BjjTypesArray,
  MatchOutcomeArray,
  MatchOutcomeMethodArray,
} from '@/src/supabase/constants';
import { MatchRecord } from '@/src/types/match';
import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
import SkillFormModal from '@/src/_features/skill/components/SkillFormModal';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

interface MatchFormProps {
  match: MatchRecord;
  onUpdateMatch: (matchId: string, updates: Partial<MatchRecord>) => void;
  onAddVideo: (matchId: string) => void;
  onDeleteMatch: (matchId: string) => void;
  divisions?: Array<{ tempId: string; bjjType: 'GI' | 'NOGI' | 'BOTH'; weightType: 'kg_under' | 'lbs_under' | 'open'; weightClassUnderKg?: number | null; ageCategory?: string | null; overallResultInDivision?: number | null }>;
  autoOpenOutcome?: boolean;
}

const MatchForm: React.FC<MatchFormProps> = ({
  match,
  onUpdateMatch,
  onAddVideo,
  onDeleteMatch,
  divisions = [],
  autoOpenOutcome = false,
}) => {
  const iconColor = useThemeColor({}, 'icon');
  const [showScores, setShowScores] = useState(false);
  const outcomeDropdownRef = React.useRef<DropdownPickerRef | null>(null);
  const [showSkillModal, setShowSkillModal] = useState(false);

  const bjjTypeOptions = BjjTypesArray.filter(type => type !== 'BOTH').map(type => ({
    label: type === 'GI' ? 'Gi' : 'NoGi',
    value: type,
  }));

  const outcomeOptions = MatchOutcomeArray.map(outcome => ({
    label: outcome === 'DRAW' ? 'Tie' : (outcome as string).charAt(0) + (outcome as string).slice(1).toLowerCase(),
    value: outcome,
  }));

  const methodOptions = MatchOutcomeMethodArray.map(method => ({
    label: (method as string).replace('_', ' '),
    value: method,
  }));

  const handleAddSkill = (matchId: string) => {
    setShowSkillModal(true);
  };

  React.useEffect(() => {
    if (autoOpenOutcome) {
      const timer = setTimeout(() => outcomeDropdownRef.current?.open?.(), 150);
      return () => clearTimeout(timer);
    }
  }, [autoOpenOutcome]);

  return (
    <ThemedView style={styles.matchDetails}>
      {/* Video Player if video exists */}
      {match.videoUrl && (
        <ThemedView style={styles.videoSection}>
          <VideoPlayer />
        </ThemedView>
      )}

      {/* Division Selection (replaces BJJ type) */}
      {divisions.length > 1 && (
        <ThemedView style={styles.formRow}>
          <ThemedText style={styles.fieldLabel}>Division</ThemedText>
          <DropdownPicker
            options={divisions.map(d => ({ 
              label: `${d.bjjType} - ${d.weightType === 'open' ? 'Open' : `${d.weightClassUnderKg} ${d.weightType.replace('_', ' ')}`}`, 
              value: d.tempId 
            }))}
            selectedValue={match.divisionTempId || ''}
            onValueChange={(value) => onUpdateMatch(match.id, { divisionTempId: value })}
            placeholder="Select division"
            style={styles.dropdown}
          />
        </ThemedView>
      )}

      {/* Win/Tie/Lose Selection */}
      <ThemedView style={styles.formRow}>
        <ThemedText style={styles.fieldLabel}>Outcome</ThemedText>
        <DropdownPicker
          ref={(ref) => { outcomeDropdownRef.current = ref; }}
          options={outcomeOptions}
          selectedValue={match.outcome}
          onValueChange={(value) => onUpdateMatch(match.id, { outcome: value as any })}
          placeholder="Select outcome"
          style={styles.dropdown}
        />
      </ThemedView>

      {/* Method Dropdown */}
      <ThemedView style={styles.formRow}>
        <ThemedText style={styles.fieldLabel}>Method</ThemedText>
        <DropdownPicker
          options={methodOptions}
          selectedValue={match.outcomeMethod ?? ''}
          onValueChange={(value) => onUpdateMatch(match.id, { outcomeMethod: value as any })}
          placeholder="Select method"
          style={styles.dropdown}
        />
      </ThemedView>



      {/* Add Scores Button */}
      <ThemedView style={styles.formRow}>
        <ThemedButton
          title={showScores ? "Remove Scores" : "Add Scores"}
          onPress={() => setShowScores(!showScores)}
          style={styles.scoresToggleButton}
          icon={<Ionicons name={showScores ? "chevron-up" : "chevron-down"} size={16} color={iconColor} />}
        />
      </ThemedView>

      {/* Collapsible Score inputs */}
      {showScores && (
        <ThemedView style={styles.scoreRow}>
          <ThemedView style={styles.scoreInput}>
            <ThemedText style={styles.scoreLabel}>My Score</ThemedText>
            <TextInput
              style={styles.scoreField}
              value={match.myScore?.toString() || ''}
              onChangeText={(text) => onUpdateMatch(match.id, { myScore: parseInt(text) || 0 })}
              placeholder="0"
              keyboardType="numeric"
              maxLength={2}
            />
          </ThemedView>
          <ThemedView style={styles.scoreInput}>
            <ThemedText style={styles.scoreLabel}>Opponent Score</ThemedText>
            <TextInput
              style={styles.scoreField}
              value={match.opponentScore?.toString() || ''}
              onChangeText={(text) => onUpdateMatch(match.id, { opponentScore: parseInt(text) || 0 })}
              placeholder="0"
              keyboardType="numeric"
              maxLength={2}
            />
          </ThemedView>
        </ThemedView>
      )}

      {/* Action Buttons */}
      <ThemedView style={styles.actionButtons}>
        <ThemedButton
          title="Video"
          onPress={() => onAddVideo(match.id)}
          icon={<Ionicons name="videocam" size={16} color={iconColor} />}
          style={styles.actionButton}
        />
        <ThemedButton
          title="Skill"
          onPress={() => handleAddSkill(match.id)}
          icon={<Ionicons name="fitness" size={16} color={iconColor} />}
          style={styles.actionButton}
        />
        <ThemedButton
          title="Note"
          onPress={() => {
            // Toggle note input
            onUpdateMatch(match.id, { note: match.note ? null : '' });
          }}
          icon={<Ionicons name="document-text" size={16} color={iconColor} />}
          style={styles.actionButton}
        />
      </ThemedView>

      {/* Note Input */}
      {match.note !== null && (
        <TextInput
          style={styles.noteInput}
          value={match.note}
          onChangeText={(text) => onUpdateMatch(match.id, { note: text })}
          placeholder="Add your note here..."
          multiline
        />
      )}

      {/* Bottom buttons - Delete only */}
      <ThemedView style={styles.bottomButtons}>
        <ThemedButton
          title="Delete"
          onPress={() => onDeleteMatch(match.id)}
          style={styles.deleteButton}
          icon={<Ionicons name="trash-bin-outline" size={16} color="white" />}
        />
      </ThemedView>

      {/* Skill Modal */}
      <SkillFormModal
        visible={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        source={'COMPETITION'}
        matchId={match.id}
      />
    </ThemedView>
  );
};

export default MatchForm;

const styles = {
  matchDetails: {
    marginTop: 15,
  },
  videoSection: {
    marginBottom: 15,
  },
  formRow: {
    marginBottom: 15,
  },
  formRowHorizontal: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 15,
  },
  inlineLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    flex: 0.3,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  scoreRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    gap: 15,
    marginBottom: 15,
  },
  scoreInput: {
    flex: 1,
  },
  scoreField: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center' as const,
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  noteInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 80,
    textAlignVertical: 'top' as const,
    marginTop: 15,
  },
  scoresToggleButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginTop: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  bottomButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginTop: 20,
    gap: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
}; 