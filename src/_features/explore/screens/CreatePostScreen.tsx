import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import ThemedView from '@/src/components/ui/atoms/ThemedView';
import ModalHeader from '@/src/components/ui/molecules/ModalHeader';
import PostForm from '../components/post/PostForm';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/stores/authStore';
import { createPost, PostCategory } from '../services/postService';

interface PostFormData {
  content: string;
  category: PostCategory | null;
  imageFile: { uri: string; name: string; type: string } | null;
}

const CreatePostScreen: React.FC = () => {
  const [formData, setFormData] = useState<PostFormData>({
    content: '',
    category: null,
    imageFile: null,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { session } = useAuthStore();
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const handleFormChange = (data: PostFormData, isValid: boolean) => {
    setFormData(data);
    setIsFormValid(isValid);
  };

  const handleSave = async () => {
    if (!session?.user?.id || !isFormValid || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      await createPost(
        {
          content: formData.content || undefined,
          category: formData.category,
          imageFile: formData.imageFile || undefined,
        },
        session.user.id
      );

      Alert.alert(
        'Success',
        'Your post has been created!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert(
        'Error',
        'Failed to create post. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (formData.content.trim() || formData.imageFile) {
      Alert.alert(
        'Discard Post?',
        'Are you sure you want to discard this post?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const isSaveDisabled = !isFormValid || isSaving;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ModalHeader
        title="Post"
        leftButton={{
          icon: <Ionicons name="arrow-back" size={24} color={textColor} />,
          onPress: handleBack,
        }}
        rightButton={{
          text: isSaving ? undefined : 'Save',
          icon: isSaving ? <ActivityIndicator size="small" color={tintColor} /> : undefined,
          onPress: handleSave,
          disabled: isSaveDisabled,
          textColor: isSaveDisabled ? textColor + '60' : tintColor,
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <PostForm onFormChange={handleFormChange} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default CreatePostScreen;