import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import DropdownPicker, { DropdownPickerRef } from '@/src/components/ui/molecules/DropdownPicker';
import VideoPlayer from '@/src/components/ui/molecules/VideoPlayer';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Enums } from '@/src/supabase/types';
import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
import SkillFormModal from '@/src/_features/skill/screens/SkillFormModal';
import React, { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { TrainingActivityRecord, TrainingValue } from './TrainingActivityCard';

type TrainingType = Enums<'TrainingType'>;
type TrainingUnit = Enums<'TrainingUnit'>;

// Available training types from the database
const TrainingTypesArray: TrainingType[] = [
  'Gi',
  'NoGi',
  'Wrestling',
  'Roll',
  'Drill',
  'Skill Learning',
  'Game',
  'Strength training',
  'Cardio training',
  'Stretching'
];

// Available training units from the database
const TrainingUnitsArray: TrainingUnit[] = [
  'Minutes',
  'Hours',
  'Rounds',
  'Reps',
  'Submissions'
];


interface TrainingActivityFormProps {
  activity: TrainingActivityRecord;
  onUpdateActivity: (activityId: string, updates: Partial<TrainingActivityRecord>) => void;
  onAddVideo: (activityId: string) => void;
  onDeleteActivity: (activityId: string) => void;
  autoOpenType?: boolean;
}

const TrainingActivityForm: React.FC<TrainingActivityFormProps> = ({
  activity,
  onUpdateActivity,
  onAddVideo,
  onDeleteActivity,
  autoOpenType = false,
}) => {
  const iconColor = useThemeColor({}, 'icon');
  const inputBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const [showSkillModal, setShowSkillModal] = useState(false);

  // Training values state - initialize from activity or empty array
  const [trainingValues, setTrainingValues] = useState<TrainingValue[]>(
    activity.training_values || []
  );

  // Refs for dropdowns and inputs
  const dropdownRefs = useRef<{ [key: string]: DropdownPickerRef | null }>({});
  const typeDropdownRef = useRef<DropdownPickerRef | null>(null);
  const valueInputRefs = useRef<{ [key: string]: TextInput | null }>({});

  const trainingTypeOptions = TrainingTypesArray.map(type => ({
    label: type,
    value: type,
  }));

  const unitOptions = TrainingUnitsArray.map(unit => ({
    label: unit,
    value: unit,
  }));

  // Auto open type dropdown when requested
  React.useEffect(() => {
    if (autoOpenType) {
      const timer = setTimeout(() => {
        typeDropdownRef.current?.open?.();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [autoOpenType]);

  const addTrainingValue = () => {
    const newValueId = `value_${Date.now()}`;
    const newValue: TrainingValue = {
      id: newValueId,
      value: 0,
      unit: 'Minutes',
      order: trainingValues.length + 1
    };
    const updatedValues = [...trainingValues, newValue];
    setTrainingValues(updatedValues);
    onUpdateActivity(activity.id, { training_values: updatedValues });

    // Open the dropdown for the new value after a short delay
    setTimeout(() => {
      if (dropdownRefs.current[newValueId]) {
        dropdownRefs.current[newValueId]?.open();
      }
    }, 100);
  };

  const removeTrainingValue = (valueId: string) => {
    const updatedValues = trainingValues.filter(v => v.id !== valueId);
    setTrainingValues(updatedValues);
    onUpdateActivity(activity.id, { training_values: updatedValues });
  };

  const updateTrainingValue = (valueId: string, updates: Partial<TrainingValue>) => {
    const updatedValues = trainingValues.map(v =>
      v.id === valueId ? { ...v, ...updates } : v
    );
    setTrainingValues(updatedValues);
    onUpdateActivity(activity.id, { training_values: updatedValues });
  };

  const handleAddSkill = () => {
    setShowSkillModal(true);
  };

  return (
    <View style={styles.activityDetails}>
      {/* Video Player if video exists */}
      {activity.video_url && (
        <View style={styles.videoSection}>
          <VideoPlayer />
        </View>
      )}

      {/* Training Type Selection */}
      <View style={styles.formRow}>
        <ThemedText style={styles.fieldLabel}>Training Type</ThemedText>
        <DropdownPicker
          ref={(ref) => { typeDropdownRef.current = ref; }}
          options={trainingTypeOptions}
          selectedValue={activity.type}
          onValueChange={(value) => {
            onUpdateActivity(activity.id, { type: value as TrainingType });
            typeDropdownRef.current?.close();
          }}
          placeholder="Select training type"
          style={styles.dropdown}
        />
      </View>

      {/* Training Records Section */}
      <View style={styles.formRow}>
        <ThemedText style={styles.fieldLabel}>Training Records</ThemedText>

        {trainingValues.map((trainingValue) => (
          <View key={trainingValue.id} style={styles.valueRow}>
            <View style={styles.valueInput}>
              <TextInput
                ref={(ref) => { valueInputRefs.current[trainingValue.id] = ref; }}
                style={[styles.textInput, { backgroundColor: inputBackground, color: textColor, borderColor }]}
                value={trainingValue.value.toString()}
                onChangeText={(text) => updateTrainingValue(trainingValue.id, { value: parseInt(text) || 0 })}
                placeholderTextColor={textColor}
                keyboardType="numeric"
                maxLength={4}
                testID={`training-value-input-${trainingValue.id}`}
              />
            </View>
            <View style={styles.unitInput}>
              <DropdownPicker
                ref={(ref) => { dropdownRefs.current[trainingValue.id] = ref; }}
                options={unitOptions}
                selectedValue={trainingValue.unit}
                onValueChange={(value) => {
                  updateTrainingValue(trainingValue.id, { unit: value as TrainingUnit });
                  // Close the unit dropdown and focus back on the value input
                  dropdownRefs.current[trainingValue.id]?.close?.();
                  setTimeout(() => {
                    valueInputRefs.current[trainingValue.id]?.focus?.();
                  }, 50);
                }}
                placeholder="Unit"
                style={styles.dropdown}

              />
            </View>
            <ThemedButton
              title=""
              onPress={() => removeTrainingValue(trainingValue.id)}
              style={styles.removeValueButton}
              icon={<Ionicons name="trash-bin-outline" size={16} color="white" />}
            />
          </View>
        ))}

        <ThemedButton
          title="Add Record"
          onPress={addTrainingValue}
          style={styles.addValueButton}
          icon={<Ionicons name="add" size={16} color={iconColor} />}
          testID="add-record-button"
        />
      </View>

      {/* Notes (Always Visible) */}
      <View style={styles.formRow}>
        <ThemedText style={styles.fieldLabel}>Notes</ThemedText>
        <TextInput
          style={[styles.noteInput, { backgroundColor: inputBackground, color: textColor, borderColor }]}
          value={activity.notes || ''}
          onChangeText={(text) => onUpdateActivity(activity.id, { notes: text })}
          placeholder="Add notes about this activity..."
          placeholderTextColor={textColor}
          multiline
          numberOfLines={3}
          testID="training-notes-input"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <ThemedButton
          title="Skill"
          onPress={handleAddSkill}
          icon={<Ionicons name="fitness" size={16} color={iconColor} />}
          style={styles.actionButton}
        />
        <ThemedButton
          title="Video"
          onPress={() => onAddVideo(activity.id)}
          icon={<Ionicons name="videocam" size={16} color={iconColor} />}
          style={styles.actionButton}
        />
      </View>

      {/* Bottom buttons - Delete only */}
      <View style={styles.bottomButtons}>
        <ThemedButton
          title="Delete Activity"
          onPress={() => onDeleteActivity(activity.id)}
          style={styles.deleteButton}
          icon={<Ionicons name="trash-bin-outline" size={16} color="white" />}
        />
      </View>

      {/* Skill Modal */}
      <SkillFormModal
        visible={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        source={'TRAINING'}
        trainingActivityId={activity.id}
      />
    </View>
  );
};

export default TrainingActivityForm;

const styles = {
  activityDetails: {
    marginVertical: 12,
  },
  videoSection: {
    marginBottom: 15,
  },
  formRow: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  dropdown: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
  },
  addValueButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 10,
    alignSelf: 'stretch' as const,
  },
  valueRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    marginBottom: 10,
  },
  valueInput: {
    flex: 1,
  },
  unitInput: {
    flex: 1.5,
  },
  removeValueButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 8,
    paddingVertical: 8,
    minWidth: 40,
  },
  noteInput: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    minHeight: 80,
    textAlignVertical: 'top' as const,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginTop: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007bff',
  },
  bottomButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    flex: 0.5,
  },
};