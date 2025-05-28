import ThemedButton from '@/src/components/ui/atoms/ThemedButton'; // For TouchableOpacity
import ThemedInput from '@/src/components/ui/atoms/ThemedInput'; // For TextInput
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useCheckUsernameAvailability, useUpsertProfile } from '@/src/features/auth/hooks/useProfileQueries';
import { UpsertProfileParams } from '@/src/features/auth/services/profileService'; // Import params type
import { useAddGoal } from '@/src/features/goals/hooks/useGoalHooks';
import { AddSupabaseGoalParams } from '@/src/features/goals/services/goalService'; // Import params type
import { GoalsList } from '@/src/features/profile/components/GoalsList';
import { SelectRank } from '@/src/features/profile/components/SelectRank';
import { validateUsername } from '@/src/features/profile/utils/validation';
import { useAuthStore } from '@/src/store/authStore'; // Import Zustand store
import { Enums } from '@/src/supabase/types'; // Added for Belt enum
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react'; // Removed useContext
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native'; // Removed Text, TextInput, TouchableOpacity, View

interface GoalState {
  id: string; // For local list key
  text: string;
}

type BeltType = Enums<'Belts'>; // Using Enums helper for Belt type

export default function CreateProfileScreen() {
  const [userName, setUserName] = useState('');
  const [debouncedUserName, setDebouncedUserName] = useState(userName);
  const [belt, setBelt] = useState<BeltType>('WHITE'); // Changed to BeltType and uppercase WHITE
  const [stripes, setStripes] = useState(0);
  const [goals, setGoals] = useState<GoalState[]>([]);
  const [usernameDisplayError, setUsernameDisplayError] = useState<string | null>(null);
  
  const { session } = useAuthStore(); // Use Zustand store
  const currentUserId = session?.user?.id;

  // Debounce username input for the availability check query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUserName(userName);
    }, 500); // 500ms debounce
    return () => {
      clearTimeout(handler);
    };
  }, [userName]);

  const {
    data: isUsernameAvailable,
    isLoading: isCheckingUsername,
    error: usernameQueryError,
    isError: isUsernameQueryError, // more specific error flag from useQuery
  } = useCheckUsernameAvailability(debouncedUserName); // Use debounced username

  const { 
    mutateAsync: upsertProfileMutate,
    isPending: isUpsertingProfile,
    // error: upsertProfileError, // Error handled by hook's onError Alert
  } = useUpsertProfile();

  const { 
    mutateAsync: addGoalMutate,
    isPending: isAddingIndividualGoal,
    // error: addGoalError, // Error handled by hook's onError Alert
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

    // Check username availability status from the query
    if (isCheckingUsername) {
      Alert.alert('Username Check', 'Still checking username availability. Please wait.');
      return;
    }
    if (isUsernameAvailable === false) {
      Alert.alert('Username Error', usernameDisplayError || 'This username is not available.');
      return;
    }
    // Ensure query has run and is not in error for the current username
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
      // fullName, role, weight, academy_id can be added if collected
    };

    try {
      await upsertProfileMutate(profileData);
      // If profile creation is successful, then add goals
      setIsSubmittingBatchGoals(true);
      let allGoalsSuccessfullyAdded = true;
      for (const goal of goals) {
        if (!currentUserId) { // Should not happen if checked above, but good practice
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
          // Error is already handled by useAddGoal's onError Alert
          console.error(`Failed to submit goal: ${goal.text}`, error);
        }
      }
      setIsSubmittingBatchGoals(false);

      if (allGoalsSuccessfullyAdded) {
        // Success alert for profile is in useUpsertProfile, for goals in useAddGoal (if individual alerts desired)
        // A general success message after all operations complete can be good.
        Alert.alert('Setup Complete', 'Your profile and goals have been saved!');
        router.replace('/(protected)/(tabs)');
      } else {
        Alert.alert('Partial Success', 'Profile saved, but some goals could not be added. Please check later.');
        router.replace('/(protected)/(tabs)'); // Still navigate
      }

    } catch (profileError) {
      // This catch is primarily for errors from upsertProfileMutate if its onError doesn't fully handle/rethrow
      // or other logic errors within this handleSubmit block.
      // The useUpsertProfile hook already shows an Alert on its error.
      console.error('Error during overall submission process:', profileError);
      setIsSubmittingBatchGoals(false); // Ensure reset
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
            onChangeText={setUserName} // Debounce handled by useEffect
            placeholder="Enter your username (min 3 chars)"
            autoCapitalize="none"
          />
          {/* Check button removed as query runs on debounce. UI feedback is via text. */}
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
        <ActivityIndicator size="large" color={styles.activityIndicatorColor.color} /> // Assuming styles.activityIndicatorColor.color is defined or use a theme color
      ) : (
        <ThemedButton
          style={styles.submitButton} // Removed disabled style, ThemedButton handles its own disabled state
          onPress={handleAttemptSubmit}
          disabled={overallIsLoading} // This will be false here, effectively always enabled, but good for clarity
          title="Create Profile & Goals"
        />
      )}
      {/* Individual mutation errors are handled by Alerts in the hooks */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: '#fff', // ThemedView will handle background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    // color: '#111827', // ThemedText will handle color
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    // color: '#374151', // ThemedText will handle color
    marginBottom: 8,
  },
  input: {
    // borderWidth: 1, // ThemedInput might handle these
    // borderColor: '#E5E7EB',
    // borderRadius: 8,
    // padding: 12,
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
  // Check button style removed as button is removed
  infoText: {
    // color: '#374151', // ThemedText
    fontSize: 14,
    marginTop: 4,
  },
  errorText: {
    // color: '#DC2626', // ThemedText, consider specific error type prop if available
    fontSize: 14,
    marginTop: 4,
  },
  successText: {
    // color: '#10B981', // ThemedText
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    // backgroundColor: '#007AFF', // ThemedButton will handle background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    // backgroundColor: '#A0A0A0', // ThemedButton disabled state
  },
  submitButtonText: {
    // color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityIndicatorColor: { // Example, adjust as needed or use useThemeColor
    color: '#007AFF',
  },
});
