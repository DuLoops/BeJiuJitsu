import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
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
import SkillFormModal from '@/src/_features/skill/screens/SkillFormModal';
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
  const inputBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
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
    <ThemedCard style={styles.matchDetails}>
      {/* Video Player if video exists */}
      {match.videoUrl && (
        <ThemedCard style={styles.videoSection}>
          <VideoPlayer />
        </ThemedCard>
      )}

      {/* Division Selection (replaces BJJ type) */}
      {divisions.length > 1 && (
        <ThemedCard style={styles.formRow}>
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
        </ThemedCard>
      )}

      {/* Win/Tie/Lose Selection */}
      <ThemedCard style={styles.formRow}>
        <ThemedText style={styles.fieldLabel}>Outcome</ThemedText>
        <DropdownPicker
          ref={(ref) => { outcomeDropdownRef.current = ref; }}
          options={outcomeOptions}
          selectedValue={match.outcome}
          onValueChange={(value) => onUpdateMatch(match.id, { outcome: value as any })}
          placeholder="Select outcome"
          style={styles.dropdown}
          testID="match-outcome-dropdown"
        />
      </ThemedCard>

      {/* Method Dropdown */}
      <ThemedCard style={styles.formRow}>
        <ThemedText style={styles.fieldLabel}>Method</ThemedText>
        <DropdownPicker
          options={methodOptions}
          selectedValue={match.outcomeMethod ?? ''}
          onValueChange={(value) => onUpdateMatch(match.id, { outcomeMethod: value as any })}
          placeholder="Select method"
          style={styles.dropdown}
          testID="match-method-dropdown"
        />
      </ThemedCard>



      {/* Add Scores Button */}
      <ThemedCard style={styles.formRow}>
        <ThemedButton
          title={showScores ? "Remove Scores" : "Add Scores"}
          onPress={() => setShowScores(!showScores)}
          style={styles.scoresToggleButton}
          icon={<Ionicons name={showScores ? "chevron-up" : "chevron-down"} size={16} color={iconColor} />}
          testID="toggle-scores-button"
        />
      </ThemedCard>

      {/* Collapsible Score inputs */}
      {showScores && (
        <ThemedCard style={styles.scoreRow}>
          <ThemedCard style={styles.scoreInput}>
            <ThemedText style={styles.scoreLabel}>My Score</ThemedText>
            <TextInput
              style={[styles.scoreField, { backgroundColor: inputBackground, color: textColor, borderColor }]}
              value={match.myScore?.toString() || ''}
              onChangeText={(text) => onUpdateMatch(match.id, { myScore: parseInt(text) || 0 })}
              placeholder="0"
              placeholderTextColor={textColor}
              keyboardType="numeric"
              maxLength={2}
              testID="my-score-input"
            />
          </ThemedCard>
          <ThemedCard style={styles.scoreInput}>
            <ThemedText style={styles.scoreLabel}>Opponent Score</ThemedText>
            <TextInput
              style={[styles.scoreField, { backgroundColor: inputBackground, color: textColor, borderColor }]}
              value={match.opponentScore?.toString() || ''}
              onChangeText={(text) => onUpdateMatch(match.id, { opponentScore: parseInt(text) || 0 })}
              placeholder="0"
              placeholderTextColor={textColor}
              keyboardType="numeric"
              maxLength={2}
              testID="opponent-score-input"
            />
          </ThemedCard>
        </ThemedCard>
      )}

      {/* Action Buttons */}
      <ThemedCard style={styles.actionButtons}>
        <ThemedButton
          title="Note"
          onPress={() => {
            // Toggle note input
            onUpdateMatch(match.id, { note: match.note ? null : '' });
          }}
          icon={<Ionicons name="document-text" size={16} color={iconColor} />}
          style={styles.actionButton}
          testID="toggle-note-button"
        />
        <ThemedButton
          title="Skill"
          onPress={() => handleAddSkill(match.id)}
          icon={<Ionicons name="fitness" size={16} color={iconColor} />}
          style={styles.actionButton}
        />
        <ThemedButton
          title="Video"
          onPress={() => onAddVideo(match.id)}
          icon={<Ionicons name="videocam" size={16} color={iconColor} />}
          style={styles.actionButton}
        />
      </ThemedCard>

      {/* Note Input */}
      {match.note !== null && (
        <TextInput
          style={[styles.noteInput, { backgroundColor: inputBackground, color: textColor, borderColor }]}
          value={match.note}
          onChangeText={(text) => onUpdateMatch(match.id, { note: text })}
          placeholder="Add your note here..."
          placeholderTextColor={textColor}
          multiline
          testID="match-note-input"
        />
      )}

      {/* Bottom buttons - Delete only */}
      <ThemedCard style={styles.bottomButtons}>
        <ThemedButton
          title="Delete"
          onPress={() => onDeleteMatch(match.id)}
          style={styles.deleteButton}
          icon={<Ionicons name="trash-bin-outline" size={16} color="white" />}
        />
      </ThemedCard>

      {/* Skill Modal */}
      <SkillFormModal
        visible={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        source={'COMPETITION'}
        matchId={match.id}
      />
    </ThemedCard>
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
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
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
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    textAlign: 'center' as const,
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  noteInput: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
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
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
  },
}; 