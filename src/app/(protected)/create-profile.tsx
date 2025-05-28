import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { createProfile } from '@/src/features/profile/services/profileService';
import { useAuthStore } from '@/src/store/authStore';
import { Tables, TablesInsert } from '@/src/supabase/types';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

// Define Profile using Tables helper type
type Profile = Tables<'profiles'>;

export default function CreateProfileScreen() {
  const { session } = useAuthStore();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [belt, setBelt] = useState('White'); // Default value
  const [stripes, setStripes] = useState(0);
  const [weight, setWeight] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateProfile = async () => {
    if (!session?.user) {
      Alert.alert("Error", "You must be logged in to create a profile.");
      return;
    }
    setLoading(true);
    try {
      // Ensure profileData matches the expected type for createProfile service
      const profileData: TablesInsert<'profiles'> = {
        id: session.user.id,
        username: username || undefined,
        full_name: fullName || undefined,
        belt: belt as Profile['belt'], // Type assertion for belt
        stripes: Number(stripes) || undefined,
        weight: parseFloat(weight) || undefined,
        avatar: avatarUrl || undefined, // Changed avatar_url to avatar to match DB
      };
      await createProfile(profileData as any); // Using 'as any' temporarily if type issues persist with service
      Alert.alert("Success", "Profile created successfully!");
      router.replace('/(protected)/(tabs)'); // Changed to a valid group route for tabs
    } catch (error: any) {
      Alert.alert("Error creating profile", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Your Profile</ThemedText>
      <ThemedInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <ThemedInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      {/* TODO: Replace TextInput with Picker/Select for Belt */}
      <ThemedInput
        style={styles.input}
        placeholder="Belt (e.g., White, Blue, Purple, Brown, Black)"
        value={belt}
        onChangeText={setBelt}
      />
      {/* TODO: Replace TextInput with Picker/Select or NumberInput for Stripes */}
      <ThemedInput
        style={styles.input}
        placeholder="Stripes (0-4)"
        value={String(stripes)}
        onChangeText={(text) => setStripes(parseInt(text) || 0)}
        keyboardType="numeric"
      />
      <ThemedInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <ThemedInput
        style={styles.input}
        placeholder="Avatar URL (optional)"
        value={avatarUrl}
        onChangeText={setAvatarUrl}
        autoCapitalize="none"
      />
      <ThemedButton title={loading ? "Creating Profile..." : "Create Profile"} onPress={handleCreateProfile} disabled={loading} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
});
