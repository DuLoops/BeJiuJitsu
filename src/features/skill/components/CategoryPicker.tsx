import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { themeColors } from '@/src/constants/Colors';
import { CategoryType, Categories as DefaultCategories } from '@/src/constants/Skills';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CategoryPickerProps {
  onSelectCategory: (category: CategoryType | null) => void;
  selectedCategory: CategoryType | null;
  categories?: CategoryType[];
  disabled?: boolean;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ 
  onSelectCategory = () => {},
  selectedCategory,
  categories = DefaultCategories,
  disabled = false
}) => {     
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
          <ThemedText style={[
            styles.tag, 
            selectedCategory?.id === category.id && styles.selectedTag,
            disabled && styles.disabledTag
          ]}>
            {category.name}
          </ThemedText>
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
    backgroundColor: themeColors.blue,
    color: '#F9FAFB',
  },
  disabledTag: {
    opacity: 0.5,
  }
});

export default CategoryPicker;
