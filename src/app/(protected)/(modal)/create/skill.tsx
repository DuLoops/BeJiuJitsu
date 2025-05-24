import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/src/context/AuthContext';
import {
  fetchCategories,
  fetchSkills,
  addUserSkillWithSequences,
  // We might need an updateUserSkillWithSequences or adapt addUserSkillWithSequences
} from '@/src/features/skill/services/skillService';
import { Category, Skill, UserSkillSourceEnum, CategoryEnum, SkillNameEnum, UserSkill } from '@/src/types/skills'; // Added UserSkill
import { UserSkillWithDetails } from '@/src/features/skill/components/UserSkillList'; // For edit mode
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { Picker } from '@react-native-picker/picker';
import { Switch } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router'; // Added useLocalSearchParams

export default function CreateSkillScreen() {
  const auth = useContext(AuthContext);
  const queryClient = useQueryClient();
  const params = useLocalSearchParams(); // Get route parameters

  const [editingUserSkill, setEditingUserSkill] = useState<UserSkillWithDetails | null>(null);

  // Form State
  const [userSkillId, setUserSkillId] = useState<string | null>(null); // For editing
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [note, setNote] = useState('');
  const [source, setSource] = useState<UserSkillSourceEnum | string>(
    UserSkillSourceEnum.CLASS
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [sequences, setSequences] = useState<Array<{ intention: string; detailsArray: Array<{ detail: string }> }>>([]);

  const userId = auth?.session?.user?.id;

  useEffect(() => {
    if (params.userSkill) {
      try {
        const skillToEdit = JSON.parse(params.userSkill as string) as UserSkillWithDetails;
        setEditingUserSkill(skillToEdit);
        setUserSkillId(skillToEdit.id); // Keep track of the ID for update
        // Pre-fill form states
        // Note: For category and skill, we set the ID. The Picker should then select it.
        // If the skill/category was custom, this setup might need adjustment or rely on names.
        setSelectedCategoryId(skillToEdit.skill.categoryId);
        // setSelectedSkillId(skillToEdit.skillId); // This is tricky if the skill was custom and not in the predefined list.
                                                // For simplicity, we'll rely on skillName and categoryId for addOrUpdateUserSkill to find/create.
        setNewSkillName(skillToEdit.skill.name); // If it's an existing skill, addOrUpdate should find it by name + category
        setNote(skillToEdit.note || '');
        setSource(skillToEdit.source || UserSkillSourceEnum.CLASS);
        setIsFavorite(skillToEdit.isFavorite || false);
        setVideoUrl(skillToEdit.videoUrl || '');
        
        const loadedSequences = skillToEdit.sequences?.map(seq => ({
          intention: seq.intention || '',
          detailsArray: seq.details?.map(d => ({ detail: d.detail })) || [{ detail: '' }]
        })) || [];
        setSequences(loadedSequences.length > 0 ? loadedSequences : []);

      } catch (e) {
        console.error("Failed to parse userSkill for editing:", e);
        Alert.alert("Error", "Could not load skill data for editing.");
      }
    }
  }, [params.userSkill]);

  // Fetching Data with React Query
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryKeyHash: 'categories',
    queryFn: fetchCategories,
  });

  const { data: skills, isLoading: isLoadingSkills } = useQuery<Skill[], Error>({
    queryKey: ['skills', selectedCategoryId], // Re-fetch if selectedCategoryId changes
    queryKeyHash: `skills-${selectedCategoryId}`,
    queryFn: () => fetchSkills(selectedCategoryId || undefined),
    enabled: !!selectedCategoryId, // Only fetch skills if a category is selected
  });

  // Mutation for adding/updating UserSkill
  const mutation = useMutation({
    // TODO: The service function needs to correctly handle updates.
    // This might involve checking if userSkillId is present and calling a different Supabase function (e.g., upsert or update).
    // For now, we assume addUserSkillWithSequences can handle this if `userSkillId` is part of the payload,
    // or a new service function `updateUserSkillWithSequences` is created and used here.
    mutationFn: (data: Parameters<typeof addUserSkillWithSequences>[0] & { userSkillId?: string | null }) => 
                  addUserSkillWithSequences(data), // Pass userSkillId if available
    onSuccess: () => {
      Alert.alert('Success', editingUserSkill ? 'Skill updated!' : 'Skill added to your profile!');
      queryClient.invalidateQueries({ queryKey: ['userSkillsWithDetails', userId] }); // Ensure this key is used in UserSkillList
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      router.back();
    },
    onError: (error: Error) => {
      Alert.alert('Error', `Failed to ${editingUserSkill ? 'update' : 'add'} skill: ${error.message}`);
    },
  });

  // Sequence UI Handlers
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


  const handleSubmit = () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }

    let skillNameToSubmit = newSkillName; // Default to newSkillName
    // If an existing skill was selected from picker, its name should be used.
    // This logic might need refinement if editingUserSkill.skill.name is from a predefined list and selectedSkillId is used.
    if (selectedSkillId && !newSkillName) { // If existing skill selected and newSkillName is not manually overridden
        const existingSkill = skills?.find(s => s.id === selectedSkillId);
        if (existingSkill) skillNameToSubmit = existingSkill.name;
    } else if (editingUserSkill && !newSkillName && !selectedSkillId) { // If editing and no changes to skill name/selection
        skillNameToSubmit = editingUserSkill.skill.name;
    }


    let categoryIdToSubmit = selectedCategoryId;
    let categoryNameToSubmit = newCategoryName; // Default to newCategoryName
    // Similar logic for category
    if (editingUserSkill && !newCategoryName && !selectedCategoryId) {
        categoryIdToSubmit = editingUserSkill.skill.categoryId;
    }


    if (!categoryIdToSubmit && !categoryNameToSubmit) {
        Alert.alert('Validation Error', 'Please select or create a category.');
        return;
    }
    if (!skillNameToSubmit) { // Check if skillNameToSubmit ended up empty
        Alert.alert('Validation Error', 'Please select or create a skill name.');
        return;
    }
    
    const payload = {
      userId,
      userSkillId: userSkillId, // Pass this for updates
      skillName: skillNameToSubmit as SkillNameEnum | string,
      categoryId: categoryIdToSubmit, 
      categoryName: categoryNameToSubmit as CategoryEnum | string, // Pass this if selectedCategoryId is 'new_category'
      note,
      source,
      isFavorite,
      videoUrl,
      sequences: sequences.filter(s => s.intention?.trim() || s.detailsArray.some(d => d.detail.trim())),
    };
    
    mutation.mutate(payload);
  };

  // Predefined sources for Picker
  const sourceOptions = Object.values(UserSkillSourceEnum).map((s) => ({ label: s, value: s }));
  const categoryOptions = Object.values(CategoryEnum).map(c => ({ label: c, value: c }));
  const skillNameOptions = Object.values(SkillNameEnum).map(s => ({ label: s, value: s }));


  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <ThemedView style={styles.innerContainer}>
        <ThemedText style={styles.title}>{editingUserSkill ? 'Edit Skill' : 'Add New Skill'}</ThemedText>

        {/* Category Selection */}
        <ThemedText style={styles.label}>Category:</ThemedText>
        {isLoadingCategories ? (
          <ActivityIndicator />
        ) : (
          <Picker
            selectedValue={selectedCategoryId}
            onValueChange={(itemValue) => {
                setSelectedCategoryId(itemValue);
                setNewCategoryName(''); // Clear new category if selecting existing
                setSelectedSkillId(null); // Reset skill selection
                setNewSkillName('');
            }}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Existing Category --" value={null} />
            {(categories || []).map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
            <Picker.Item label="-- Create New Category --" value="new_category" />
          </Picker>
        )}
        {selectedCategoryId === 'new_category' && (
          <ThemedInput
            label="New Category Name:"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            placeholder="e.g., Leg Locks"
            style={styles.input}
          />
        )}

        {/* Skill Selection (based on category) or Creation */}
        {(selectedCategoryId && selectedCategoryId !== 'new_category') && (
          <>
            <ThemedText style={styles.label}>Skill:</ThemedText>
            {isLoadingSkills ? (
              <ActivityIndicator />
            ) : (
              <Picker
                selectedValue={selectedSkillId}
                onValueChange={(itemValue) => {
                    setSelectedSkillId(itemValue);
                    setNewSkillName(''); // Clear new skill if selecting existing
                }}
                style={styles.picker}
                enabled={!!selectedCategoryId && selectedCategoryId !== 'new_category'}
              >
                <Picker.Item label="-- Select Existing Skill --" value={null} />
                {(skills || []).map((skill) => (
                  <Picker.Item key={skill.id} label={skill.name} value={skill.id} />
                ))}
                <Picker.Item label="-- Create New Skill --" value="new_skill" />
              </Picker>
            )}
          </>
        )}
        {(selectedCategoryId === 'new_category' || selectedSkillId === 'new_skill') && (
            <ThemedInput
                label={selectedSkillId === 'new_skill' ? "New Skill Name:" : "Skill Name for New Category:"}
                value={newSkillName}
                onChangeText={setNewSkillName}
                placeholder="e.g., Heel Hook"
                style={styles.input}
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

        <View style={styles.switchContainer}>
          <ThemedText style={styles.label}>Favorite:</ThemedText>
          <Switch value={isFavorite} onValueChange={setIsFavorite} />
        </View>

        <ThemedInput
          label="Video URL (optional):"
          value={videoUrl}
          onChangeText={setVideoUrl}
          placeholder="https://youtube.com/example_video"
          keyboardType="url"
          autoCapitalize="none"
          style={styles.input}
        />

        {/* Skill Sequences */}
        <ThemedText style={styles.sectionTitle}>Skill Sequences/Steps (Optional)</ThemedText>
        {sequences.map((sequence, seqIndex) => (
          <View key={seqIndex} style={styles.sequenceStepContainer}>
            <ThemedText style={styles.label}>Step {seqIndex + 1}</ThemedText>
            <ThemedInput
              label="Intention/Goal for this step:"
              value={sequence.intention}
              onChangeText={(text) => handleSequenceIntentionChange(text, seqIndex)}
              placeholder="e.g., Create distance, Secure grip"
              style={styles.input}
            />
            {sequence.detailsArray.map((detailItem, detailIndex) => (
              <View key={detailIndex} style={styles.detailContainer}>
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
                    <Text style={styles.removeButtonTextSmall}>Remove Detail</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <ThemedButton title="Add Detail to Step" onPress={() => handleAddDetailToStep(seqIndex)} style={styles.addButtonSmall} />
             <TouchableOpacity onPress={() => handleRemoveSequenceStep(seqIndex)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove Step {seqIndex + 1}</Text>
            </TouchableOpacity>
          </View>
        ))}
        <ThemedButton title="Add Sequence Step" onPress={handleAddSequenceStep} style={styles.button} />


        <ThemedButton
          title={mutation.isPending ? (editingUserSkill ? 'Updating Skill...' : 'Adding Skill...') : (editingUserSkill ? 'Update Skill' : 'Add Skill')}
          onPress={handleSubmit}
          disabled={mutation.isPending || isLoadingCategories || isLoadingSkills}
          style={styles.button}
        />
        {Platform.OS === 'ios' && <ThemedButton title="Close Modal" onPress={() => router.back()} style={styles.button} />}
      </ThemedView>
    </ScrollView>
  );
}

// Using react-native ActivityIndicator now
import { ActivityIndicator } from 'react-native';

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
  sequenceStepContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  detailContainer: {
    paddingLeft: 10,
    marginTop: 5,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#ff6b6b',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButtonSmall: {
    marginTop: 5,
    // Use default ThemedButton styling or add specific small button styles
  },
   removeButtonSmall: {
    marginTop: 5,
    backgroundColor: '#ffaaaa', // Lighter red for smaller remove button
    padding: 5,
    borderRadius: 3,
    alignItems: 'center',
    alignSelf: 'flex-start', // Align to left
  },
  removeButtonTextSmall: {
    color: '#555',
    fontSize: 12,
  }
});
