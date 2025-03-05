import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NumberInput } from './NumberInput';
import { Belt } from '@/src/types/user';

interface SelectRankProps {
  belt: Belt;
  stripes: number;
  onBeltChange: (belt: Belt) => void;
  onStripesChange: (stripes: number) => void;
}

const BELT_OPTIONS = [
  { label: 'White', value: 'WHITE', color: '#FFFFFF', borderColor: '#E5E7EB' },
  { label: 'Blue', value: 'BLUE', color: '#2563EB' },
  { label: 'Purple', value: 'PURPLE', color: '#7C3AED' },
  { label: 'Brown', value: 'BROWN', color: '#78350F' },
  { label: 'Black', value: 'BLACK', color: '#111827' },
];

export const SelectRank: React.FC<SelectRankProps> = ({
  belt,
  stripes,
  onBeltChange,
  onStripesChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Belt Rank</Text>
        <View style={styles.beltContainer}>
          {BELT_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => onBeltChange(option.value as Belt)}
              style={[
                styles.beltOption,
                { backgroundColor: option.color },
                option.borderColor && { borderColor: option.borderColor, borderWidth: 1 },
                belt === option.value && styles.selectedBelt,
              ]}
            >
              <Text
                style={[
                  styles.beltLabel,
                  { color: option.value === 'WHITE' ? '#374151' : '#FFFFFF' },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Stripes</Text>
        <NumberInput
          value={stripes}
          onChange={onStripesChange}
          minValue={0}
          maxValue={4}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  beltContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  beltOption: {
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedBelt: {
    transform: [{scale: 1.02}],
    borderWidth: 2,
    borderColor: '#DC2626', // Red border
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  beltLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SelectRank;
