import React from 'react';
import { StyleSheet } from 'react-native';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText';

export default function HomeScreenPlaceholder() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Welcome to BeJiuJitsu!</ThemedText>
      <ThemedText style={styles.subtitle}>
        Your personalized activity feed and dashboard are coming soon.
      </ThemedText>
      <ThemedText style={styles.placeholderText}>
        Stay tuned for updates!
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray', // Or use theme color
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  }
});
