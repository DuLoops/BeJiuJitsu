import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import { useThemeColor } from '@/src/hooks/useThemeColor';

export default function CreateScreen() {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  const handleLogTraining = () => {
    router.push('/(protected)/(modal)/create/training');
  };

  const handleLogCompetition = () => {
    router.push('/(protected)/(modal)/create/competition');
  };

  const handleRecordRoll = () => {
    router.push('/(protected)/(modal)/create/record');
  };

  const handlePublishPost = () => {
    router.push('/(protected)/(modal)/create/post');
  };

  return (
    <ThemedCard style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Create</ThemedText>
        <ThemedText style={styles.subtitle}>What would you like to log?</ThemedText>

        <View style={styles.buttonContainer}>
          <ThemedButton
            title="Log Training"
            variant="primary"
            size="lg"
            onPress={handleLogTraining}
            icon={<Ionicons name="barbell" size={24} color="white" />}
            style={styles.button}
            testID="log-training-button"
          />

          <ThemedButton
            title="Log Competition"
            variant="primary"
            size="lg"
            onPress={handleLogCompetition}
            icon={<Ionicons name="trophy" size={24} color="white" />}
            style={styles.button}
            testID="log-competition-button"
          />

          <ThemedButton
            title="Record a Roll"
            variant="primary"
            size="lg"
            onPress={handleRecordRoll}
            icon={<Ionicons name="videocam" size={24} color="white" />}
            style={styles.button}
            testID="record-roll-button"
          />

          <ThemedButton
            title="Publish a Post"
            variant="primary"
            size="lg"
            onPress={handlePublishPost}
            icon={<Ionicons name="create" size={24} color="white" />}
            style={styles.button}
            testID="publish-post-button"
          />
        </View>
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
});
