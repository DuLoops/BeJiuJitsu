import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Categories, CategoryType } from '../../../constants/Skills';
import Octicons from '@expo/vector-icons/Octicons';
import { Text } from '@/src/components/ui/Text';
import {colors} from '@/src/theme/theme';
interface ChooseCategoryViewProps {
  onSelectCategory?: (category: {id: string, name:string} | null) => void;
  selectedCategory: {id: string, name:string} | null;
}

const ChooseCategoryView: React.FC<ChooseCategoryViewProps> = ({ 
  onSelectCategory = () => {}, 
  selectedCategory 
}) => {     
  const [categories, setCategories] = useState<CategoryType[]>(Categories);
  const [newTag, setNewTag] = useState<string>('');
  const [isAddingTag, setIsAddingTag] = useState<boolean>(false);
  const inputRef = React.useRef<TextInput>(null);

  const addTag = () => {
    if (newTag.trim() && !categories.some(cat => cat.name.toLowerCase() === newTag.trim().toLowerCase())) {
      const capitalizedTag = newTag.trim().charAt(0).toUpperCase() + newTag.trim().slice(1);
      const newCategory: CategoryType = {
        id: `category-${capitalizedTag.toLowerCase().replace(/[^\w]+/g, '-')}`,
        name: capitalizedTag
      };
      setCategories([...categories, newCategory]);
      onSelectCategory(newCategory);
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const handleTagPress = (category: CategoryType) => {
    console.log('category', category);
    if (selectedCategory && selectedCategory.id === category.id) {
      onSelectCategory(null);
    } else {
      onSelectCategory(category);
    }
  };

  const handleAddTagButtonPress = () => {
    setIsAddingTag(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleCloseAddTag = () => {
    setIsAddingTag(false);
    setNewTag('');
  };

  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity key={category.id} onPress={() => handleTagPress(category)}>
          <Text style={[styles.tag, selectedCategory?.id === category.id && styles.selectedTag]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
      {isAddingTag ? (
        <View style={styles.addTagContainer}>
          <TouchableOpacity onPress={handleCloseAddTag} style={styles.closeButton}>
            <Octicons name='x' size={15} color='white' />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            value={newTag}
            onChangeText={setNewTag}
            placeholder='New Tag'
            style={styles.input}
          />
          <TouchableOpacity onPress={addTag} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={handleAddTagButtonPress} style={styles.addTagButton}>
            <Octicons name='plus' size={15} color='#030712' />        
        </TouchableOpacity>
      )}
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
  addTagButton: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  addTagButtonText: {
    color: '#F9FAFB',
  },
  addTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginVertical: 10,
    borderRadius: 5,
    flex: 1,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#F9FAFB',
  },
  selectedTag: {
    backgroundColor: colors.blue,
    color: '#F9FAFB',
  },
  closeButton: {
    backgroundColor: '#B91C1C',
    padding: 10,
    paddingHorizontal: 12,
    marginRight: 5,
    borderRadius: 5,
  },
});

export default ChooseCategoryView;
