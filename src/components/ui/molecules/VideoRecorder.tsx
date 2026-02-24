import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';

interface VideoRecorderProps {
  onVideoSelected?: (uri: string) => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ onVideoSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const iconColor = useThemeColor({}, 'icon');

  const handleRecordVideo = async () => {
    try {
      setIsLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to record videos.');
        setIsLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // Limit to 1 minute for now
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        onVideoSelected?.(uri);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickVideo = async () => {
    try {
      setIsLoading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Media library permission is required to select videos.');
        setIsLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        onVideoSelected?.(uri);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Add Video</ThemedText>
      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Record Video"
          onPress={handleRecordVideo}
          icon={<Ionicons name="videocam" size={24} color="white" />}
          style={styles.button}
          disabled={isLoading}
        />
        <ThemedButton
          title="Select from Gallery"
          onPress={handlePickVideo}
          icon={<Ionicons name="images" size={24} color="white" />}
          style={styles.button}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default VideoRecorder;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    width: '100%',
  },
});