import { UpsertProfileParams } from '@/src/_features/auth/services/profileService';
import { useAddGoal } from '@/src/_features/goals/hooks/useGoalHooks';
import { GoalsList } from '@/src/_features/profile/components/GoalsList';
import { SelectRank } from '@/src/_features/profile/components/SelectRank';
import { useCheckUsernameAvailability, useUpsertProfile } from '@/src/_features/profile/hooks/useProfileQueries';
import { AddSupabaseGoalParams } from '@/src/_features/profile/services/goalService';
import { validateUsername } from '@/src/_features/profile/utils/validation';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { AuthContext } from '@/src/context/AuthContext';
import { Enums } from '@/src/supabase/types';
import { router } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';

interface GoalState {
  id: string;
  text: string;
}

type BeltType = Enums<'Belts'>;

export default function CreateProfileScreen() {
  const [userName, setUserName] = useState('');
  const [debouncedUserName, setDebouncedUserName] = useState(userName);
  const [belt, setBelt] = useState<BeltType>('WHITE');
  const [stripes, setStripes] = useState(0);
  const [goals, setGoals] = useState<GoalState[]>([]);
  const [usernameDisplayError, setUsernameDisplayError] = useState<string | null>(null);
  
  const auth = useContext(AuthContext);
  const currentUserId = auth?.session?.user?.id;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUserName(userName);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [userName]);

  const {
    data: isUsernameAvailable,
    isLoading: isCheckingUsername,
    error: usernameQueryError,
    isError: isUsernameQueryError,
  } = useCheckUsernameAvailability(debouncedUserName);

  const { 
    mutateAsync: upsertProfileMutate,
    isPending: isUpsertingProfile,
  } = useUpsertProfile();

  const { 
    mutateAsync: addGoalMutate,
    isPending: isAddingIndividualGoal,
  } = useAddGoal();

  const [isSubmittingBatchGoals, setIsSubmittingBatchGoals] = useState(false);

  useEffect(() => {
    if (isUsernameQueryError && usernameQueryError) {
      setUsernameDisplayError(usernameQueryError.message || 'Failed to check username.');
    } else if (isUsernameAvailable === false && debouncedUserName === userName && !isCheckingUsername) {
      setUsernameDisplayError('Username is already taken');
    } else {
      setUsernameDisplayError(null);
    }
  }, [isUsernameAvailable, isUsernameQueryError, usernameQueryError, debouncedUserName, userName, isCheckingUsername]);

  const handleAttemptSubmit = async () => {
    const validationError = validateUsername(userName);
    if (validationError) {
      setUsernameDisplayError(validationError);
      Alert.alert('Validation Error', validationError);
      return;
    }

    if (isCheckingUsername) {
      Alert.alert('Username Check', 'Still checking username availability. Please wait.');
      return;
    }
    if (isUsernameAvailable === false) {
      Alert.alert('Username Error', usernameDisplayError || 'This username is not available.');
      return;
    }
    if (userName.trim() !== '' && userName === debouncedUserName && (isUsernameQueryError || isUsernameAvailable !== true)) {
        Alert.alert('Username Check Required', 'Please ensure your username is checked and available. If there was an error, try modifying your username.');
        return;
    }
    if (!currentUserId) {
      Alert.alert('Authentication Error', 'Cannot create profile. User not found.');
      return;
    }

    const profileData: UpsertProfileParams = {
      id: currentUserId,
      username: userName,
      belt,
      stripes,
    };

    try {
      await upsertProfileMutate(profileData);
      setIsSubmittingBatchGoals(true);
      let allGoalsSuccessfullyAdded = true;
      for (const goal of goals) {
        if (!currentUserId) {
            console.error("User ID became unavailable before adding goals");
            allGoalsSuccessfullyAdded = false;
            break;
        }
        const goalData: AddSupabaseGoalParams = {
          profile_id: currentUserId,
          description: goal.text,
          completed: false, 
        };
        try {
          await addGoalMutate(goalData);
        } catch (error) {
          allGoalsSuccessfullyAdded = false;
          console.error(`Failed to submit goal: ${goal.text}`, error);
        }
      }
      setIsSubmittingBatchGoals(false);

      if (allGoalsSuccessfullyAdded) {
        Alert.alert('Setup Complete', 'Your profile and goals have been saved!');
        router.replace('/(protected)/(tabs)');
      } else {
        Alert.alert('Partial Success', 'Profile saved, but some goals could not be added. Please check later.');
        router.replace('/(protected)/(tabs)');
      }

    } catch (profileError) {
      console.error('Error during overall submission process:', profileError);
      setIsSubmittingBatchGoals(false);
    }
  };

  const overallIsLoading = isUpsertingProfile || isAddingIndividualGoal || isSubmittingBatchGoals || isCheckingUsername;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <ThemedText style={styles.title}>Create Your Profile</ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.label}>Username</ThemedText>
        <ThemedView style={styles.usernameContainer}>
          <ThemedInput
            style={[styles.input, styles.usernameInput]}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your username (min 3 chars)"
            autoCapitalize="none"
          />
        </ThemedView>
        {isCheckingUsername && <ThemedText style={styles.infoText}>Checking username...</ThemedText>}
        {usernameDisplayError && (
            <ThemedText style={styles.errorText}>{usernameDisplayError}</ThemedText>
        )}
        {isUsernameAvailable === true && userName === debouncedUserName && !isCheckingUsername && !isUsernameQueryError && (
          <ThemedText style={styles.successText}>Username is available!</ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <SelectRank
          belt={belt}
          stripes={stripes}
          onBeltChange={setBelt}
          onStripesChange={setStripes}
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <GoalsList items={goals} onItemsChange={setGoals} title="Training Goals" />
      </ThemedView>

      {overallIsLoading ? (
        <ActivityIndicator size="large" color={styles.activityIndicatorColor.color} />
      ) : (
        <ThemedButton
          style={styles.submitButton}
          onPress={handleAttemptSubmit}
          disabled={overallIsLoading}
          title="Create Profile & Goals"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  activityIndicatorColor: {
    color: '#007AFF',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
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
  infoText: {
    fontSize: 14,
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
    color: 'red',
  },
  successText: {
    fontSize: 14,
    marginTop: 4,
    color: 'green',
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
