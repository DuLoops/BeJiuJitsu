import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { NumberInput } from '@/src/components/ui/molecules/NumberInput';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Enums } from '@/src/supabase/types';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

type BeltType = Enums<'Belts'>;

interface SelectRankProps {
  belt: BeltType;
  stripes: number;
  onBeltChange: (belt: BeltType) => void;
  onStripesChange: (stripes: number) => void;
}

const BELT_DEFINITIONS: { label: string; value: BeltType; color: string; borderColor?: string; textColor?: string }[] = [
  { label: 'White', value: 'WHITE', color: '#FFFFFF', borderColor: '#E5E7EB', textColor: '#374151' },
  { label: 'Blue', value: 'BLUE', color: '#2563EB', textColor: '#FFFFFF' },
  { label: 'Purple', value: 'PURPLE', color: '#7C3AED', textColor: '#FFFFFF' },
  { label: 'Brown', value: 'BROWN', color: '#78350F', textColor: '#FFFFFF' },
  { label: 'Black', value: 'BLACK', color: '#111827', textColor: '#FFFFFF' },
];

export const SelectRank: React.FC<SelectRankProps> = ({
  belt,
  stripes,
  onBeltChange,
  onStripesChange,
}) => {
  const selectedBorderColor = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.label}>Belt Rank</ThemedText>
        <ThemedView style={styles.beltContainer}>
          {BELT_DEFINITIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => onBeltChange(option.value)}
              style={[
                styles.beltOption,
                { backgroundColor: option.color },
                option.borderColor && { borderColor: option.borderColor, borderWidth: 1 },
                belt === option.value && [styles.selectedBelt, { borderColor: selectedBorderColor }],
              ]}
            >
              <ThemedText
                style={[
                  styles.beltLabel,
                  { color: option.textColor || '#FFFFFF' },
                ]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText style={styles.label}>Stripes</ThemedText>
        <NumberInput
          value={stripes}
          onChange={onStripesChange}
          minValue={0}
          maxValue={4}
        />
      </ThemedView>
    </ThemedView>
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
  },
});

export default SelectRank;
