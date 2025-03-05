import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;  // Add maxValue prop
  label?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  minValue = 0,
  maxValue = Infinity,  // Add maxValue default
  label,
}) => {
  const handleIncrement = () => {
    if (value < maxValue) {  // Add maxValue check
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > minValue) {
      onChange(value - 1);
    }
  };

  const handleTextChange = (text: string) => {
    const num = parseInt(text) || minValue;
    // Clamp value between min and max
    const clampedNum = Math.min(Math.max(num, minValue), maxValue);
    onChange(clampedNum);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleDecrement} style={styles.button}>
          <Text style={styles.buttonText}><AntDesign name="minus" size={24} color="white" />
          </Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={value.toString()}
          onChangeText={handleTextChange}
          keyboardType="numeric"
        />
        
        <TouchableOpacity onPress={handleIncrement} style={styles.button}>
          <Text style={styles.buttonText}><AntDesign name="plus" size={24} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#000',
    width: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',

  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 8,
    width: 40,
    textAlign: 'center',
  },
});
