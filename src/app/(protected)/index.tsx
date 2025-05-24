import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '@/src/context/AuthContext';
import { getProfile } from '@/src/features/profile/services/profileService';
import { Profile } from '@/src/types';
import { router } from 'expo-router';

export default function ProtectedHomeScreen() {
  const auth = useContext(AuthContext);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth?.session?.user) {
        setLoadingProfile(true);
        try {
          const fetchedProfile = await getProfile(auth.session.user.id);
          setProfile(fetchedProfile);
          if (!fetchedProfile) {
            // Optional: Redirect to create-profile if no profile exists
            // Consider if this is the desired UX or if the screen should allow viewing with a prompt to create
             router.replace('/(protected)/create-profile');
          }
        } catch (error: any) {
          Alert.alert("Error fetching profile", error.message);
          // Potentially handle by redirecting or showing a specific error view
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    if (auth?.session) {
      fetchProfile();
    }
  }, [auth?.session]);

  if (loadingProfile || !auth?.session) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    // This case might be brief due to the redirect in fetchProfile, or if redirect is removed.
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text>You don't have a profile yet.</Text>
        <Button title="Create Profile" onPress={() => router.push('/(protected)/create-profile')} />
        <View style={styles.separator} />
        <Button title="Sign Out" onPress={() => auth.signOut()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {profile.username || 'User'}!</Text>
      <Text>Full Name: {profile.full_name || 'N/A'}</Text>
      <Text>Belt: {profile.belt_color || 'N/A'} ({profile.stripes || 0} stripes)</Text>
      <Text>Weight: {profile.weight ? `${profile.weight} kg` : 'N/A'}</Text>
      {profile.avatar_url && <Text>Avatar URL: {profile.avatar_url}</Text>}
      {/* Placeholder for Edit Profile Button */}
      <Button title="Edit Profile (Not Implemented)" onPress={() => Alert.alert("Coming Soon!", "Profile editing will be available in a future update.")} />
      <View style={styles.separator} />
      <Button title="Sign Out" onPress={() => auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'flex-start',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
});
