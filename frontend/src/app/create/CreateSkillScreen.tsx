import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import React from 'react';
import { useSkillContext } from '@/src/context/SkillContext';
import { Accordion, AccordionItem } from '../../components/ui/Accordion';
import ChooseCategoryView from '../../components/create/skill/ChooseCategoryView';
import ChooseSkillView from '../../components/create/skill/ChooseSkillView';
import CreateSequenceView from '../../components/create/skill/CreateSequenceView';
import { useLocalSearchParams, router } from 'expo-router';
import { showAlert } from '@/src/utils/alert';
import { Button } from '@/src/components/ui/Button';
import { Text } from '@/src/components/ui/Text';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { Categories } from '@/src/constants/Skills';

const CreateSkillScreen = () => {
  const { newSkillState, newSkillDispatch, addSkill, isAddingSkill } = useSkillContext();
  const params = useLocalSearchParams<{ fromScreen: string }>();

  const handleCreateSkill = async () => {
    if (!newSkillState.skill.categoryId || !newSkillState.skill.name) {
      showAlert('Error', 'Please select a category and skill name');
      return;
    }

    try {
      await addSkill(params.fromScreen === 'CreateCompetitionScreen');
      if (params.fromScreen === 'CreateCompetitionScreen') {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Error creating skill:', error);
      showAlert('Error', 'Failed to create skill. Please try again.');
    }
  };

  const handleSequenceAccordionOpen = () => {
    if (newSkillState.userSkill.sequence.length === 0) {
      newSkillDispatch({ type: 'ADD_SEQUENCE_STEP' });
    }
  };

  const handleSequenceAccordionClose = () => {
    if (newSkillState.userSkill.sequence.length > 0) {
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

  // Find the selected category object based on categoryId
  const selectedCategory = newSkillState.skill.categoryId 
    ? Categories.find(cat => cat.id === newSkillState.skill.categoryId) || null
    : null;

  return (
    <AutocompleteDropdownContextProvider>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text variant="primary" style={styles.sectionTitle}>Create New Skill</Text>
          
          <View style={styles.categoryContainer}>
            <Text variant="primary">Category</Text>
            <ChooseCategoryView
              selectedCategory={selectedCategory}
              onSelectCategory={(category) => 
                newSkillDispatch({ type: 'SET_CATEGORY_ID', payload: category?.id || null })
              }
            />
          </View>

          <View style={styles.skillContainer}>
            <Text variant="primary">Skill Name</Text>
            <ChooseSkillView
              selectedCategory={selectedCategory}
              onSelectSkill={(skillName) => {
                newSkillDispatch({ type: 'SET_SKILL_NAME', payload: skillName });
              }}
            />
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text variant="primary" style={styles.sectionTitle}>Details</Text>
          <Accordion>
            <AccordionItem title="Note / Tip" initialIsOpen={true}>
              {(inputRef) => (
                <TextInput
                  ref={inputRef}
                  value={newSkillState.userSkill.note}
                  onChangeText={(text) => newSkillDispatch({ type: 'SET_NOTE', payload: text })}
                  placeholder="Add notes about this skill..."
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
                sequence={newSkillState.userSkill.sequence}
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

        <View style={styles.buttonContainer}>
          <Button
            title="Create Skill"
            onPress={handleCreateSkill}
            variant="primary"
            size="xl"
            disabled={isAddingSkill}
          />
        </View>
      </ScrollView>
    </AutocompleteDropdownContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  skillContainer: {
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginBottom: 32,
  }
});

export default CreateSkillScreen;
