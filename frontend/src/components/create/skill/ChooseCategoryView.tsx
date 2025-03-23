import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Categories } from '../../../constants/Skills';
import Octicons from '@expo/vector-icons/Octicons';

interface ChooseCategoryViewProps {
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

const ChooseCategoryView: React.FC<ChooseCategoryViewProps> = ({ onSelectCategory, selectedCategory }) => {
  const [tags, setTags] = useState<string[]>(Categories);
  const [newTag, setNewTag] = useState<string>('');
  const [isAddingTag, setIsAddingTag] = useState<boolean>(false);
  const inputRef = React.useRef<TextInput>(null);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const capitalizedTag = newTag.trim().charAt(0).toUpperCase() + newTag.trim().slice(1);
      setTags([...tags, capitalizedTag]);
      onSelectCategory(capitalizedTag);
      setNewTag('');
      setIsAddingTag(false);
    }
  };

const handleTagPress = (tag: string) => {
    if (selectedCategory === tag) {
        onSelectCategory('');
    } else {
        onSelectCategory(tag);
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
      {tags.map((tag, index) => (
        <TouchableOpacity key={index} onPress={() => handleTagPress(tag)}>
          <Text style={[styles.tag, selectedCategory === tag && styles.selectedTag]}>{tag}</Text>
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
            <Octicons name='plus' size={15} color='black' />        
        </TouchableOpacity>
      )}
    </View>
  );
};

ChooseCategoryView.defaultProps = {
  onSelectCategory: () => {},
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
    backgroundColor: '#fff',
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
    color: '#fff',
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
    color: '#fff',
  },
  selectedTag: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    paddingHorizontal: 12,
    marginRight: 5,
    borderRadius: 5,
  },
});

export default ChooseCategoryView;
