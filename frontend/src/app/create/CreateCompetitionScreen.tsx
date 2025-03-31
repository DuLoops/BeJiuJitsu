import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { NumberInput } from '@/src/components/ui/NumberInput';
import { SegmentedControl } from '@/src/components/ui/SegmentedControl';
import { Button } from '@/src/components/ui/Button';
import { Detail } from '@/src/components/create/competition/Detail';
import { useSkillContext } from '@/src/context/SkillContext';
import { SkillType } from '@/src/types/skillType';
import { useNavigation, useRoute } from '@react-navigation/native';
import { router } from 'expo-router';

// Update imports and remove NativeStackNavigationProp since we're using Expo Router
// Define navigation types (not needed with Expo Router but kept for reference)
type RootStackParamList = {
  Home: undefined;
  CreateSkillScreen: { fromScreen: string };
  // Add other screens as needed
};

// Other interfaces remain the same
interface MatchStats {
  submission: number;
  points: number;
  overtime: number;
  decision: number;
}

interface MatchData {
  winCount: number;
  loseCount: number;
  winDetails: string;
  loseDetails: string;
  winStats: MatchStats;
  loseStats: MatchStats;
}

interface CompetitionData {
  Gi: MatchData;
  NoGi: MatchData;
  selectedSkills: SkillType[];
}

const defaultMatchData: MatchData = {
  winCount: 0,
  loseCount: 0,
  winDetails: '',
  loseDetails: '',
  winStats: { submission: 0, points: 0, overtime: 0, decision: 0 },
  loseStats: { submission: 0, points: 0, overtime: 0, decision: 0 },
};

export default function CreateCompetitionScreen() {
  const [formData, setFormData] = useState<CompetitionData>({
    Gi: { ...defaultMatchData },
    NoGi: { ...defaultMatchData },
    selectedSkills: [],
  });

  const [selectedType, setSelectedType] = useState<'Gi' | 'NoGi'>('Gi');
  const [selectedResult, setSelectedResult] = useState<'Win' | 'Loss'>('Win');
  
  const { skills, recentlyCreatedSkills, clearRecentlyCreatedSkills } = useSkillContext();
  const navigation = useNavigation();
  const route = useRoute();

  const currentData = formData[selectedType];

  // Check if we received a skill ID from navigation
  useEffect(() => {
    // @ts-ignore - params might not be properly typed
    if (route.params?.skillId) {
      // Find the skill by ID
      // @ts-ignore - params might not be properly typed
      const skill = skills.find(s => s.id === route.params?.skillId);
      if (skill && !formData.selectedSkills.some(s => s.id === skill.id)) {
        setFormData(prev => ({
          ...prev,
          selectedSkills: [...prev.selectedSkills, skill]
        }));
      }
    }
  }, [route.params, skills]);

  const handleSelectSkill = (skill: SkillType) => {
    // Check if already selected
    if (formData.selectedSkills.some(s => s.id === skill.id)) {
      // Remove from selection
      setFormData(prev => ({
        ...prev,
        selectedSkills: prev.selectedSkills.filter(s => s.id !== skill.id)
      }));
    } else {
      // Add to selection
      setFormData(prev => ({
        ...prev,
        selectedSkills: [...prev.selectedSkills, skill]
      }));
    }
  };

  const handleCreateNewSkill = () => {
    // Use Expo Router instead of react-navigation
    router.push({
      pathname: "/create/CreateSkillScreen",
      params: { fromScreen: 'CreateCompetitionScreen' }
    });
  };

  const handleSubmit = () => {
    // Process the form data and selected skills
    console.log('Form Data:', formData);
    
    // Clear recently created skills after submission
    clearRecentlyCreatedSkills();
    
    // Navigate to home using Expo Router
    router.replace("/");
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.sectionTitle}>Competition Type</Text>
        <SegmentedControl
          segments={['Gi', 'NoGi']}
          selectedSegment={selectedType}
          onSegmentChange={(segment) => setSelectedType(segment as 'Gi' | 'NoGi')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{selectedType} Match Results</Text>
        <View style={styles.row}>
          <NumberInput
            value={currentData.winCount}
            onChange={value => setFormData(prev => ({
              ...prev,
              [selectedType]: {
                ...prev[selectedType],
                winCount: value
              }
            }))}
            minValue={0}
            label="Wins"
          />
          <NumberInput
            value={currentData.loseCount}
            onChange={value => setFormData(prev => ({
              ...prev,
              [selectedType]: {
                ...prev[selectedType],
                loseCount: value
              }
            }))}
            minValue={0}
            label="Losses"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{selectedResult} Details</Text>
        <SegmentedControl
          segments={['Win', 'Loss']}
          selectedSegment={selectedResult}
          onSegmentChange={(segment) => setSelectedResult(segment as 'Win' | 'Loss')}
        />
        <Detail
          data={selectedResult === 'Win' ? currentData.winStats : currentData.loseStats}
          onChange={(data) => {
            const key = selectedResult === 'Win' ? 'winStats' : 'loseStats';
            setFormData(prev => ({
              ...prev,
              [selectedType]: {
                ...prev[selectedType],
                [key]: data
              }
            }));
          }}
          type={selectedResult === 'Win' ? 'win' : 'loss'}
        />
        
        {/* Skills Section */}
        <View style={styles.skillsSection}>
          <Text style={styles.subSectionTitle}>Skills Used</Text>
          
          {/* Recently Created Skills */}
          {/* {recentlyCreatedSkills?.length > 0 && (
            <View style={styles.recentSkillsContainer}>
              <Text style={styles.subSectionLabel}>Recently Created Skills</Text>
              <FlatList
                data={recentlyCreatedSkills}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.skillItem,
                      formData.selectedSkills.some(s => s.id === item.id) && styles.selectedSkill
                    ]}
                    onPress={() => handleSelectSkill(item)}
                  >
                    <Text style={styles.skillName}>{item.name}</Text>
                    <Text style={styles.skillCategory}>{item.category.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )} */}
          
          {/* All Skills */}
          <View style={styles.allSkillsContainer}>
            <Text style={styles.subSectionLabel}>All Skills</Text>
            <FlatList
              data={skills}
              keyExtractor={(item) => item.id}
              nestedScrollEnabled
              style={styles.skillsList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.skillListItem,
                    formData.selectedSkills.some(s => s.id === item.id) && styles.selectedSkillListItem
                  ]}
                  onPress={() => handleSelectSkill(item)}
                >
                  <Text style={styles.skillListName}>{item.name}</Text>
                  <Text style={styles.skillListCategory}>{item.category.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No skills available yet.</Text>
              }
            />
          </View>
          
          <Button 
            title="Create New Skill" 
            onPress={handleCreateNewSkill}
            size="md"
            variant="outline"
            style={styles.createButton}
          />
          
          {/* Selected Skills Summary */}
          {formData.selectedSkills.length > 0 && (
            <View style={styles.selectedSkillsContainer}>
              <Text style={styles.subSectionLabel}>Selected Skills ({formData.selectedSkills.length})</Text>
              {formData.selectedSkills.map((skill) => (
                <View key={skill.id} style={styles.selectedSkillSummary}>
                  <Text style={styles.selectedSkillName}>{skill.name}</Text>
                  <TouchableOpacity onPress={() => handleSelectSkill(skill)}>
                    <Text style={styles.removeButton}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.noteSection}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={selectedResult === 'Win' ? currentData.winDetails : currentData.loseDetails}
            onChangeText={(text) => {
              const key = selectedResult === 'Win' ? 'winDetails' : 'loseDetails';
              setFormData(prev => ({
                ...prev,
                [selectedType]: {
                  ...prev[selectedType],
                  [key]: text
                }
              }));
            }}
            style={styles.textArea}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Save Competition"
          onPress={handleSubmit}
          size="xl"
          variant="primary"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
    height: 100,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  noteSection: {
    marginTop: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  // New styles for skills section
  skillsSection: {
    marginTop: 16,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subSectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  recentSkillsContainer: {
    marginBottom: 15,
  },
  allSkillsContainer: {
    marginBottom: 15,
  },
  skillsList: {
    maxHeight: 150,
  },
  skillItem: {
    padding: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 10,
    minWidth: 120,
  },
  selectedSkill: {
    backgroundColor: '#b3e5fc',
    borderWidth: 1,
    borderColor: '#03a9f4',
  },
  skillName: {
    fontWeight: 'bold',
  },
  skillCategory: {
    fontSize: 12,
    color: '#666',
  },
  skillListItem: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedSkillListItem: {
    backgroundColor: '#b3e5fc',
  },
  skillListName: {
    fontWeight: 'bold',
  },
  skillListCategory: {
    color: '#666',
  },
  createButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  selectedSkillsContainer: {
    marginBottom: 15,
  },
  selectedSkillSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedSkillName: {
    fontWeight: 'bold',
  },
  removeButton: {
    color: '#B91C1C',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    padding: 10,
  },
});
