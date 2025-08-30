import React from 'react';
import { StyleSheet } from 'react-native';

import DropdownPicker from '@/src/components/ui/molecules/DropdownPicker';
import { PostCategory } from '../../services/postService';
import { Constants } from '@/src/supabase/types';

interface PostCategoryPickerProps {
  selectedCategory: PostCategory | null;
  onCategorySelect: (category: PostCategory) => void;
}

const PostCategoryPicker: React.FC<PostCategoryPickerProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  const categoryOptions = Constants.public.Enums.post_category.map(category => ({
    label: category,
    value: category
  }));

  return (
    <DropdownPicker
      placeholder="Select Category"
      options={categoryOptions}
      onValueChange={(value) => onCategorySelect(value as PostCategory)}
      selectedValue={selectedCategory || ''}
      style={styles.picker}
    />
  );
};

const styles = StyleSheet.create({
  picker: {
    width: 218,
    height: 38,
  },
});

export default PostCategoryPicker;