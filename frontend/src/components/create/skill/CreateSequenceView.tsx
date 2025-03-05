import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import { Button } from '@/src/components/ui/Button';

interface CreateSequenceViewProps {
  sequence: SequenceStep[];
  onAddStep: () => void;
  onRemoveStep: (index: number) => void;
  onUpdateStep: (index: number, field: string, value: any) => void;
  onAddDetail: (stepIndex: number) => void;
  onRemoveDetail: (stepIndex: number, detailIndex: number) => void;
  onUpdateDetail: (stepIndex: number, detailIndex: number, value: string) => void;
}

const CreateSequenceView: React.FC<CreateSequenceViewProps> = ({
  sequence,
  onAddStep,
  onRemoveStep,
  onUpdateStep,
  onAddDetail,
  onRemoveDetail,
  onUpdateDetail,
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const intentionInputRefs = useRef([]);

  const handleAddStep = () => {
    if (sequence[sequence.length - 1]?.intention.trim() === '') {
      setHighlightedIndex(sequence.length - 1);
      Alert.alert('Error', 'Intention is required before adding a new step.');
      return;
    }
    setHighlightedIndex(null);
    onAddStep();
    setTimeout(() => {
      intentionInputRefs.current[sequence.length]?.focus();
    }, 100);
  };

  return (
    <ScrollView style={styles.container}>
      {sequence.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.stepIntention}>
            <Text style={styles.stepLabel}>{step.stepNumber}.</Text>
            <TextInput
              ref={(el) => (intentionInputRefs.current[index] = el)}
              placeholder="Type your intention"
              value={step.intention}
              onChangeText={(text) => onUpdateStep(index, 'intention', text)}
              style={[
                styles.input,
                styles.intentionInput,
                highlightedIndex === index && styles.highlightedInput,
              ]}
              multiline={true}
            />
          </View>
          {step.details.map((detail, detailIndex) => (
            <View key={detailIndex} style={styles.detailContainer}>
              <Text style={styles.stepDetailLabel}>{'\u2022'}</Text>
              <TextInput
                style={styles.detailInput}
                value={detail}
                onChangeText={(text) => onUpdateDetail(index, detailIndex, text)}
                placeholder="Add detail"
                multiline
              />
            </View>
          ))}
          <Button
            title="Add Detail"
            onPress={() => onAddDetail(index)}
            size="sm"
            variant="outline"
          />
        </View>
      ))}
      <Button 
        title={`Add Step ${sequence.length + 1}`} 
        onPress={handleAddStep}
        size="xl"
        variant="secondary" 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContainer: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  stepIntention: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepLabel: {
    fontWeight: 'bold',
    margin: 5,
  },
  stepDetailLabel: {
    fontWeight: 'bold',
    margin: 5,
    paddingLeft: 10,
    fontSize: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 5,
    width: '100%',
  },
  intentionInput: {
    height: 100, // Set bigger height for intention input
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  smallButton: {
    width: '50px', // Set smaller width for buttons
  },
  button: {
    textTransform: 'none', // Ensure button text is not all capitalized
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  removeButton: {
    backgroundColor: 'pink',
    padding: 5,
    borderRadius: 5,
  },
  removeStepButton: {
    backgroundColor: 'pink',
    padding: 5,
    borderRadius: 5,
  },
  highlightedInput: {
    borderColor: 'red',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  detailInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default CreateSequenceView;
