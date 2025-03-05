import { View, Text, TextInput, StyleSheet, Modal, ScrollView } from 'react-native'
import React, { useReducer } from 'react'
import { useSkillContext, SkillProvider } from '@/src/context/SkillContext';
import { SkillType, SkillInput, SequenceStep } from '@/src/types/skill'; // Import SkillInput and SequenceStep types
import { Accordion, AccordionItem } from '../../components/ui/Accordion'; // Import Accordion components
import UploadVideoAccordion from '../../components/create/skill/UploadVideoAccordion'; // Import UploadVideoAccordion
import ChooseCategoryView from '../../components/create/skill/ChooseCategoryView'
import ChooseSkillView from '../../components/create/skill/ChooseSkillView';
import CreateSequenceView from '../../components/create/skill/CreateSequenceView'; // Import CreateSequenceView
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { showAlert } from '@/src/utils/alert';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '@/src/components/ui/Button';

// Add type for navigation
type RootStackParamList = {
  Home: undefined;
  // Add other screens as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type ActionType =
  | { type: 'SET_NOTE'; payload: string }
  | { type: 'SET_VIDEO'; payload: string | null }
  | { type: 'SET_SEQUENCE'; payload: SequenceStep[] }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_SKILL'; payload: string }
  | { type: 'ADD_SEQUENCE_STEP' }
  | { type: 'REMOVE_SEQUENCE_STEP'; payload: number }
  | { type: 'UPDATE_SEQUENCE_STEP'; payload: { index: number; field: string; value: any } }
  | { type: 'ADD_STEP_DETAIL'; payload: number }
  | { type: 'REMOVE_STEP_DETAIL'; payload: { stepIndex: number; detailIndex: number } }
  | { type: 'UPDATE_STEP_DETAIL'; payload: { stepIndex: number; detailIndex: number; value: string } }
  | { type: 'CLEAR_SEQUENCE' };

const skillReducer = (state: SkillInput, action: ActionType): SkillInput => {
  switch (action.type) {
    case 'SET_NOTE':
      return { ...state, note: action.payload };
    case 'SET_VIDEO':
      return { ...state, video: action.payload };
    case 'SET_SEQUENCE':
      return { ...state, sequence: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_SKILL':
      return { ...state, selectedSkill: action.payload };
    case 'ADD_SEQUENCE_STEP':
      return {
        ...state,
        sequence: [
          ...state.sequence,
          {
            stepNumber: state.sequence.length + 1,
            intention: '',
            details: []
          }
        ]
      };
    case 'REMOVE_SEQUENCE_STEP':
      return {
        ...state,
        sequence: state.sequence.filter((_, index) => index !== action.payload)
      };
    case 'UPDATE_SEQUENCE_STEP':
      return {
        ...state,
        sequence: state.sequence.map((step, index) =>
          index === action.payload.index
            ? { ...step, [action.payload.field]: action.payload.value }
            : step
        )
      };
    case 'ADD_STEP_DETAIL':
      return {
        ...state,
        sequence: state.sequence.map((step, index) =>
          index === action.payload
            ? { ...step, details: [...step.details, ''] }
            : step
        )
      };
    case 'REMOVE_STEP_DETAIL':
      return {
        ...state,
        sequence: state.sequence.map((step, stepIndex) =>
          stepIndex === action.payload.stepIndex
            ? {
              ...step,
              details: step.details.filter((_, detailIndex) => detailIndex !== action.payload.detailIndex)
            }
            : step
        )
      };
    case 'UPDATE_STEP_DETAIL':
      return {
        ...state,
        sequence: state.sequence.map((step, stepIndex) =>
          stepIndex === action.payload.stepIndex
            ? {
              ...step,
              details: step.details.map((detail, detailIndex) =>
                detailIndex === action.payload.detailIndex ? action.payload.value : detail
              )
            }
            : step
        )
      };
    case 'CLEAR_SEQUENCE':
      return {
        ...state,
        sequence: []
      };
    default:
      return state;
  }
};

const CreateSkillScreen = () => {
  const [newSkill, dispatch] = useReducer(skillReducer, {
    note: '',
    video: null,
    sequence: [] as SequenceStep[], // Use SequenceStep type
    selectedCategory: null,
    selectedSkill: '',
  });

  const { addSkill } = useSkillContext();
  const navigation = useNavigation<NavigationProp>(); // Initialize navigation

  const handleAddSkill = async () => {


    const invalidStep = newSkill.sequence.find(
      step => step.intention.trim() === '' || step.details.some(detail => detail.trim() === '')
    );

    if (invalidStep) {
      showAlert('Error', 'All steps must have an intention and non-empty details.');
      return;
    }

    const skillToAdd: SkillType = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSkill.selectedSkill,
      category: newSkill.selectedCategory || 'none',
      note: newSkill.note,
      video: newSkill.video,
      sequence: newSkill.sequence,
    };

    await addSkill(skillToAdd);
    console.log('Skill added:', skillToAdd);
    navigation.navigate('Home'); // Changed from '/Home' to 'Home'
  };

  const handleSequenceAccordionOpen = () => {
    if (newSkill.sequence.length === 0) {
      dispatch({ type: 'ADD_SEQUENCE_STEP' });
    }
  };

  const handleSequenceAccordionClose = () => {
    console.log("close")
    if (newSkill.sequence.length > 0) {
      showAlert(
        'Clear Sequence',
        'Do you want to clear all sequence data?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => dispatch({ type: 'CLEAR_SEQUENCE' })
          },
        ]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select Category:</Text>
      <ChooseCategoryView
        selectedCategory={newSkill.selectedCategory}
        onSelectCategory={(category) => dispatch({ type: 'SET_CATEGORY', payload: category })}
      />
      <Text style={styles.label}>Select Skill:</Text>
      <ChooseSkillView selectedCategory={newSkill.selectedCategory} onSelectSkill={(skill: string) => dispatch({ type: 'SET_SKILL', payload: skill })} />
      <View style={styles.detailsContainer}>
        <Text style={{ textAlign: 'center', paddingTop: 20 }}>Details</Text>
        <Accordion>
          <AccordionItem title="Note / Tip" initialIsOpen={true}>
            {(inputRef) => (
              <TextInput
                ref={inputRef}
                value={newSkill.note}
                onChangeText={(text) => dispatch({ type: 'SET_NOTE', payload: text })}
                placeholder="Note"
                multiline
                style={styles.textArea}
              />
            )}
          </AccordionItem>
          {/* For future video implementation */}
          {/*
          <UploadVideoAccordion
            video={video}
            setVideoModalVisible={setVideoModalVisible}
          /> */}
          <AccordionItem 
            title="Sequence" 
            onOpen={handleSequenceAccordionOpen}
            onClose={handleSequenceAccordionClose}
          >
            <CreateSequenceView
              sequence={newSkill.sequence}
              onAddStep={() => dispatch({ type: 'ADD_SEQUENCE_STEP' })}
              onRemoveStep={(index) => dispatch({ type: 'REMOVE_SEQUENCE_STEP', payload: index })}
              onUpdateStep={(index, field, value) =>
                dispatch({ type: 'UPDATE_SEQUENCE_STEP', payload: { index, field, value } })}
              onAddDetail={(stepIndex) => dispatch({ type: 'ADD_STEP_DETAIL', payload: stepIndex })}
              onRemoveDetail={(stepIndex, detailIndex) =>
                dispatch({ type: 'REMOVE_STEP_DETAIL', payload: { stepIndex, detailIndex } })}
              onUpdateDetail={(stepIndex, detailIndex, value) =>
                dispatch({ type: 'UPDATE_STEP_DETAIL', payload: { stepIndex, detailIndex, value } })}
            />
          </AccordionItem>
        </Accordion>
      </View>
      <Button 
        title="Add Skill" 
        onPress={handleAddSkill}
        size="xl"
        variant="primary" 
      />

      {/* Modal buttons */}
      {/* <Modal
        // ...existing modal code...
        <View style={styles.modalContent}>
          <Text>Upload your video here</Text>
          <Button
            title="Upload"
            onPress={() => handleVideoUpload('sample-video.mp4')}
            size="md"
            variant="primary"
          />
          <Button
            title="Close"
            onPress={() => setVideoModalVisible(false)}
            size="md"
            variant="outline"
          />
        </View>
      </Modal> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // display: 'flex',
    // flexDirection: 'column',
    // gap: 10
    flex: 1,
    position: 'relative',
    zIndex: 0,
    gap: 5
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white', // Set background color to white
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    height: 150,
    textAlignVertical: 'top',
    borderRadius: 5,
    backgroundColor: 'white', // Set background color to white
  },
  detailsContainer: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});

const App = () => (
  <SkillProvider>
    <CreateSkillScreen />
  </SkillProvider>
);

export default App;
