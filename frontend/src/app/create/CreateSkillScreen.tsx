import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { useSkillContext } from '@/src/context/SkillContext';
import { SkillType } from '@/src/types/skill';
import { Accordion, AccordionItem } from '../../components/ui/Accordion';
import ChooseCategoryView from '../../components/create/skill/ChooseCategoryView';
import ChooseSkillView from '../../components/create/skill/ChooseSkillView';
import CreateSequenceView from '../../components/create/skill/CreateSequenceView';
import { useNavigation } from '@react-navigation/native';
import { showAlert } from '@/src/utils/alert';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '@/src/components/ui/Button';
import { createSkillFromInput } from '@/src/reducers/skillReducer';

// Add type for navigation
type RootStackParamList = {
  Home: undefined;
  CompetitionRecord?: { skillId?: string };
  // Add other screens as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const CreateSkillScreen = ({ route }: any) => {
  // Get the fromScreen param to know where the user came from
  const fromScreen = route?.params?.fromScreen || null;
  
  // Use the global state and dispatch from context
  const { addSkill, newSkillState, newSkillDispatch } = useSkillContext();
  const navigation = useNavigation<NavigationProp>();

  const handleAddSkill = async () => {
    const invalidStep = newSkillState.sequence.find(
      step => step.intention.trim() === '' || step.details.some(detail => detail.trim() === '')
    );

    if (invalidStep) {
      showAlert('Error', 'All steps must have an intention and non-empty details.');
      return;
    }

    // Convert input state to SkillType
    const skillToAdd = createSkillFromInput(newSkillState);

    try {
      await addSkill(skillToAdd);
      console.log('Skill added:', skillToAdd);
      
      // If we came from CompetitionRecord screen, navigate back there with the new skill id
      if (fromScreen === 'CreateCompetitionScreen') {
        navigation.navigate('/create/CreateCompetitionScreen', { skillId: skillToAdd.id });
      } else {
        // Otherwise go to Home
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Failed to add skill:', error);
      showAlert('Error', 'Failed to add skill. Please try again.');
    }
  };

  const handleSequenceAccordionOpen = () => {
    if (newSkillState.sequence.length === 0) {
      newSkillDispatch({ type: 'ADD_SEQUENCE_STEP' });
    }
  };

  const handleSequenceAccordionClose = () => {
    if (newSkillState.sequence.length > 0) {
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
            onPress: () => newSkillDispatch({ type: 'CLEAR_SEQUENCE' })
          },
        ]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select Category:</Text>
      <ChooseCategoryView
        selectedCategory={newSkillState.selectedCategory}
        onSelectCategory={(category) => newSkillDispatch({ type: 'SET_CATEGORY', payload: category })}
      />
      <Text style={styles.label}>Select Skill:</Text>
      <ChooseSkillView 
        selectedCategory={newSkillState.selectedCategory} 
        onSelectSkill={(skill: string) => newSkillDispatch({ type: 'SET_SKILL', payload: skill })} 
      />
      <View style={styles.detailsContainer}>
        <Text style={{ textAlign: 'center', paddingTop: 20 }}>Details</Text>
        <Accordion>
          <AccordionItem title="Note / Tip" initialIsOpen={true}>
            {(inputRef) => (
              <TextInput
                ref={inputRef}
                value={newSkillState.note}
                onChangeText={(text) => newSkillDispatch({ type: 'SET_NOTE', payload: text })}
                placeholder="Note"
                multiline
                style={styles.textArea}
              />
            )}
          </AccordionItem>
          <AccordionItem 
            title="Sequence" 
            onOpen={handleSequenceAccordionOpen}
            onClose={handleSequenceAccordionClose}
          >
            <CreateSequenceView
              sequence={newSkillState.sequence}
              onAddStep={() => newSkillDispatch({ type: 'ADD_SEQUENCE_STEP' })}
              onRemoveStep={(index) => newSkillDispatch({ type: 'REMOVE_SEQUENCE_STEP', payload: index })}
              onUpdateStep={(index, field, value) =>
                newSkillDispatch({ type: 'UPDATE_SEQUENCE_STEP', payload: { index, field, value } })}
              onAddDetail={(stepIndex) => newSkillDispatch({ type: 'ADD_STEP_DETAIL', payload: stepIndex })}
              onRemoveDetail={(stepIndex, detailIndex) =>
                newSkillDispatch({ type: 'REMOVE_STEP_DETAIL', payload: { stepIndex, detailIndex } })}
              onUpdateDetail={(stepIndex, detailIndex, value) =>
                newSkillDispatch({ type: 'UPDATE_STEP_DETAIL', payload: { stepIndex, detailIndex, value } })}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
    backgroundColor: 'white',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    height: 150,
    textAlignVertical: 'top',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  detailsContainer: {
    padding: 10,
  },
});

export default CreateSkillScreen;
