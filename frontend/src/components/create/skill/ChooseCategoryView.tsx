import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Categories, CategoryType } from '../../../constants/Skills';
import { Text } from '@/src/components/ui/Text';
import {colors} from '@/src/theme/theme';

interface ChooseCategoryViewProps {
  onSelectCategory: (category: CategoryType | null) => void;
  selectedCategory: CategoryType | null;
  disabled?: boolean;
}

const ChooseCategoryView: React.FC<ChooseCategoryViewProps> = ({ 
  onSelectCategory = () => {}, 
  selectedCategory,
  disabled = false
}) => {     
  const [categories] = useState<CategoryType[]>(Categories);

  const handleTagPress = (category: CategoryType) => {
    if (disabled) return;
    if (selectedCategory?.id === category.id) {
      onSelectCategory(null);
    } else {
      onSelectCategory(category);
    }
  };

  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity 
          key={category.id} 
          onPress={() => handleTagPress(category)}
          disabled={disabled}
        >
          <Text style={[
            styles.tag, 
            selectedCategory?.id === category.id && styles.selectedTag,
            disabled && styles.disabledTag
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 5,
  },
  tag: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    margin: 5,
    borderRadius: 5,
  },
  selectedTag: {
    backgroundColor: colors.blue,
    color: '#F9FAFB',
  },
  disabledTag: {
    opacity: 0.5,
  }
});

export default ChooseCategoryView;
