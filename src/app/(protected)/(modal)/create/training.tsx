import React, { useState, useContext } from 'react';
import { View, ScrollView, Alert, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/src/context/AuthContext';
import {
  fetchUserSkillsForSelection,
  createTrainingSessionWithSkillUsages,
} from '@/src/features/training/services/trainingService';
import { Training, UserSkillUsageFormData } from '@/src/types/training';
import { UserSkillWithDetails } from '@/src/features/skill/components/UserSkillList';
import { BjjType, TrainingIntensity, Constants } from '@/src/supabase/types'; // Get enums from Supabase types
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { Picker } from '@react-native-picker/picker';
import { Switch } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';

export default function CreateTrainingScreen() {
  const auth = useContext(AuthContext);
  const queryClient = useQueryClient();
  const userId = auth?.session?.user?.id;

  // Form State - Training Details
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios'); // Show by default on iOS
  const [duration, setDuration] = useState(''); // in minutes
  const [bjjType, setBjjType] = useState<BjjType>(Constants.public.Enums.BjjType[0]);
  const [intensity, setIntensity] = useState<TrainingIntensity>(Constants.public.Enums.TrainingIntensity[1]); // Default to Medium
  const [note, setNote] = useState('');

  // Form State - Skill Usages
  const [selectedSkillsUsage, setSelectedSkillsUsage] = useState<UserSkillUsageFormData[]>([]);

  // Fetch User Skills for selection
  const { data: userSkills, isLoading: isLoadingUserSkills } = useQuery<UserSkillWithDetails[], Error>({
    queryKey: ['userSkillsForSelection', userId],
    queryKeyHash: `userSkillsForSelection-${userId}`,
    queryFn: () => fetchUserSkillsForSelection(userId!),
    enabled: !!userId,
  });

  // Mutation for creating Training session and UserSkillUsages
  const mutation = useMutation({
    mutationFn: createTrainingSessionWithSkillUsages,
    onSuccess: () => {
      Alert.alert('Success', 'Training session logged!');
      queryClient.invalidateQueries({ queryKey: ['trainingSessions', userId] }); // Assuming a query key for fetching training sessions
      queryClient.invalidateQueries({ queryKey: ['userSkillsWithDetails', userId]}); // If skill usage might affect skill display
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
        return [...prev, { userSkillId: skill.id, userSkillName: skill.skill.name, quantity: '1', success: true }];
      }
    });
  };

  const handleSkillUsageChange = (userSkillId: string, field: keyof UserSkillUsageFormData, value: string | boolean) => {
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

    const trainingData: Omit<Training, 'id' | 'created_at' | 'updated_at'> = {
      userId,
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      duration: Number(duration),
      bjjType,
      intensity,
      note,
    };

    const skillUsagesData = selectedSkillsUsage.map(s => ({
      userSkillId: s.userSkillId,
      quantity: Number(s.quantity) || 0,
      success: s.success,
    }));

    mutation.mutate({ trainingData, skillUsagesData });
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
          {Constants.public.Enums.BjjType.map(type => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>

        <ThemedText style={styles.label}>Intensity:</ThemedText>
        <Picker
          selectedValue={intensity}
          onValueChange={(itemValue) => setIntensity(itemValue)}
          style={styles.picker}
        >
          {Constants.public.Enums.TrainingIntensity.map(level => (
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
          <Text>Loading your skills...</Text>
        ) : userSkills && userSkills.length > 0 ? (
          userSkills.map(skill => (
            <View key={skill.id} style={styles.skillUsageContainer}>
              <TouchableOpacity 
                style={styles.skillToggle}
                onPress={() => handleToggleSkillUsage(skill)}
              >
                <Ionicons 
                    name={selectedSkillsUsage.some(s => s.userSkillId === skill.id) ? 'checkbox-outline' : 'square-outline'} 
                    size={24} 
                    color={selectedSkillsUsage.some(s => s.userSkillId === skill.id) ? '#4CAF50' : '#ccc'} 
                />
                <ThemedText style={styles.skillNameText}>{skill.skill.name} ({skill.skill.category.name})</ThemedText>
              </TouchableOpacity>
              {selectedSkillsUsage.find(s => s.userSkillId === skill.id) && (
                <View style={styles.skillUsageInputs}>
                  <ThemedInput
                    label="Quantity/Reps:"
                    value={selectedSkillsUsage.find(s => s.userSkillId === skill.id)?.quantity || '1'}
                    onChangeText={text => handleSkillUsageChange(skill.id, 'quantity', text)}
                    keyboardType="numeric"
                    style={styles.smallInput}
                  />
                  <View style={styles.switchRow}>
                    <ThemedText style={styles.label}>Successful?</ThemedText>
                    <Switch
                      value={selectedSkillsUsage.find(s => s.userSkillId === skill.id)?.success || false}
                      onValueChange={val => handleSkillUsageChange(skill.id, 'success', val)}
                    />
                  </View>
                </View>
              )}
            </View>
          ))
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
    // flex: 1, // If in a row
    // marginRight: 10, // If in a row
    marginBottom: 10, // Standalone for now
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  picker: {
    marginBottom: 15,
    height: Platform.OS === 'ios' ? 180 : 50,
    backgroundColor: '#f0f0f0', // Basic styling for picker visibility
  },
  button: {
    marginTop: 20,
  },
  skillUsageContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  skillToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  skillNameText: {
    fontSize: 16,
    marginLeft: 10,
  },
  skillUsageInputs: {
    paddingLeft: 30, // Indent inputs under the skill name
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
  },
});
