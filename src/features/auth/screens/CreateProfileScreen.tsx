import { GoalsList } from '@/src/features/auth/components/GoalsList';
import { SelectRank } from '@/src/features/auth/components/SelectRank';
import { useProfileService } from '@/src/features/auth/services/profileService';
import { validateUsername } from '@/src/features/auth/utils/validation';
import { useGoalService } from '@/src/features/goals/services/goalService';
import { Belt } from '@/src/supabase/constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface GoalState {
  id: string;
  text: string;
}

export default function CreateProfileScreen() {
  const { checkUserNameAvailability, createProfile } = useProfileService();
  const { addGoal } = useGoalService();
  const [userName, setUserName] = useState('');
  const [belt, setBelt] = useState<Belt>('White');
  const [stripes, setStripes] = useState(0);
  const [goals, setGoals] = useState<GoalState[]>([]);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BJJ_OPTIONS = [
    { label: 'Gi', value: 'GI' },
    { label: 'No-Gi', value: 'NOGI' },
  ];

  const handleCheckUsername = async () => {
    if (!userName.trim()) {
      setUsernameError('Username is required');
      return false;
    }

    const validationError = validateUsername(userName);
    if (validationError) {
      setUsernameError(validationError);
      return false;
    }

    setIsCheckingUsername(true);
    setUsernameError(null);
    
    try {
      const isAvailable = await checkUserNameAvailability(userName);
      setIsUsernameAvailable(isAvailable);
      if (!isAvailable) {
        setUsernameError('Username is already taken');
      }
      return isAvailable;
    } catch (error) {
      setUsernameError('Failed to check username availability');
      return false;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleSubmit = async () => {
    const isAvailable = await handleCheckUsername();
    
    if (!isAvailable) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createProfile({
        userName,
        belt,
        stripes,
        weight: undefined,
        academy: undefined,
        avatar: undefined,
      });

      console.log(goals)
      for (const goal of goals) {
        try {
          console.log(goal)
          await addGoal({ description: goal.text, completed: false });
        } catch (goalError) {
          console.error(`Failed to add goal: ${goal.text}`, goalError);
        }
      }

      router.replace('/(protected)/(tabs)');
    } catch (error) {
      console.log(error)
      setUsernameError('Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Your Profile</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Username</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={[styles.input, styles.usernameInput]}
            value={userName}
            onChangeText={(text) => {
              setUserName(text);
              setIsUsernameAvailable(null);
              setUsernameError(null);
            }}
            placeholder="Enter your username"
          />
          <TouchableOpacity 
            style={styles.checkButton}
            onPress={handleCheckUsername}
            disabled={isCheckingUsername}
          >
            {isCheckingUsername ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.checkButtonText}>Check</Text>
            )}
          </TouchableOpacity>
        </View>
        {usernameError && (
          <Text style={styles.errorText}>{usernameError}</Text>
        )}
        {isUsernameAvailable && (
          <Text style={styles.successText}>Username is available!</Text>
        )}
      </View>

      <View style={styles.section}>
        <SelectRank
          belt={belt}
          stripes={stripes}
          onBeltChange={setBelt}
          onStripesChange={setStripes}
        />
      </View>

      <View style={styles.section}>
        <GoalsList
          items={goals}
          onItemsChange={setGoals}
          title="Training Goals"
        />
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#111827',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  usernameInput: {
    flex: 1,
  },
  checkButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 4,
  },
  successText: {
    color: '#059669',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
