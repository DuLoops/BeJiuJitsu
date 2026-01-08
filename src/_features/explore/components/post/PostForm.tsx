import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ImageUploader from '@/src/components/ui/molecules/ImageUploader';
import VideoRecorder from '@/src/components/ui/molecules/VideoRecorder';
import VideoPlayer from '@/src/components/ui/molecules/VideoPlayer';
import PostCategoryPicker from './PostCategoryPicker';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { PostCategory, validatePost } from '../../services/postService';

interface PostFormData {
  content: string;
  category: PostCategory | null;
  imageFile: { uri: string; name: string; type: string } | null;
  videoUri: string | null;
}

interface PostFormProps {
  onFormChange: (data: PostFormData, isValid: boolean) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onFormChange }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory | null>(null);
  const [imageFile, setImageFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const backgroundColor = useThemeColor({ light: '#D9D9D9', dark: '#333' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const borderColor = useThemeColor({}, 'border');

  const updateForm = (newData: Partial<PostFormData>) => {
    const updatedData = {
      content: newData.content ?? content,
      category: newData.category ?? category,
      imageFile: newData.imageFile !== undefined ? newData.imageFile : imageFile,
      videoUri: newData.videoUri !== undefined ? newData.videoUri : videoUri,
    };

    // Valid if content exists OR media exists, AND category is selected
    const hasMedia = !!updatedData.imageFile || !!updatedData.videoUri;
    const isValid = (!!updatedData.content || hasMedia) && !!updatedData.category;

    onFormChange(updatedData, isValid);
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
    setVideoUri(null); // Mutually exclusive for now
    updateForm({ imageFile: image, videoUri: null });
  };

  const handleImageRemoved = () => {
    setImageFile(null);
    updateForm({ imageFile: null });
  };

  const handleVideoSelected = (uri: string) => {
    setVideoUri(uri);
    setImageFile(null); // Mutually exclusive
    updateForm({ videoUri: uri, imageFile: null });
  };

  return (
    <ThemedCard style={styles.container}>
      {/* Media Upload Section */}
      <ThemedCard style={styles.section}>
        <ThemedText style={[styles.label, { color: textColor }]}>Media</ThemedText>

        {!videoUri && (
          <ImageUploader
            imageUri={imageFile?.uri}
            onImageSelected={handleImageSelected}
            onImageRemoved={handleImageRemoved}
          />
        )}

        {!imageFile && (
          <View style={styles.videoSection}>
            {videoUri ? (
              <View>
                <VideoPlayer uri={videoUri} />
                <ThemedText onPress={() => handleVideoSelected('')} style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>Remove Video</ThemedText>
              </View>
            ) : (
              <VideoRecorder onVideoSelected={handleVideoSelected} />
            )}
          </View>
        )}
      </ThemedCard>

      {/* Content Input Section */}
      <ThemedCard style={styles.section}>
        <ThemedText style={[styles.label, { color: textColor }]}>
          Post
        </ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor,
              color: textColor,
              borderColor: borderColor
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
      </ThemedCard>

      {/* Category Selection Section */}
      <ThemedCard style={styles.section}>
        <ThemedText style={[styles.label, { color: textColor }]}>
          Category
        </ThemedText>
        <PostCategoryPicker
          selectedCategory={category}
          onCategorySelect={handleCategoryChange}
        />
      </ThemedCard>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'transparent',
    borderWidth: 0, // No double border
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOpacity: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Crimson Text', // Serif header
  },
  textInput: {
    width: '100%',
    minHeight: 120,
    padding: 16,
    borderRadius: 2, // Square aesthetic
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'System', // Body sans-serif
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
    marginRight: 8,
  },
  videoSection: {
    marginTop: 10,
  }
});

export default PostForm;