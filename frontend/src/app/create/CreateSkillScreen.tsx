import { View, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useLayoutEffect } from 'react';
import { useSkillContext } from '@/src/context/SkillContext';
import { Accordion, AccordionItem } from '../../components/ui/Accordion';
import ChooseCategoryView from '../../components/create/skill/ChooseCategoryView';
import ChooseSkillView from '../../components/create/skill/ChooseSkillView';
import CreateSequenceView from '../../components/create/skill/CreateSequenceView';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { router } from 'expo-router';
import { showAlert } from '@/src/utils/alert';
import { Button } from '@/src/components/ui/Button';
import { Text } from '@/src/components/ui/Text';
import { TextInput } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { Categories } from '@/src/constants/Skills';
import { NewUserSkillDataType, UserSkillType } from '@/src/types/skillType';
import { useDeleteUserSkill } from '@/src/services/userSkillService';

const CreateSkillScreen = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const fromScreen = params.fromScreen || null;
  const skillToEdit = params.skillToEdit ? JSON.parse(params.skillToEdit as string) as NewUserSkillDataType : null;
  const { addSkill, updateSkill, newSkillState, newSkillDispatch } = useSkillContext();
  const deleteSkillMutation = useDeleteUserSkill();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: skillToEdit ? "Edit Skill" : "Create Skill"
    });
  }, [navigation, skillToEdit]);

  useEffect(() => {
    console.log('skillToEdit', skillToEdit);
    console.log('newSkillState', newSkillState);
    if (skillToEdit) {
      // Initialize form with existing skill data
      // newSkillDispatch({ type: 'SET_CATEGORY_ID', payload: skillToEdit.skill.categoryId });
      // newSkillDispatch({ type: 'SET_SKILL_NAME', payload: skillToEdit.skill.name });
      // newSkillDispatch({ type: 'SET_SKILL_ID', payload: skillToEdit.id });
      // newSkillDispatch({ type: 'SET_NOTE', payload: skillToEdit.note || '' });
      // newSkillDispatch({ type: 'SET_VIDEO', payload: skillToEdit.videoUrl });
      // newSkillDispatch({ type: 'SET_SEQUENCE', payload: skillToEdit.sequence });
      newSkillDispatch({ type: 'SET_SKILL_TO_EDIT', payload: skillToEdit });
    }
  }, [skillToEdit]);

  const handleSaveSkill = async () => {
    // Validate required fields
    if (!newSkillState.skill.categoryId) {
      showAlert('Error', 'Please select a category.');
      return;
    }
    
    if (!newSkillState.skill.name || newSkillState.skill.name.trim() === '') {
      showAlert('Error', 'Please enter a skill name.');
      return;
    }
    
 

    try {
      if (skillToEdit) {
        await updateSkill(skillToEdit.skill.id);
        console.log('Skill updated successfully');
      } else {
        await addSkill(fromScreen === 'CreateCompetitionScreen');
        console.log('Skill added successfully');
      }
      
      // Navigate based on fromScreen
      if (fromScreen === 'CreateCompetitionScreen') {
        router.back();
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error('Failed to save skill:', error);
      showAlert('Error', `Failed to ${skillToEdit ? 'update' : 'add'} skill. Please try again.`);
    }
  };

  const handleDeleteSkill = () => {
    if (!skillToEdit) return;

    showAlert(
      'Delete Skill',
      'Are you sure you want to delete this skill? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSkillMutation.mutateAsync(skillToEdit.skill.id);
              console.log('Skill deleted successfully');
              if (fromScreen === 'CreateCompetitionScreen') {
                router.back();
              } else {
                router.replace("/");
              }
            } catch (error) {
              console.error('Failed to delete skill:', error);
              showAlert('Error', 'Failed to delete skill. Please try again.');
            }
          },
        },
      ]
    );
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Select Category:</Text>
        <ChooseCategoryView
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => 
            newSkillDispatch({ 
              type: 'SET_CATEGORY_ID', 
              payload: category?.id || '' 
            })
          }
          disabled={!!skillToEdit}
        />
        <Text style={styles.label}>Skill name:</Text>
        <ChooseSkillView 
          selectedCategory={selectedCategory}
          onSelectSkill={(skillName) => newSkillDispatch({ type: 'SET_SKILL_NAME', payload: skillName })}
          disabled={!!skillToEdit}
          initialValue={skillToEdit?.skill.name}
        />
        <View style={styles.detailsContainer}>
          <Text style={{ textAlign: 'center', paddingTop: 20 }}>Details</Text>
          <Accordion>
            <AccordionItem title="Note / Tip" initialIsOpen={true}>
              {(inputRef) => (
                <TextInput
                  ref={inputRef}
                  value={newSkillState.userSkill.note}
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
            title={skillToEdit ? "Update Skill" : "Add Skill"}
            onPress={handleSaveSkill}
            size="xl"
            variant="primary" 
          />
          {skillToEdit && (
            <Button 
              title="Delete Skill"
              onPress={handleDeleteSkill}
              size="xl"
              variant="outline"
              style={styles.deleteButton}
            />
          )}
        </View>
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
  buttonContainer: {
    gap: 10,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  }
});

export default CreateSkillScreen;
