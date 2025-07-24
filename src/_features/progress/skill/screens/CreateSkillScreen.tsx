import CategoryPicker from '@/src/_features/progress/skill/components/CategoryPicker';
import SkillSequenceBuilder from '@/src/_features/progress/skill/components/sequence/SkillSequenceBuilder';
import SkillPicker from '@/src/_features/progress/skill/components/SkillPicker';
import { UserSkillWithDetails } from '@/src/_features/progress/skill/components/UserSkillList';
import {
  addUserSkillWithSequences,
  fetchCategories,
} from '@/src/_features/progress/skill/services/skillService';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ModalHeader from '@/src/components/ui/molecules/ModalHeader';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/store/authStore';
import { useSkillDataStore } from '@/src/store/skillDataStore';
import { getSkillFormDataForSubmission, SequenceStep, useUserSkillFormStore } from '@/src/store/userSkillFormStore';
import { Tables } from '@/src/supabase/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Alert, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

export default function CreateSkillScreen() {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ userSkill?: string, source?: 'TRAINING' | 'COMPETITION' }>();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  const {
    editingUserSkill,
    selectedCategory,
    newCategoryName,
    newSkillName,
    note,
    source,
    isFavorite,
    videoUrl,
    sequences,
    initializeForEdit,
    resetForm,
    setSelectedCategoryDirectly,
    setNewCategoryName,
    setNote,
    setSource,
    setIsFavorite,
    setVideoUrl,
    setSequences,
    handleCategorySelection,
    handleSkillInput,
  } = useUserSkillFormStore();

  const { allSkills, isLoadingAllSkills, errorAllSkills, fetchAllSkills } = useSkillDataStore();

  const userId = session?.user?.id;

  useEffect(() => {
    if (params.source) {
      setSource(params.source);
    } else {
      setSource('INDEPENDENT');
    }
  }, [params.source, setSource]);

  useEffect(() => {
    if (userId && allSkills.length === 0 && !isLoadingAllSkills && !errorAllSkills) {
      fetchAllSkills(userId);
    }
  }, [userId, allSkills.length, isLoadingAllSkills, fetchAllSkills, errorAllSkills]);

  useEffect(() => {
    if (params.userSkill) {
      try {
        const skillToEdit = JSON.parse(params.userSkill as string) as UserSkillWithDetails;
        initializeForEdit(skillToEdit, categoriesData);
      } catch (e) {
        console.error("Failed to parse userSkill for editing:", e);
        Alert.alert("Error", "Could not load skill data for editing.");
        resetForm();
      }
    } else {
      resetForm();
    }

    return () => {
      resetForm();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userSkill, initializeForEdit, resetForm]);

  const { data: categoriesData, isLoading: isLoadingCategories, isSuccess: categoriesLoaded } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (editingUserSkill && categoriesLoaded && categoriesData && !selectedCategory) {
      const categoryToSet = (categoriesData as Tables<'Category'>[]).find((c: Tables<'Category'>) => c.id === editingUserSkill.skill.categoryId);
      if (categoryToSet) {
        setSelectedCategoryDirectly(categoryToSet);
      }
    }
  }, [editingUserSkill, categoriesData, categoriesLoaded, selectedCategory, setSelectedCategoryDirectly]);

  const filteredSkillsForPicker = useMemo(() => {
    if (!selectedCategory) {
      return allSkills.map(skill => ({ id: skill.id, title: skill.name }));
    }
    return allSkills
      .filter(skill => skill.categoryId === selectedCategory.id)
      .map(skill => ({ id: skill.id, title: skill.name }));
  }, [allSkills, selectedCategory]);

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof addUserSkillWithSequences>[0] & { userSkillId?: string | null }) =>
                  addUserSkillWithSequences(data),
    onSuccess: () => {
      Alert.alert('Success', editingUserSkill ? 'Skill updated!' : 'Skill added to your profile!');
      queryClient.invalidateQueries({ queryKey: ['userSkillsWithDetails', userId] });
      if (userId) fetchAllSkills(userId);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/(protected)/(tabs)');
      }
    },
    onError: (error: Error) => {
      Alert.alert('Error', `Failed to ${editingUserSkill ? 'update' : 'add'} skill: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }

    const currentSkillFormState = useUserSkillFormStore.getState();
    const formData = getSkillFormDataForSubmission(currentSkillFormState);

    if (!formData.skillName) {
        Alert.alert('Validation Error', 'Please select or enter a skill name.');
        return;
    }
    if (!formData.categoryId && !formData.categoryName) {
        Alert.alert('Validation Error', 'Please select or create a category.');
        return;
    }
     if (formData.categoryId === null && !formData.categoryName) {
        Alert.alert('Validation Error', 'Please enter a name for the new category.');
        return;
    }

    const payload = {
      userId,
      userSkillId: formData.userSkillId,
      skillName: formData.skillName,
      categoryId: formData.categoryId,
      categoryName: formData.categoryName,
      note: formData.note,
      source: formData.source,
      isFavorite: formData.isFavorite,
      videoUrl: formData.videoUrl,
      sequences: formData.sequences,
    };

    mutation.mutate(payload);
  };

  const sourceOptions = ['TRAINING', 'COMPETITION', 'INDEPENDENT'].map((s) => ({ label: s, value: s }));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ModalHeader 
        title={editingUserSkill ? 'Edit Skill' : 'New Skill'}
        onSave={handleSubmit}
        saveDisabled={mutation.isPending || isLoadingCategories || isLoadingAllSkills}
      />
      
      <AutocompleteDropdownContextProvider>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          <ThemedText style={styles.sectionTitle}>Category:</ThemedText>
          {isLoadingCategories ? (
            <ActivityIndicator />
          ) : (
            <CategoryPicker
              onSelectCategory={handleCategorySelection}
              selectedCategory={selectedCategory}
              categories={categoriesData ? (categoriesData as Tables<'Category'>[]).map((c: Tables<'Category'>) => ({id: c.id, name: c.name})) : []}
            />
          )}

          <ThemedText style={[styles.label, styles.sectionTitle]}>Skill:</ThemedText>
          {(isLoadingAllSkills && allSkills.length === 0) ? (
            <ActivityIndicator />
          ) : errorAllSkills ? (
            <ThemedText style={{color: 'red'}}>Error loading skills.</ThemedText>
          ) : (
            <SkillPicker
              selectedCategory={selectedCategory}
              onSelectSkill={handleSkillInput}
              initialValue={newSkillName}
              categorySpecificSkills={filteredSkillsForPicker}
              disabled={isLoadingAllSkills}
            />
          )}

          <ThemedText style={[styles.label, styles.sectionTitle]}>Notes:</ThemedText>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            placeholder="Enter details, setups, variations..."
            style={styles.input}
          />

          <ThemedText style={styles.sectionTitle}>Skill Sequences/Steps (Optional)</ThemedText>
          <SkillSequenceBuilder
              sequences={sequences}
              setSequences={(valueOrUpdater) => {
                if (typeof valueOrUpdater === 'function') {
                  const updater = valueOrUpdater as (prevState: SequenceStep[]) => SequenceStep[];
                  const currentState = useUserSkillFormStore.getState().sequences;
                  setSequences(updater(currentState));
                } else {
                  setSequences(valueOrUpdater);
                }
              }}
          />

          {Platform.OS === 'ios' && (
            <ThemedButton 
              title="Close Modal" 
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.push('/(protected)/(tabs)');
                }
              }} 
              style={styles.button} 
            />
          )}
        </ScrollView>
      </AutocompleteDropdownContextProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    columnGap: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    backgroundColor: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  picker: {
    marginBottom: 15,
    height: Platform.OS === 'ios' ? 180 : 50,
    backgroundColor: '#f0f0f0',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 10,
  },
  button: {
    marginTop: 20,
  },
});
