import React, { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/src/context/AuthContext';
import {
  fetchTournamentBrands,
  createFullCompetitionEntry,
  fetchUserSkillsForCompetitionSelection, // Re-using from previous service setup
} from '@/src/features/competition/services/competitionService';
import {
  CompetitionFormData,
  CompetitionDivisionFormData,
  MatchFormData,
  TournamentBrand,
} from '@/src/types/competition';
import { UserSkillUsageFormData } from '@/src/types/training';
import { UserSkillWithDetails } from '@/src/features/skill/components/UserSkillList'; // For skill selection type
import {
  BjjType,
  Belts,
  MatchMethodType,
  MatchOutcomeType,
  Constants,
} from '@/src/supabase/types';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { Picker } from '@react-native-picker/picker';
import { Switch } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent, } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Helper to generate unique temp IDs for form lists
const generateTempId = () => `temp_${Math.random().toString(36).substr(2, 9)}`;

export default function CreateCompetitionScreen() {
  const auth = useContext(AuthContext);
  const queryClient = useQueryClient();
  const userId = auth?.session?.user?.id;

  // Form State - Competition Details
  const [name, setName] = useState('');
  const [tournamentBrandId, setTournamentBrandId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Form State - Divisions and Matches
  const [divisions, setDivisions] = useState<CompetitionDivisionFormData[]>([]);

  // Fetch Tournament Brands
  const { data: tournamentBrands, isLoading: isLoadingBrands } = useQuery<
    TournamentBrand[],
    Error
  >({
    queryKey: ['tournamentBrands'],
    queryKeyHash: 'tournamentBrands',
    queryFn: fetchTournamentBrands,
  });

  // Fetch User Skills for selection in matches
  const { data: userSkills, isLoading: isLoadingUserSkills } = useQuery<
    UserSkillWithDetails[],
    Error
  >({
    queryKey: ['userSkillsForCompetitionSelection', userId],
    queryKeyHash: `userSkillsForCompetitionSelection-${userId}`,
    queryFn: () => fetchUserSkillsForCompetitionSelection(userId!),
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: (data: CompetitionFormData) => createFullCompetitionEntry(userId!, data),
    onSuccess: () => {
      Alert.alert('Success', 'Competition logged!');
      queryClient.invalidateQueries({ queryKey: ['competitions', userId] }); // Assuming this key for a list of comps
      queryClient.invalidateQueries({ queryKey: ['userSkillsWithDetails', userId] }); // Skill usage affects this
      router.back();
    },
    onError: (error: Error) => {
      Alert.alert('Error', `Failed to log competition: ${error.message}`);
    },
  });

  // Date Picker Handler
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Division Handlers
  const handleAddDivision = () => {
    setDivisions([
      ...divisions,
      {
        tempId: generateTempId(),
        beltRank: Constants.public.Enums.Belts[0], // Default
        weightClass: '',
        ageCategory: '',
        bjjType: Constants.public.Enums.BjjType[0], // Default
        overallResultInDivision: '',
        matches: [],
      },
    ]);
  };

  const handleRemoveDivision = (tempId: string) => {
    setDivisions(divisions.filter(div => div.tempId !== tempId));
  };

  const handleDivisionChange = (
    tempId: string,
    field: keyof Omit<CompetitionDivisionFormData, 'tempId' | 'matches'>,
    value: any
  ) => {
    setDivisions(
      divisions.map(div => (div.tempId === tempId ? { ...div, [field]: value } : div))
    );
  };

  // Match Handlers
  const handleAddMatch = (divisionTempId: string) => {
    setDivisions(
      divisions.map(div =>
        div.tempId === divisionTempId
          ? {
              ...div,
              matches: [
                ...div.matches,
                {
                  tempId: generateTempId(),
                  matchOrder: div.matches.length + 1,
                  opponentName: '',
                  result: Constants.public.Enums.MatchOutcomeType[0], // Default WIN
                  endingMethod: Constants.public.Enums.MatchMethodType[0], // Default SUBMISSION
                  endingMethodDetail: '',
                  notes: '',
                  videoUrl: '',
                  skillUsages: [],
                },
              ],
            }
          : div
      )
    );
  };

  const handleRemoveMatch = (divisionTempId: string, matchTempId: string) => {
    setDivisions(
      divisions.map(div =>
        div.tempId === divisionTempId
          ? { ...div, matches: div.matches.filter(m => m.tempId !== matchTempId) }
          : div
      )
    );
  };

  const handleMatchChange = (
    divisionTempId: string,
    matchTempId: string,
    field: keyof Omit<MatchFormData, 'tempId' | 'skillUsages'>,
    value: any
  ) => {
    setDivisions(
      divisions.map(div =>
        div.tempId === divisionTempId
          ? {
              ...div,
              matches: div.matches.map(m =>
                m.tempId === matchTempId ? { ...m, [field]: value } : m
              ),
            }
          : div
      )
    );
  };

  // Skill Usage Handlers for Matches
  const handleToggleMatchSkillUsage = (
    divisionTempId: string,
    matchTempId: string,
    skill: UserSkillWithDetails // Use the detailed type for skill name access
  ) => {
    setDivisions(
      divisions.map(div =>
        div.tempId === divisionTempId
          ? {
              ...div,
              matches: div.matches.map(m =>
                m.tempId === matchTempId
                  ? {
                      ...m,
                      skillUsages: m.skillUsages.find(su => su.userSkillId === skill.id)
                        ? m.skillUsages.filter(su => su.userSkillId !== skill.id)
                        : [
                            ...m.skillUsages,
                            {
                              userSkillId: skill.id,
                              userSkillName: skill.skill.name, // For potential display if needed
                              quantity: '1',
                              success: true,
                            },
                          ],
                    }
                  : m
              ),
            }
          : div
      )
    );
  };

  const handleMatchSkillUsageChange = (
    divisionTempId: string,
    matchTempId: string,
    userSkillId: string,
    field: keyof UserSkillUsageFormData,
    value: string | boolean
  ) => {
    setDivisions(
      divisions.map(div =>
        div.tempId === divisionTempId
          ? {
              ...div,
              matches: div.matches.map(m =>
                m.tempId === matchTempId
                  ? {
                      ...m,
                      skillUsages: m.skillUsages.map(su =>
                        su.userSkillId === userSkillId ? { ...su, [field]: value } : su
                      ),
                    }
                  : m
              ),
            }
          : div
      )
    );
  };

  const handleSubmit = () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }
    if (!name.trim()) {
        Alert.alert('Validation Error', 'Please enter a competition name.');
        return;
    }
    if (divisions.length === 0) {
        Alert.alert('Validation Error', 'Please add at least one division.');
        return;
    }

    const competitionFormData: CompetitionFormData = {
      name,
      tournamentBrandId,
      date: date.toISOString().split('T')[0],
      location,
      notes,
      divisions, // Already in the correct structure for service if tempIds are handled/ignored by service
    };
    mutation.mutate(competitionFormData);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <ThemedView style={styles.innerContainer}>
        <ThemedText style={styles.title}>Log Competition</ThemedText>

        {/* Competition Details */}
        <ThemedText style={styles.sectionTitle}>Competition Details</ThemedText>
        <ThemedInput label="Competition Name:" value={name} onChangeText={setName} style={styles.input} />
        
        <ThemedText style={styles.label}>Tournament Brand (Optional):</ThemedText>
        {isLoadingBrands ? <Text>Loading brands...</Text> : (
            <Picker selectedValue={tournamentBrandId} onValueChange={itemValue => setTournamentBrandId(itemValue)} style={styles.picker}>
                <Picker.Item label="-- Select Brand --" value={null} />
                {tournamentBrands?.map(brand => <Picker.Item key={brand.id} label={brand.name} value={brand.id} />)}
            </Picker>
        )}

        <ThemedText style={styles.label}>Date:</ThemedText>
        {Platform.OS !== 'ios' && (
            <ThemedButton onPress={() => setShowDatePicker(true)} title={`Selected: ${date.toLocaleDateString()}`} />
        )}
        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />
        )}

        <ThemedInput label="Location (Optional):" value={location} onChangeText={setLocation} style={styles.input} />
        <ThemedInput label="Notes (Optional):" value={notes} onChangeText={setNotes} multiline style={[styles.input, styles.textArea]} />

        {/* Divisions */}
        <ThemedText style={styles.sectionTitle}>Divisions</ThemedText>
        {divisions.map((division, divIndex) => (
          <ThemedView key={division.tempId} style={styles.divisionContainer}>
            <View style={styles.divisionHeader}>
                <ThemedText style={styles.subSectionTitle}>Division {divIndex + 1}</ThemedText>
                <TouchableOpacity onPress={() => handleRemoveDivision(division.tempId)} style={styles.removeButtonSmall}>
                    <Ionicons name="trash-bin-outline" size={20} color="red" />
                </TouchableOpacity>
            </View>
            
            <ThemedText style={styles.label}>Belt Rank:</ThemedText>
            <Picker selectedValue={division.beltRank} onValueChange={val => handleDivisionChange(division.tempId, 'beltRank', val)} style={styles.picker}>
                {Constants.public.Enums.Belts.map(belt => <Picker.Item key={belt} label={belt} value={belt} />)}
            </Picker>

            <ThemedInput label="Weight Class:" value={division.weightClass || ''} onChangeText={val => handleDivisionChange(division.tempId, 'weightClass', val)} style={styles.input} placeholder="e.g., -76kg, Absolute" />
            <ThemedInput label="Age Category:" value={division.ageCategory || ''} onChangeText={val => handleDivisionChange(division.tempId, 'ageCategory', val)} style={styles.input} placeholder="e.g., Adult, Master 1" />
            
            <ThemedText style={styles.label}>BJJ Type:</ThemedText>
            <Picker selectedValue={division.bjjType} onValueChange={val => handleDivisionChange(division.tempId, 'bjjType', val)} style={styles.picker}>
                {Constants.public.Enums.BjjType.map(type => <Picker.Item key={type} label={type} value={type} />)}
            </Picker>
            
            <ThemedInput label="Overall Result (Optional):" value={division.overallResultInDivision || ''} onChangeText={val => handleDivisionChange(division.tempId, 'overallResultInDivision', val)} style={styles.input} placeholder="e.g., Gold, Silver" />

            {/* Matches for this division */}
            <ThemedText style={styles.subSectionTitle}>Matches for Division {divIndex + 1}</ThemedText>
            {division.matches.map((match, matchIndex) => (
              <ThemedView key={match.tempId} style={styles.matchContainer}>
                <View style={styles.matchHeader}>
                    <ThemedText style={styles.label}>Match {matchIndex + 1}</ThemedText>
                    <TouchableOpacity onPress={() => handleRemoveMatch(division.tempId, match.tempId)} style={styles.removeButtonSmall}>
                        <Ionicons name="close-circle-outline" size={20} color="red" />
                    </TouchableOpacity>
                </View>

                <ThemedInput label="Opponent Name (Optional):" value={match.opponentName || ''} onChangeText={val => handleMatchChange(division.tempId, match.tempId, 'opponentName', val)} style={styles.input} />
                
                <ThemedText style={styles.label}>Result:</ThemedText>
                <Picker selectedValue={match.result} onValueChange={val => handleMatchChange(division.tempId, match.tempId, 'result', val)} style={styles.picker}>
                    {Constants.public.Enums.MatchOutcomeType.map(type => <Picker.Item key={type} label={type} value={type} />)}
                </Picker>

                <ThemedText style={styles.label}>Ending Method:</ThemedText>
                <Picker selectedValue={match.endingMethod} onValueChange={val => handleMatchChange(division.tempId, match.tempId, 'endingMethod', val)} style={styles.picker}>
                    {Constants.public.Enums.MatchMethodType.map(type => <Picker.Item key={type} label={type} value={type} />)}
                </Picker>
                <ThemedInput label="Ending Method Detail:" value={match.endingMethodDetail || ''} onChangeText={val => handleMatchChange(division.tempId, match.tempId, 'endingMethodDetail', val)} style={styles.input} placeholder="e.g., Armbar, 6x2 Points"/>

                <ThemedInput label="Match Notes (Optional):" value={match.notes || ''} onChangeText={val => handleMatchChange(division.tempId, match.tempId, 'notes', val)} multiline style={[styles.input, styles.textArea]} />
                <ThemedInput label="Video URL (Optional):" value={match.videoUrl || ''} onChangeText={val => handleMatchChange(division.tempId, match.tempId, 'videoUrl', val)} keyboardType="url" style={styles.input} />

                {/* Skill Usages for this match */}
                <ThemedText style={styles.label}>Skills Used/Attempted in Match {matchIndex + 1}:</ThemedText>
                {isLoadingUserSkills ? <Text>Loading skills...</Text> : userSkills?.map(skillDetail => {
                  const usage = match.skillUsages.find(su => su.userSkillId === skillDetail.id);
                  return (
                    <View key={skillDetail.id} style={styles.skillUsageRow}>
                        <TouchableOpacity onPress={() => handleToggleMatchSkillUsage(division.tempId, match.tempId, skillDetail)} style={styles.skillToggle}>
                            <Ionicons name={usage ? 'checkbox-outline' : 'square-outline'} size={24} color={usage ? '#4CAF50' : '#ccc'} />
                            <ThemedText style={styles.skillNameText}>{skillDetail.skill.name}</ThemedText>
                        </TouchableOpacity>
                        {usage && (
                            <View style={styles.skillUsageInputsContainer}>
                                <ThemedInput label="Qty:" value={usage.quantity} onChangeText={val => handleMatchSkillUsageChange(division.tempId, match.tempId, skillDetail.id, 'quantity', val)} keyboardType="numeric" style={styles.smallInput} />
                                <View style={styles.switchContainerSmall}>
                                    <ThemedText style={styles.labelSmall}>Success:</ThemedText>
                                    <Switch value={usage.success} onValueChange={val => handleMatchSkillUsageChange(division.tempId, match.tempId, skillDetail.id, 'success', val)} />
                                </View>
                            </View>
                        )}
                    </View>
                  );
                })}
              </ThemedView>
            ))}
            <ThemedButton title="Add Match" onPress={() => handleAddMatch(division.tempId)} style={styles.addButtonSmall} />
          </ThemedView>
        ))}
        <ThemedButton title="Add Division" onPress={handleAddDivision} style={styles.button} />

        <ThemedButton
          title={mutation.isPending ? 'Logging Competition...' : 'Log Competition'}
          onPress={handleSubmit}
          disabled={mutation.isPending || isLoadingBrands || isLoadingUserSkills}
          style={[styles.button, styles.submitButton]}
        />
        {Platform.OS === 'ios' && <ThemedButton title="Close Modal" onPress={() => router.back()} style={styles.button} />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { padding: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginTop: 15, marginBottom: 10 },
  subSectionTitle: { fontSize: 18, fontWeight: '500', marginTop: 10, marginBottom: 5 },
  label: { fontSize: 16, marginBottom: 5, marginTop: 8 },
  labelSmall: { fontSize: 14, marginRight: 5 },
  input: { marginBottom: 10 }, 
  textArea: { minHeight: 70, textAlignVertical: 'top', marginBottom:10 },
  picker: { marginBottom: 10, height: Platform.OS === 'ios' ? 150 : 50, backgroundColor: '#f0f0f0' },
  button: { marginTop: 15 },
  submitButton: { backgroundColor: '#4CAF50', marginTop:25 }, // Example color
  divisionContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, marginBottom: 15 },
  divisionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom:5},
  matchContainer: { borderWidth: 1, borderColor: '#eee', borderRadius: 5, padding: 10, marginVertical: 8, marginLeft:10 },
  matchHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom:5},
  removeButtonSmall: { padding: 5 },
  addButtonSmall: { marginTop: 5, alignSelf:'flex-start' }, 
  skillUsageRow: { paddingVertical: 5, borderBottomWidth:1, borderBottomColor:'#f5f5f5' },
  skillToggle: { flexDirection: 'row', alignItems: 'center', marginBottom:3 },
  skillNameText: { fontSize: 15, marginLeft: 8 },
  skillUsageInputsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingLeft: 25, marginTop:3 },
  smallInput: { width: '40%', fontSize:14 }, // Adjusted for row layout
  switchContainerSmall: { flexDirection: 'row', alignItems: 'center' },
});
