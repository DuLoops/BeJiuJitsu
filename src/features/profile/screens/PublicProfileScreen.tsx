import { useAuthStore } from '@/src/store/authStore';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native'; // Removed View, Text
// import { Profile } from '@/src/types'; // Removed
import ThemedText from '@/src/components/ui/atoms/ThemedText'; // Ensured default import
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { getProfile } from '@/src/features/profile/services/profileService';
import FollowButton from '@/src/features/social/components/FollowButton';
import { useThemeColor } from '@/src/hooks/useThemeColor'; // For themed icon color
import { Tables } from '@/src/supabase/types'; // Added
import { Ionicons } from '@expo/vector-icons';

interface PublicProfileScreenProps {
  userId: string;
}

type Profile = Tables<'profiles'>; // Use Tables helper

export default function PublicProfileScreen({ userId }: PublicProfileScreenProps) {
  const { session } = useAuthStore();
  const currentUserId = session?.user?.id;
  const iconColor = useThemeColor({}, 'icon'); // Default icon color from theme

  const { data: profile, isLoading, error } = useQuery<Profile | null, Error>({
    queryKey: ['publicProfile', userId], // queryKeyHash removed
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
      <ThemedView style={styles.profileHeader}> {/* Changed View to ThemedView */}
        {profile.avatar ? ( // Changed avatar_url to avatar
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        ) : (
          <ThemedView style={styles.avatarPlaceholder}> {/* Changed View to ThemedView */}
            <Ionicons name="person-circle-outline" size={80} color={iconColor} /> {/* Used themed icon color */}
          </ThemedView>
        )}
        <ThemedText type="title" style={styles.username}>{profile.username || 'N/A'}</ThemedText>
        <ThemedText type="subtitle" style={styles.fullName}>{profile.full_name || 'User'}</ThemedText>
        {profile.belt && (
            <ThemedText style={styles.beltInfo}>Belt: {profile.belt} - {profile.stripes || 0} stripe(s)</ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.followButtonContainer}> {/* Changed View to ThemedView */}
        {currentUserId && userId !== currentUserId && (
          <FollowButton targetUserId={userId} />
        )}
      </ThemedView>

      <ThemedView style={styles.contentArea}> {/* Changed View to ThemedView */}
        <ThemedText style={styles.placeholderText}>More profile details coming soon...</ThemedText>
      </ThemedView>
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
    // backgroundColor: '#e0e0e0', // ThemedView might handle this or useThemeColor
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    // fontSize: 24, // Handled by ThemedText type="title"
    // fontWeight: 'bold', // Handled by ThemedText type="title"
  },
  fullName: {
    // fontSize: 18, // Handled by ThemedText type="subtitle"
    // color: 'gray', // Handled by ThemedText type="subtitle"
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
  contentArea: {},
  placeholderText: {
    textAlign: 'center',
    fontSize: 16,
    // color: 'gray', // ThemedText should handle this
    marginTop: 30,
  },
});
