import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

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
  const iconColor = useThemeColor({}, 'icon');
  const primaryBtnBg = useThemeColor({}, 'tint');
  const textOnPrimary = useThemeColor({}, 'background');

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
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
      <ThemedView style={styles.inputContainer}>
        <ThemedInput
          style={styles.input}
          value={newItem}
          onChangeText={setNewItem}
          placeholder="Add a new goal..."
          onSubmitEditing={addItem}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: primaryBtnBg }]} onPress={addItem}>
          <AntDesign name="plus" size={24} color={textOnPrimary} />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.list}>
        {items.map(item => (
          <ThemedView key={item.id} style={styles.itemContainer}>
            <ThemedText style={styles.itemText}>{item.text}</ThemedText>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
              <AntDesign name="close" size={20} color={iconColor} />
            </TouchableOpacity>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  addButton: {
    width: 48,
    height: 48,
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
    padding: 12,
    borderRadius: 8,
  },
  itemText: {
    flexShrink: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  }
});
