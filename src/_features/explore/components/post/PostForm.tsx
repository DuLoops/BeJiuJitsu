import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert } from 'react-native';

import ThemedView from '@/src/components/ui/atoms/ThemedView';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ImageUploader from '@/src/components/ui/molecules/ImageUploader';
import PostCategoryPicker from './PostCategoryPicker';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { PostCategory, validatePost } from '../../services/postService';

interface PostFormData {
  content: string;
  category: PostCategory | null;
  imageFile: { uri: string; name: string; type: string } | null;
}

interface PostFormProps {
  onFormChange: (data: PostFormData, isValid: boolean) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onFormChange }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory | null>(null);
  const [imageFile, setImageFile] = useState<{ uri: string; name: string; type: string } | null>(null);

  const backgroundColor = useThemeColor({ light: '#D9D9D9', dark: '#333' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');

  const updateForm = (newData: Partial<PostFormData>) => {
    const updatedData = {
      content: newData.content ?? content,
      category: newData.category ?? category,
      imageFile: newData.imageFile ?? imageFile,
    };

    const validation = validatePost(updatedData.content, !!updatedData.imageFile);
    onFormChange(updatedData, validation.isValid && !!updatedData.category);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
    updateForm({ content: text });
  };

  const handleCategoryChange = (newCategory: PostCategory) => {
    setCategory(newCategory);
    updateForm({ category: newCategory });
  };

  const handleImageSelected = (image: { uri: string; name: string; type: string }) => {
    setImageFile(image);
    updateForm({ imageFile: image });
  };

  const handleImageRemoved = () => {
    setImageFile(null);
    updateForm({ imageFile: null });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Image Upload Section */}
      <ThemedView style={styles.section}>
        <ImageUploader
          imageUri={imageFile?.uri}
          onImageSelected={handleImageSelected}
          onImageRemoved={handleImageRemoved}
        />
      </ThemedView>

      {/* Content Input Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={[styles.label, { color: textColor }]}>
          Post
        </ThemedText>
        <TextInput
          style={[
            styles.textInput,
            { 
              backgroundColor, 
              color: textColor,
              borderColor: placeholderColor + '40'
            }
          ]}
          placeholder="What's on your mind?"
          placeholderTextColor={placeholderColor}
          value={content}
          onChangeText={handleContentChange}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          maxLength={500}
        />
        <ThemedText style={[styles.characterCount, { color: placeholderColor }]}>
          {content.length}/500
        </ThemedText>
      </ThemedView>

      {/* Category Selection Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={[styles.label, { color: textColor }]}>
          Category
        </ThemedText>
        <PostCategoryPicker
          selectedCategory={category}
          onCategorySelect={handleCategoryChange}
        />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 12,
  },
  textInput: {
    width: 336,
    height: 176,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
    marginRight: 8,
  },
});

export default PostForm;