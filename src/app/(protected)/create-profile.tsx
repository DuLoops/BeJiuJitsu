import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { AuthContext } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import { createProfile } from '@/src/features/profile/services/profileService';
import { Profile } from '@/src/types';

export default function CreateProfileScreen() {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [belt, setBelt] = useState('White'); // Default value
  const [stripes, setStripes] = useState(0);
  const [weight, setWeight] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateProfile = async () => {
    if (!auth?.session?.user) {
      Alert.alert("Error", "You must be logged in to create a profile.");
      return;
    }
    setLoading(true);
    try {
      const profileData: Omit<Profile, 'updated_at'> = {
        id: auth.session.user.id,
        username,
        full_name: fullName,
        belt_color: belt as Profile['belt_color'], // Add type assertion
        stripes: Number(stripes),
        weight: parseFloat(weight) || undefined, // Use undefined for optional number
        avatar_url: avatarUrl,
      };
      await createProfile(profileData);
      Alert.alert("Success", "Profile created successfully!");
      router.replace('/(protected)/'); // Navigate to home or another protected route
    } catch (error: any) {
      Alert.alert("Error creating profile", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      {/* TODO: Replace TextInput with Picker/Select for Belt */}
      <TextInput
        style={styles.input}
        placeholder="Belt (e.g., White, Blue, Purple, Brown, Black)"
        value={belt}
        onChangeText={setBelt}
      />
      {/* TODO: Replace TextInput with Picker/Select or NumberInput for Stripes */}
      <TextInput
        style={styles.input}
        placeholder="Stripes (0-4)"
        value={String(stripes)}
        onChangeText={(text) => setStripes(parseInt(text) || 0)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Avatar URL (optional)"
        value={avatarUrl}
        onChangeText={setAvatarUrl}
        autoCapitalize="none"
      />
      <Button title={loading ? "Creating Profile..." : "Create Profile"} onPress={handleCreateProfile} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
});
