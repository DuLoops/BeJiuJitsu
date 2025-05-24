import PublicProfileScreen from '@/src/features/profile/screens/PublicProfileScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText'; // Corrected import path
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { StyleSheet } from 'react-native';

export default function UserProfilePage() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  if (!userId) {
    // It's good practice to provide a full view for error messages
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>User ID is missing or invalid.</ThemedText>
      </ThemedView>
    );
  }
  return <PublicProfileScreen userId={userId} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red', // Or use theme color for errors
  },
});
