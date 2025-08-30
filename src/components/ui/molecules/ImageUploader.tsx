import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

import ThemedView from '@/src/components/ui/atoms/ThemedView';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';

interface ImageUploaderProps {
  imageUri?: string;
  onImageSelected: (image: { uri: string; name: string; type: string }) => void;
  onImageRemoved: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUri,
  onImageSelected,
  onImageRemoved
}) => {
  const backgroundColor = useThemeColor({ light: '#D9D9D9', dark: '#333' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileExtension = asset.uri.split('.').pop()?.toLowerCase() || 'jpg';
        
        onImageSelected({
          uri: asset.uri,
          name: `post_image_${Date.now()}.${fileExtension}`,
          type: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onImageRemoved }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor }]}
      onPress={imageUri ? handleRemoveImage : pickImage}
      activeOpacity={0.7}
    >
      {imageUri ? (
        <>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.image}
            contentFit="cover"
          />
          <ThemedView style={styles.removeOverlay}>
            <Ionicons name="close-circle" size={32} color="red" />
            <ThemedText style={[styles.removeText, { color: 'red' }]}>
              Tap to remove
            </ThemedText>
          </ThemedView>
        </>
      ) : (
        <ThemedView style={styles.placeholder}>
          <Ionicons name="add" size={52} color={iconColor} />
          <ThemedText style={[styles.placeholderText, { color: textColor }]}>
            Add Photo
          </ThemedText>
        </ThemedView>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 356,
    height: 247,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  removeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImageUploader;