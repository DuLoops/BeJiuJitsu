import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { UserSkillWithDetails } from '@/src/features/skill/components/UserSkillList';
import {
  createTrainingSessionWithSkillUsages,
  fetchUserSkillsForSelection,
} from '@/src/features/training/services/trainingService';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/store/authStore';
import {
  BjjTypeEnum,
  BjjTypesArray,
  TrainingIntensitiesArray,
  TrainingIntensityEnum
} from '@/src/supabase/constants';
import { TablesInsert } from '@/src/supabase/types';
import { Training } from '@/src/types/training';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

// Define the shape of the form data for skill usage within this component
interface ExtendedUserSkillUsageFormData {
  userSkillId: string;    // This is UserSkill.id
  skill_id: string;       // This is Skill.id (base skill id, for display/logic if needed)
  userSkillName: string;  
  quantity: string;       
  success: boolean;
}

export default function CreateTrainingScreen() {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const successColor = useThemeColor({}, 'tint');

  // Form State - Training Details
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [duration, setDuration] = useState('');
  const [bjjType, setBjjType] = useState<BjjTypeEnum>(BjjTypesArray[0]);
  const [intensity, setIntensity] = useState<TrainingIntensityEnum>(TrainingIntensitiesArray[1]);
  const [note, setNote] = useState('');

  // Form State - Skill Usages
  const [selectedSkillsUsage, setSelectedSkillsUsage] = useState<ExtendedUserSkillUsageFormData[]>([]);

  // Fetch User Skills for selection
  const { data: userSkills, isLoading: isLoadingUserSkills } = useQuery<UserSkillWithDetails[], Error>({
    queryKey: ['userSkillsForSelection', userId],
    queryFn: () => fetchUserSkillsForSelection(userId!),
    enabled: !!userId,
  });

  // Mutation for creating Training session and UserSkillUsages
  const mutation = useMutation({
    mutationFn: (data: { 
        trainingData: Omit<Training, 'id' | 'created_at' | 'updatedAt'>, 
        skillUsagesData: Omit<TablesInsert<'UserSkillUsage'>, 'id' | 'trainingId'>[] 
    }) => createTrainingSessionWithSkillUsages(data),
    onSuccess: () => {
      Alert.alert('Success', 'Training session logged!');
      queryClient.invalidateQueries({ queryKey: ['trainingsForUser', userId] });
      queryClient.invalidateQueries({ queryKey: ['userSkillsWithDetails', userId]});
      router.back();
    },
    onError: (error: Error) => {
      Alert.alert('Error', `Failed to log training: ${error.message}`);
    },
  });

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleToggleSkillUsage = (skill: UserSkillWithDetails) => {
    setSelectedSkillsUsage(prev => {
      const existing = prev.find(s => s.userSkillId === skill.id);
      if (existing) {
        return prev.filter(s => s.userSkillId !== skill.id);
      } else {
        return [...prev, { 
          userSkillId: skill.id, // This is UserSkill.id
          skill_id: skill.skill.id, // This is Skill.id
          userSkillName: skill.skill.name, 
          quantity: '1', 
          success: true 
        }];
      }
    });
  };

  const handleSkillUsageChange = (userSkillId: string, field: keyof ExtendedUserSkillUsageFormData, value: string | boolean) => {
    setSelectedSkillsUsage(prev =>
      prev.map(s => (s.userSkillId === userSkillId ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }
    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid duration.');
        return;
    }

    const trainingDataPayload = {
      userId: userId!, 
      date: date.toISOString().split('T')[0],
      duration: Number(duration),
      bjjType: bjjType,
      intensity: intensity,
      note: note || null,
      id: '',
      createdAt: undefined as string | undefined,
      updatedAt: undefined as string | undefined,
    } as Training;

    const skillUsagesPayload: Omit<TablesInsert<'UserSkillUsage'>, 'id' | 'trainingId'>[] = selectedSkillsUsage.map(s => ({
      skillId: s.userSkillId, // UserSkillUsage.skillId is FK to UserSkill.id
      quantity: Number(s.quantity) || 0,
      success: s.success,
      usageType: 'TRAINING', // Direct string value for the enum type
      note: null,
      competitionId: null,
      matchId: null,
      // createdAt, updatedAt are optional in TablesInsert<'UserSkillUsage'>
    }));

    mutation.mutate({ trainingData: trainingDataPayload, skillUsagesData: skillUsagesPayload });
  };
  
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <ThemedView style={styles.innerContainer}>
        <ThemedText style={styles.title}>Log Training Session</ThemedText>

        {/* Date Picker */}
        <ThemedText style={styles.label}>Date:</ThemedText>
        {Platform.OS !== 'ios' && (
            <ThemedButton onPress={() => setShowDatePicker(true)} title={`Selected: ${date.toLocaleDateString()}`} />
        )}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        )}

        <ThemedInput
          label="Duration (minutes):"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="e.g., 90"
          style={styles.input}
        />

        <ThemedText style={styles.label}>Type:</ThemedText>
        <Picker
          selectedValue={bjjType}
          onValueChange={(itemValue) => setBjjType(itemValue)}
          style={styles.picker}
        >
          {BjjTypesArray.map(type => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>

        <ThemedText style={styles.label}>Intensity:</ThemedText>
        <Picker
          selectedValue={intensity}
          onValueChange={(itemValue) => setIntensity(itemValue)}
          style={styles.picker}
        >
          {TrainingIntensitiesArray.map(level => (
            <Picker.Item key={level} label={level} value={level} />
          ))}
        </Picker>

        <ThemedInput
          label="Notes (Optional):"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
          placeholder="General notes about the session..."
          style={[styles.input, styles.textArea]}
        />

        <ThemedText style={styles.sectionTitle}>Skills Practiced/Used</ThemedText>
        {isLoadingUserSkills ? (
          <ActivityIndicator />
        ) : userSkills && userSkills.length > 0 ? (
          userSkills.map(skill => {
            const currentSkillUsage = selectedSkillsUsage.find(s => s.userSkillId === skill.id);
            const isSkillSelected = !!currentSkillUsage;
            return (
              <ThemedView key={skill.id} style={styles.skillUsageContainer}>
                <TouchableOpacity 
                  style={styles.skillToggle}
                  onPress={() => handleToggleSkillUsage(skill)}
                >
                  <Ionicons 
                      name={isSkillSelected ? 'checkbox-outline' : 'square-outline'} 
                      size={24} 
                      color={isSkillSelected ? successColor : iconColor} 
                  />
                  <ThemedText style={styles.skillNameText}>{skill.skill.name} ({skill.skill.category.name})</ThemedText>
                </TouchableOpacity>
                {isSkillSelected && currentSkillUsage && (
                  <ThemedView style={styles.skillUsageInputs}>
                    <ThemedInput
                      label="Quantity/Reps:"
                      value={currentSkillUsage.quantity || '1'}
                      onChangeText={text => handleSkillUsageChange(skill.id, 'quantity', text)}
                      keyboardType="numeric"
                      style={styles.smallInput}
                    />
                    <ThemedView style={styles.switchRow}>
                      <ThemedText style={styles.label}>Successful?</ThemedText>
                      <Switch
                        value={currentSkillUsage.success || false}
                        onValueChange={val => handleSkillUsageChange(skill.id, 'success', val)}
                        trackColor={{ false: "#767577", true: tintColor }}
                        thumbColor={currentSkillUsage.success ? tintColor : "#f4f3f4"}
                      />
                    </ThemedView>
                  </ThemedView>
                )}
              </ThemedView>
            );
          })
        ) : (
          <ThemedText>You haven't added any skills yet. Add skills first to track their usage.</ThemedText>
        )}

        <ThemedButton
          title={mutation.isPending ? 'Logging Training...' : 'Log Training'}
          onPress={handleSubmit}
          disabled={mutation.isPending || isLoadingUserSkills}
          style={styles.button}
        />
        {Platform.OS === 'ios' && <ThemedButton title="Close Modal" onPress={() => router.back()} style={styles.button} />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    marginBottom: 15,
  },
  smallInput: {
    marginBottom: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  picker: {
    marginBottom: 15,
    height: Platform.OS === 'ios' ? 180 : 50,
    backgroundColor: '#f0f0f0',
  },
  button: {
    marginTop: 20,
  },
  skillUsageContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  skillToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillNameText: {
    fontSize: 16,
    marginLeft: 10,
    flexShrink: 1,
  },
  skillUsageInputs: {
    paddingLeft: 30,
    gap: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
});
