import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type CompetitionType = 'gi' | 'nogi' | 'both';

interface Props {
  value: CompetitionType;
  onValueChange: (value: CompetitionType) => void;
}

export const ChooseTypeView: React.FC<Props> = ({ value, onValueChange }) => {
  const RadioOption = ({ optionValue, label }: { optionValue: CompetitionType; label: string }) => (
    <TouchableOpacity 
      style={styles.radioItem} 
      onPress={() => onValueChange(optionValue)}
    >
      <View style={styles.radio}>
        {value === optionValue && <View style={styles.selected} />}
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <Text>Competition Type</Text>
      <View style={styles.radioRow}>
        <RadioOption optionValue="gi" label="Gi" />
        <RadioOption optionValue="nogi" label="No Gi" />
        <RadioOption optionValue="both" label="Both" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginVertical: 8,
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
});
