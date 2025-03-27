import { View, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { useSkillContext, createSkillFromInput } from '@/src/context/SkillContext';
import { Accordion, AccordionItem } from '../../components/ui/Accordion';
import ChooseCategoryView from '../../components/create/skill/ChooseCategoryView';
import ChooseSkillView from '../../components/create/skill/ChooseSkillView';
import CreateSequenceView from '../../components/create/skill/CreateSequenceView';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { showAlert } from '@/src/utils/alert';
import { Button } from '@/src/components/ui/Button';
import { Text } from '@/src/components/ui/Text';
import { TextInput } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

const CreateSkillScreen = () => {
  // Get params using Expo Router's useLocalSearchParams
  const params = useLocalSearchParams();
  const fromScreen = params.fromScreen || null;
  
  // Use the global state and dispatch from context
    const { addSkill, newSkillState, newSkillDispatch } = useSkillContext();

  const handleAddSkill = async () => {
    console.log('Creating skill with state:', JSON.stringify(newSkillState));
    
    // Validate required fields
    if (!newSkillState.category) {
      showAlert('Error', 'Please select a category.');
      return;
    }
    
    if (!newSkillState.name || newSkillState.name.trim() === '') {
      showAlert('Error', 'Please enter a skill name.');
      return;
    }
    
    const invalidStep = newSkillState.sequence.find(
      step => step.intention.trim() === '' || step.details.some(detail => detail.trim() === '')
    );

    if (invalidStep) {
      showAlert('Error', 'All steps must have an intention and non-empty details.');
      return;
    }

    // Convert input state to SkillType
    const skillToAdd = createSkillFromInput(newSkillState);
    console.log('Skill after conversion:', JSON.stringify(skillToAdd));

    try {
      await addSkill(skillToAdd);
      console.log('Skill added successfully:', skillToAdd);
      
      // If we came from CompetitionScreen, navigate back there with the new skill id
      if (fromScreen === 'CreateCompetitionScreen') {
        router.back();
        // This doesn't pass the new skill ID back, but we'll rely on the context's recentlyCreatedSkills
      } else {
        // Otherwise go to Home
        router.replace("/");
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
    <AutocompleteDropdownContextProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Select Category:</Text>
        <ChooseCategoryView
          selectedCategory={newSkillState.category}
          onSelectCategory={(category) => newSkillDispatch({ type: 'SET_CATEGORY', payload: category })}
        />
        <Text style={styles.label}>Skill name:</Text>
        <ChooseSkillView 
          selectedCategory={newSkillState.category} 
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
    </AutocompleteDropdownContextProvider>
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
    zIndex: 0,
  },
});

export default CreateSkillScreen;
