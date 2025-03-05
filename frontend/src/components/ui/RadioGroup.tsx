import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  onSelect: (values: string[]) => void;
  values: string[];
  multiple?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  onSelect,
  values,
  multiple = true,
}) => {
  const handleSelect = (value: string) => {
    let newValues: string[];
    
    if (multiple) {
      newValues = values.includes(value)
        ? values.filter(v => v !== value)
        : [...values, value];
    } else {
      newValues = [value];
    }
    
    onSelect(newValues);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.tag,
            values.includes(option.value) && styles.selectedTag,
          ]}
          onPress={() => handleSelect(option.value)}
        >
          <Text
            style={[
              styles.tagText,
              values.includes(option.value) && styles.selectedTagText,
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedTag: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  tagText: {
    color: '#374151',
    fontSize: 14,
  },
  selectedTagText: {
    color: '#fff',
  },
});

export default RadioGroup;
