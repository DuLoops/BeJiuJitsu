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
    <View>
      <View style={styles.radioRow}>
        <RadioOption optionValue="gi" label="Gi" />
        <RadioOption optionValue="nogi" label="No Gi" />
        <RadioOption optionValue="both" label="Both" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  radioRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 8,
    gap: 8,
    padding: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
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
