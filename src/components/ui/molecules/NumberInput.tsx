import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import ThemedButton from '../atoms/ThemedButton';
import ThemedText from '../atoms/ThemedText';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  label?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  minValue = 0,
  maxValue = Infinity,
  label,
}) => {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  const handleIncrement = () => {
    if (value < maxValue) {
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
    const clampedNum = Math.min(Math.max(num, minValue), maxValue);
    onChange(clampedNum);
  };

  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label} type="caption">{label}</ThemedText>}
      <View style={styles.inputContainer}>
        <ThemedButton
          onPress={handleDecrement}
          title=""
          icon={<AntDesign name="minus" size={16} color={useThemeColor({}, 'text')} />}
          variant="outline"
          size="sm"
          style={styles.controlButton}
        />

        <TextInput
          style={[
            styles.input,
            { color: textColor, borderColor, backgroundColor }
          ]}
          value={value.toString()}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          editable={false} // Often safer to lock typing for simple counters, but keeping logic
        />

        <ThemedButton
          onPress={handleIncrement}
          title=""
          icon={<AntDesign name="plus" size={16} color={useThemeColor({}, 'text')} />}
          variant="outline"
          size="sm"
          style={styles.controlButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: 120, // Check if width constraint is needed
  },
  label: {
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 2, // Rectangular
  },
  input: {
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 50,
    textAlign: 'center',
    height: 32,
    fontSize: 14,
    fontFamily: 'System',
  },
});
