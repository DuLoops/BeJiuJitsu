import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface SequenceStep {
  intention: string;
  detailsArray: Array<{ detail: string }>;
}

interface SkillSequenceBuilderProps {
  sequences: SequenceStep[];
  setSequences: React.Dispatch<React.SetStateAction<SequenceStep[]>>;
}

const SkillSequenceBuilder: React.FC<SkillSequenceBuilderProps> = ({ sequences, setSequences }) => {
  const subduedTextColor = useThemeColor({}, 'text'); // For remove button text

  const handleAddSequenceStep = () => {
    setSequences([...sequences, { intention: '', detailsArray: [{ detail: '' }] }]);
  };

  const handleRemoveSequenceStep = (index: number) => {
    const newSequences = [...sequences];
    newSequences.splice(index, 1);
    setSequences(newSequences);
  };

  const handleSequenceIntentionChange = (text: string, index: number) => {
    const newSequences = [...sequences];
    newSequences[index].intention = text;
    setSequences(newSequences);
  };

  const handleAddDetailToStep = (seqIndex: number) => {
    const newSequences = [...sequences];
    newSequences[seqIndex].detailsArray.push({ detail: '' });
    setSequences(newSequences);
  };

  const handleRemoveDetailFromStep = (seqIndex: number, detailIndex: number) => {
    const newSequences = [...sequences];
    newSequences[seqIndex].detailsArray.splice(detailIndex, 1);
    setSequences(newSequences);
  };

  const handleSequenceDetailChange = (text: string, seqIndex: number, detailIndex: number) => {
    const newSequences = [...sequences];
    newSequences[seqIndex].detailsArray[detailIndex].detail = text;
    setSequences(newSequences);
  };

  return (
    <View>
      {sequences.map((sequence, seqIndex) => (
        <ThemedView key={seqIndex} style={styles.sequenceStepContainer}>
          <ThemedText style={styles.label}>Step {seqIndex + 1}</ThemedText>
          <ThemedInput
            label="Intention/Goal for this step:"
            value={sequence.intention}
            onChangeText={(text) => handleSequenceIntentionChange(text, seqIndex)}
            placeholder="e.g., Create distance, Secure grip"
            style={styles.input}
          />
          {sequence.detailsArray.map((detailItem, detailIndex) => (
            <ThemedView key={detailIndex} style={styles.detailContainer}>
              <ThemedInput
                label={`Detail ${detailIndex + 1}:`}
                value={detailItem.detail}
                onChangeText={(text) => handleSequenceDetailChange(text, seqIndex, detailIndex)}
                placeholder="e.g., Pummel for underhook"
                multiline
                style={styles.input}
              />
              {sequence.detailsArray.length > 1 && (
                 <TouchableOpacity onPress={() => handleRemoveDetailFromStep(seqIndex, detailIndex)} style={styles.removeButtonSmall}>
                  <ThemedText style={{color: subduedTextColor}}>Remove Detail</ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          ))}
          <ThemedButton title="Add Detail to Step" onPress={() => handleAddDetailToStep(seqIndex)} style={styles.addButtonSmall} />
           <TouchableOpacity onPress={() => handleRemoveSequenceStep(seqIndex)} style={styles.removeButton}>
            <ThemedText style={styles.removeButtonText}>Remove Step {seqIndex + 1}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ))}
      <ThemedButton title="Add Sequence Step" onPress={handleAddSequenceStep} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
  sequenceStepContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd', // Consider using theme color
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: 'transparent', // Ensure ThemedView controls its background
  },
  detailContainer: {
    paddingLeft: 10,
    marginTop: 5,
    backgroundColor: 'transparent',
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#ff6b6b', // Consider theme color for destructive action
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white', // Ensure contrast with button background
    fontWeight: 'bold',
  },
  addButtonSmall: {
    marginTop: 5,
    // Use default ThemedButton styling or add specific small button styles
    // e.g., paddingVertical: 8, paddingHorizontal: 12
  },
   removeButtonSmall: {
    marginTop: 5,
    backgroundColor: '#ffaaaa', // Consider theme color
    padding: 5,
    borderRadius: 3,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  // removeButtonTextSmall: { // This was in the original, ensure ThemedText above handles color
  //   color: '#555',
  //   fontSize: 12,
  // }
});

export default SkillSequenceBuilder; 