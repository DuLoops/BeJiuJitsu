import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image, // For avatar
  Text, // For error/loading if ThemedText not sufficient
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/src/context/AuthContext'; // To get current user for FollowButton logic
import { Profile } from '@/src/types';
import { getProfile } from '@/src/features/profile/services/profileService';
import FollowButton from '@/src/features/social/components/FollowButton';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText';
import { Ionicons } from '@expo/vector-icons'; // For placeholder avatar

interface PublicProfileScreenProps {
  userId: string;
}

export default function PublicProfileScreen({ userId }: PublicProfileScreenProps) {
  const auth = useContext(AuthContext);
  const currentUserId = auth?.session?.user?.id;

  const { data: profile, isLoading, error } = useQuery<Profile | null, Error>({ 
    queryKey: ['publicProfile', userId],
    queryKeyHash: `publicProfile-${userId}`,
    queryFn: () => getProfile(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading profile...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>Error loading profile: {error.message}</ThemedText>
      </ThemedView>
    );
  }

  if (!profile) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>User profile not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.profileHeader}>
        {profile.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person-circle-outline" size={80} color="#ccc" />
          </View>
        )}
        <ThemedText style={styles.username}>{profile.username || 'N/A'}</ThemedText>
        <ThemedText style={styles.fullName}>{profile.full_name || 'User'}</ThemedText>
        {profile.belt && (
            <ThemedText style={styles.beltInfo}>Belt: {profile.belt} - {profile.stripes || 0} stripe(s)</ThemedText>
        )}
      </View>

      <View style={styles.followButtonContainer}>
        {/* Ensure FollowButton is not shown for the current user's own public profile page */}
        {currentUserId && userId !== currentUserId && (
          <FollowButton targetUserId={userId} />
        )}
      </View>

      {/* Placeholder for other profile content like skills, activity, etc. */}
      <View style={styles.contentArea}>
        <ThemedText style={styles.placeholderText}>More profile details coming soon...</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 5,
  },
  beltInfo: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  followButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contentArea: {
    // Placeholder for future content
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 30,
  },
});
