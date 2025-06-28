import CategoryPicker from '@/src/_features/skill/components/CategoryPicker';
import SkillSequenceBuilder from '@/src/_features/skill/components/sequence/SkillSequenceBuilder';
import SkillPicker from '@/src/_features/skill/components/SkillPicker';
import { UserSkillWithDetails } from '@/src/_features/skill/components/UserSkillList';
import {
    addUserSkillWithSequences,
    fetchCategories,
} from '@/src/_features/skill/services/skillService';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/store/authStore';
import { useSkillDataStore } from '@/src/store/skillDataStore';
import { getSkillFormDataForSubmission, SequenceStep, useUserSkillFormStore } from '@/src/store/userSkillFormStore';
import { Category, CategoryEnum, SkillNameEnum, UserSkillSourceEnum } from '@/src/types/skills';
import { Picker } from '@react-native-picker/picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Switch } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

export default function CreateSkillScreen() {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const tintColor = useThemeColor({}, 'tint');

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

  const { data: categoriesData, isLoading: isLoadingCategories, isSuccess: categoriesLoaded } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (editingUserSkill && categoriesLoaded && categoriesData && !selectedCategory) {
      const categoryToSet = categoriesData.find(c => c.id === editingUserSkill.skill.categoryId);
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
      router.back();
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
      skillName: formData.skillName as SkillNameEnum | string,
      categoryId: formData.categoryId,
      categoryName: formData.categoryName as CategoryEnum | string,
      note: formData.note,
      source: formData.source,
      isFavorite: formData.isFavorite,
      videoUrl: formData.videoUrl,
      sequences: formData.sequences,
    };

    mutation.mutate(payload);
  };

  const sourceOptions = Object.values(UserSkillSourceEnum).map((s) => ({ label: s, value: s }));

  return (
    <AutocompleteDropdownContextProvider>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedView style={styles.innerContainer}>
          <ThemedText style={styles.title}>{editingUserSkill ? 'Edit Skill' : 'Add New Skill'}</ThemedText>

          <ThemedText style={styles.label}>Category:</ThemedText>
          {isLoadingCategories ? (
            <ActivityIndicator />
          ) : (
            <CategoryPicker
              onSelectCategory={handleCategorySelection}
              selectedCategory={selectedCategory}
              categories={categoriesData ? categoriesData.map(c => ({id: c.id, name: c.name})) : []}
            />
          )}

          <ThemedText style={styles.label}>Skill:</ThemedText>
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

          <ThemedInput
            label="Notes:"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            placeholder="Enter details, setups, variations..."
            style={[styles.input, styles.textArea]}
          />

          <ThemedText style={styles.label}>Source:</ThemedText>
          <Picker
            selectedValue={source}
            onValueChange={(itemValue) => setSource(itemValue)}
            style={styles.picker}
          >
            {sourceOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>

          <ThemedView style={styles.switchContainer}>
            <ThemedText style={styles.label}>Favorite:</ThemedText>
            <Switch value={isFavorite} onValueChange={setIsFavorite} trackColor={{ false: "#767577", true: tintColor }} thumbColor={isFavorite ? tintColor : "#f4f3f4"} />
          </ThemedView>

          <ThemedInput
            label="Video URL (optional):"
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholder="https://youtube.com/example_video"
            keyboardType="url"
            autoCapitalize="none"
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

          <ThemedButton
            title={mutation.isPending ? (editingUserSkill ? 'Updating Skill...' : 'Adding Skill...') : (editingUserSkill ? 'Update Skill' : 'Add Skill')}
            onPress={handleSubmit}
            disabled={mutation.isPending || isLoadingCategories || isLoadingAllSkills}
            style={styles.button}
          />
          {Platform.OS === 'ios' && <ThemedButton title="Close Modal" onPress={() => router.back()} style={styles.button} />}
        </ThemedView>
      </ScrollView>
    </AutocompleteDropdownContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    marginBottom: 15,
  },
  textArea: {
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
