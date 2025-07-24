import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import DropdownPicker from '@/src/components/ui/molecules/DropdownPicker';
import RadioGroup from '@/src/components/ui/molecules/RadioGroup';
import VideoPlayer from '@/src/components/ui/molecules/VideoPlayer';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import {
  BjjTypesArray,
  MatchMethodTypesArray,
  MatchOutcomeTypesArray,
} from '@/src/supabase/constants';
import { MatchRecord } from '@/src/types/match';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TextInput } from 'react-native';

interface MatchFormProps {
  match: MatchRecord;
  onUpdateMatch: (matchId: string, updates: Partial<MatchRecord>) => void;
  onAddVideo: (matchId: string) => void;
  onSaveMatch: (matchId: string) => void;
  onDeleteMatch: (matchId: string) => void;
}

const MatchForm: React.FC<MatchFormProps> = ({
  match,
  onUpdateMatch,
  onAddVideo,
  onSaveMatch,
  onDeleteMatch,
}) => {
  const iconColor = useThemeColor({}, 'icon');

  const bjjTypeOptions = BjjTypesArray.filter(type => type !== 'BOTH').map(type => ({
    label: type === 'GI' ? 'Gi' : 'Nogi',
    value: type,
  }));

  const outcomeOptions = MatchOutcomeTypesArray.map(outcome => ({
    label: outcome === 'DRAW' ? 'Tie' : (outcome as string).charAt(0) + (outcome as string).slice(1).toLowerCase(),
    value: outcome,
  }));

  const methodOptions = MatchMethodTypesArray.map(method => ({
    label: (method as string).replace('_', ' '),
    value: method,
  }));

  const handleAddSkill = (matchId: string) => {
    router.push({
      pathname: '/(protected)/(modal)/create/skill',
      params: { source: 'COMPETITION', matchId }
    });
  };

  return (
    <ThemedView style={styles.matchDetails}>
      {/* Video Player if video exists */}
      {match.videoUrl && (
        <ThemedView style={styles.videoSection}>
          <VideoPlayer />
        </ThemedView>
      )}

      {/* Gi/Nogi Selection */}
      <ThemedView style={styles.formRow}>
        <RadioGroup
          options={bjjTypeOptions}
          values={[match.bjjType]}
          onSelect={(values) => onUpdateMatch(match.id, { bjjType: values[0] || 'GI' })}
          multiple={false}
        />
      </ThemedView>

      {/* Win/Tie/Lose Selection */}
      <ThemedView style={styles.formRow}>
        <RadioGroup
          options={outcomeOptions}
          values={[match.outcome]}
          onSelect={(values) => onUpdateMatch(match.id, { outcome: values[0] || 'WIN' })}
          multiple={false}
        />
      </ThemedView>

      {/* Method Dropdown */}
      <ThemedView style={styles.formRow}>
        <ThemedText style={styles.fieldLabel}>Method</ThemedText>
        <DropdownPicker
          options={methodOptions}
          selectedValue={match.method}
          onValueChange={(value) => onUpdateMatch(match.id, { method: value })}
          placeholder="Select method"
          style={styles.dropdown}
        />
      </ThemedView>

      {/* Score inputs for POINTS method */}
      {match.method === 'POINTS' && (
        <ThemedView style={styles.scoreRow}>
          <ThemedView style={styles.scoreInput}>
            <ThemedText style={styles.fieldLabel}>My Score</ThemedText>
            <TextInput
              style={styles.scoreField}
              value={match.myScore?.toString() || ''}
              onChangeText={(text) => onUpdateMatch(match.id, { 
                myScore: text ? parseInt(text) : undefined 
              })}
              keyboardType="numeric"
              placeholder="0"
            />
          </ThemedView>
          <ThemedView style={styles.scoreInput}>
            <ThemedText style={styles.fieldLabel}>Opponent Score</ThemedText>
            <TextInput
              style={styles.scoreField}
              value={match.opponentScore?.toString() || ''}
              onChangeText={(text) => onUpdateMatch(match.id, { 
                opponentScore: text ? parseInt(text) : undefined 
              })}
              keyboardType="numeric"
              placeholder="0"
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

      {/* Bottom buttons - Save and Delete */}
      <ThemedView style={styles.bottomButtons}>
        <ThemedButton
          title="Save"
          onPress={() => onSaveMatch(match.id)}
          style={styles.saveButton}
        />
        <ThemedButton
          title="Delete"
          onPress={() => onDeleteMatch(match.id)}
          style={styles.deleteButton}
          icon={<Ionicons name="trash-bin-outline" size={16} color="white" />}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default MatchForm;

const styles = {
  matchDetails: {
    marginTop: 10,
  },
  videoSection: {
    marginBottom: 15,
  },
  formRow: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    marginTop: 5,
  },
  scoreRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: 10,
  },
  scoreInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  scoreField: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
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
  bottomButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#28a745',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc3545',
  },
}; 