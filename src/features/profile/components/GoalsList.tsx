import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface GoalsItem {
  id: string;
  text: string;
}

interface GoalsListProps {
  items: GoalsItem[];
  onItemsChange: (items: GoalsItem[]) => void;
  title?: string;
}

export const GoalsList: React.FC<GoalsListProps> = ({ 
  items, 
  onItemsChange, 
  title = "Goals"
}) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      onItemsChange([...items, { id: Date.now().toString(), text: newItem.trim() }]);
      setNewItem('');
    }
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newItem}
          onChangeText={setNewItem}
          placeholder="Add a new goal..."
          onSubmitEditing={addItem}
          onBlur={addItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        {items.map(item => (
          <View key={item.id} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.text}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <AntDesign name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#000',
    width: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    gap: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#374151',
  },
});
