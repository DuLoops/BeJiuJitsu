import {
    createFullCompetitionEntry,
    fetchTournamentBrands,
    fetchUserSkillsForCompetitionSelection,
} from '@/src/_features/competition/services/competitionService';
import { UserSkillWithDetails } from '@/src/_features/skill/components/UserSkillList';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/store/authStore';
import {
    BeltsArray,
    BjjTypesArray,
    MatchMethodTypesArray,
    MatchOutcomeTypesArray,
} from '@/src/supabase/constants';
import {
    CompetitionDivisionFormData,
    CompetitionFormData,
    MatchFormData,
    TournamentBrand,
} from '@/src/types/competition';
import { UserSkillUsageFormData } from '@/src/types/training';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

const generateTempId = () => `temp_${Math.random().toString(36).substr(2, 9)}`;

export default function CreateCompetitionScreen() {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const dangerColor = useThemeColor({}, 'text');
  const successColor = useThemeColor({}, 'tint');

  const [name, setName] = useState('');
  const [tournamentBrandId, setTournamentBrandId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [divisions, setDivisions] = useState<CompetitionDivisionFormData[]>([]);

  const { data: tournamentBrands, isLoading: isLoadingBrands } = useQuery<
    TournamentBrand[],
    Error
  >({
    queryKey: ['tournamentBrands'],
    queryFn: fetchTournamentBrands,
  });

  const { data: userSkills, isLoading: isLoadingUserSkills } = useQuery<
    UserSkillWithDetails[],
    Error
  >({
    queryKey: ['userSkillsForCompetitionSelection', userId],
    queryFn: () => fetchUserSkillsForCompetitionSelection(userId!),
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: (data: CompetitionFormData) => createFullCompetitionEntry(userId!, data),
    onSuccess: () => {
      Alert.alert('Success', 'Competition logged!');
      queryClient.invalidateQueries({ queryKey: ['competitions', userId] });
      queryClient.invalidateQueries({ queryKey: ['userSkillsWithDetails', userId] });
      router.back();
    },
    onError: (error: Error) => {
      Alert.alert('Error', `Failed to log competition: ${error.message}`);
    },
  });

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleAddDivision = () => {
    setDivisions([
      ...divisions,
      {
        tempId: generateTempId(),
        beltRank: BeltsArray[0],
        weightClass: '',
        ageCategory: '',
        bjjType: BjjTypesArray[0],
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
                  result: MatchOutcomeTypesArray[0],
                  endingMethod: MatchMethodTypesArray[0],
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

  const handleToggleMatchSkillUsage = (
    divisionTempId: string,
    matchTempId: string,
    skill: UserSkillWithDetails
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
                              userSkillName: skill.skill.name,
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
      Alert.alert('Error', 'User not authenticated.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Competition name is required.');
      return;
    }
    if (!divisions.length) {
      Alert.alert('Validation Error', 'At least one division is required.');
      return;
    }

    const competitionData: CompetitionFormData = {
      name: name.trim(),
      tournamentBrandId,
      date: date.toISOString().split('T')[0],
      location: location || null,
      notes: notes || null,
      divisions: divisions.map(div => ({
        ...div,
        beltRank: div.beltRank,
        bjjType: div.bjjType,
        weightClass: div.weightClass || null,
        ageCategory: div.ageCategory || null,
        overallResultInDivision: div.overallResultInDivision || null,
        matches: div.matches.map(match => ({
          ...match,
          opponentName: match.opponentName || null,
          result: match.result,
          endingMethod: match.endingMethod || null,
          endingMethodDetail: match.endingMethodDetail || null,
          notes: match.notes || null,
          videoUrl: match.videoUrl || null,
          matchOrder: match.matchOrder || null,
          skillUsages: match.skillUsages.map(su => ({
            userSkillId: su.userSkillId,
            userSkillName: su.userSkillName || '',
            quantity: su.quantity,
            success: su.success,
          })),
        })),
      })),
    };

    mutation.mutate(competitionData);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <ThemedView style={styles.innerContainer}>
        <ThemedText style={styles.title}>Log Competition</ThemedText>

        {/* Competition Details */}
        <ThemedText style={styles.sectionTitle}>Competition Details</ThemedText>
        <ThemedInput label="Competition Name:" value={name} onChangeText={setName} placeholder="e.g., IBJJF Pan Ams 2024" style={styles.input} />
        
        <ThemedText style={styles.label}>Tournament Brand (Optional):</ThemedText>
        {isLoadingBrands ? <ActivityIndicator /> : (
          <Picker selectedValue={tournamentBrandId} onValueChange={(itemValue) => setTournamentBrandId(itemValue as string | null)} style={styles.picker}>
            <Picker.Item label="-- Select Brand --" value={null} />
            {tournamentBrands?.map(brand => <Picker.Item key={brand.id} label={brand.name} value={brand.id} />)}
          </Picker>
        )}

        <ThemedText style={styles.label}>Date:</ThemedText>
        {Platform.OS !== 'ios' && <ThemedButton onPress={() => setShowDatePicker(true)} title={`Selected: ${date.toLocaleDateString()}`} />}
        {showDatePicker && <DateTimePicker testID="dateTimePicker" value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />}

        <ThemedInput label="Location (Optional):" value={location} onChangeText={setLocation} placeholder="e.g., Kissimmee, FL" style={styles.input} />
        <ThemedInput label="Overall Notes (Optional):" value={notes} onChangeText={setNotes} multiline numberOfLines={3} placeholder="General notes about the competition..." style={[styles.input, styles.textArea]} />

        {/* Divisions Section */}
        <ThemedView style={styles.sectionHeaderContainer}>
          <ThemedText style={styles.sectionTitle}>Divisions</ThemedText>
          <ThemedButton title="Add Division" onPress={handleAddDivision} icon={<Ionicons name="add" size={20} color={iconColor}/>} />
        </ThemedView>

        {divisions.map((division, divIndex) => (
          <ThemedView key={division.tempId} style={styles.divisionContainer}>
            <ThemedView style={styles.itemHeader}>
              <ThemedText style={styles.itemTitle}>Division {divIndex + 1}</ThemedText>
              <TouchableOpacity onPress={() => handleRemoveDivision(division.tempId)} style={styles.removeButton}>
                <Ionicons name="trash-bin-outline" size={20} color={dangerColor} />
              </TouchableOpacity>
            </ThemedView>

            <ThemedText style={styles.label}>Belt Rank:</ThemedText>
            <Picker selectedValue={division.beltRank} onValueChange={(value) => handleDivisionChange(division.tempId, 'beltRank', value)} style={styles.picker}>
              {BeltsArray.map(belt => <Picker.Item key={belt} label={belt} value={belt} />)}
            </Picker>
            
            <ThemedInput label="Weight Class:" value={division.weightClass || ''} onChangeText={(value) => handleDivisionChange(division.tempId, 'weightClass', value)} placeholder="e.g., Medium Heavy" style={styles.input} />
            <ThemedInput label="Age Category (Optional):" value={division.ageCategory || ''} onChangeText={(value) => handleDivisionChange(division.tempId, 'ageCategory', value)} placeholder="e.g., Master 1" style={styles.input} />

            <ThemedText style={styles.label}>Gi / No-Gi:</ThemedText>
            <Picker selectedValue={division.bjjType} onValueChange={(value) => handleDivisionChange(division.tempId, 'bjjType', value)} style={styles.picker}>
              {BjjTypesArray.map(type => <Picker.Item key={type} label={type} value={type} />)}
            </Picker>

            <ThemedInput label="Overall Result in Division (Optional):" value={division.overallResultInDivision || ''} onChangeText={(value) => handleDivisionChange(division.tempId, 'overallResultInDivision', value)} placeholder="e.g., Gold, Bronze, Qualified" style={styles.input} />

            {/* Matches Section for this Division */}
            <ThemedView style={styles.sectionHeaderContainer}>
              <ThemedText style={styles.subSectionTitle}>Matches</ThemedText>
              <ThemedButton title="Add Match" onPress={() => handleAddMatch(division.tempId)} icon={<Ionicons name="add" size={20} color={iconColor}/>} />
            </ThemedView>

            {division.matches.map((match, matchIndex) => (
              <ThemedView key={match.tempId} style={styles.matchContainer}>
                <ThemedView style={styles.itemHeader}>
                  <ThemedText style={styles.itemTitle}>Match {matchIndex + 1}</ThemedText>
                  <TouchableOpacity onPress={() => handleRemoveMatch(division.tempId, match.tempId)} style={styles.removeButton}>
                    <Ionicons name="trash-bin-outline" size={20} color={dangerColor} />
                  </TouchableOpacity>
                </ThemedView>

                <ThemedInput label="Opponent Name (Optional):" value={match.opponentName || ''} onChangeText={(value) => handleMatchChange(division.tempId, match.tempId, 'opponentName', value)} style={styles.input} />

                <ThemedText style={styles.label}>Result:</ThemedText>
                <Picker selectedValue={match.result} onValueChange={(value) => handleMatchChange(division.tempId, match.tempId, 'result', value)} style={styles.picker}>
                  {MatchOutcomeTypesArray.map(type => <Picker.Item key={type} label={type} value={type} />)}
                </Picker>

                <ThemedText style={styles.label}>Ending Method:</ThemedText>
                <Picker selectedValue={match.endingMethod} onValueChange={(value) => handleMatchChange(division.tempId, match.tempId, 'endingMethod', value)} style={styles.picker}>
                  {MatchMethodTypesArray.map(type => <Picker.Item key={type} label={type} value={type} />)}
                </Picker>

                <ThemedInput label="Ending Method Detail (Optional):" value={match.endingMethodDetail || ''} onChangeText={(value) => handleMatchChange(division.tempId, match.tempId, 'endingMethodDetail', value)} placeholder="e.g., RNC, Armbar" style={styles.input} />
                <ThemedInput label="Match Notes (Optional):" value={match.notes || ''} onChangeText={(value) => handleMatchChange(division.tempId, match.tempId, 'notes', value)} multiline placeholder="Key moments, mistakes..." style={[styles.input, styles.textArea]} />
                <ThemedInput label="Video URL (Optional):" value={match.videoUrl || ''} onChangeText={(value) => handleMatchChange(division.tempId, match.tempId, 'videoUrl', value)} keyboardType="url" style={styles.input} />

                {/* Skill Usages for this Match */}
                <ThemedText style={styles.subSectionTitle}>Skills Used/Attempted</ThemedText>
                {isLoadingUserSkills ? <ActivityIndicator /> : userSkills && userSkills.length > 0 ? (
                  userSkills.map(skillDetail => {
                    const currentSkillUsage = match.skillUsages.find(su => su.userSkillId === skillDetail.id);
                    const isSkillSelected = !!currentSkillUsage;
                    return (
                      <ThemedView key={skillDetail.id} style={styles.skillUsageItem}>
                        <TouchableOpacity onPress={() => handleToggleMatchSkillUsage(division.tempId, match.tempId, skillDetail)} style={styles.skillToggle}>
                          <Ionicons name={isSkillSelected ? 'checkbox-outline' : 'square-outline'} size={24} color={isSkillSelected ? successColor : iconColor} />
                          <ThemedText style={styles.skillNameText}>{skillDetail.skill.name} ({skillDetail.skill.category.name})</ThemedText>
                        </TouchableOpacity>
                        {isSkillSelected && currentSkillUsage && (
                          <ThemedView style={styles.skillUsageInputs}>
                            <ThemedInput label="Quantity:" value={currentSkillUsage.quantity} onChangeText={(value) => handleMatchSkillUsageChange(division.tempId, match.tempId, skillDetail.id, 'quantity', value)} keyboardType="numeric" style={styles.smallInput} />
                            <ThemedView style={styles.switchRow}>
                              <ThemedText style={styles.label}>Successful?</ThemedText>
                              <Switch value={currentSkillUsage.success} onValueChange={(value) => handleMatchSkillUsageChange(division.tempId, match.tempId, skillDetail.id, 'success', value)} trackColor={{ false: "#767577", true: tintColor }} thumbColor={currentSkillUsage.success ? tintColor : "#f4f3f4"} />
                            </ThemedView>
                          </ThemedView>
                        )}
                      </ThemedView>
                    );
                  })
                ) : (
                  <ThemedText>No skills available to select. Add skills in the Skills tab.</ThemedText>
                )}
              </ThemedView>
            ))}
          </ThemedView>
        ))}

        <ThemedButton title={mutation.isPending ? 'Logging Competition...' : 'Log Competition'} onPress={handleSubmit} disabled={mutation.isPending || isLoadingBrands || isLoadingUserSkills} style={styles.button} />
        {Platform.OS === 'ios' && <ThemedButton title="Close Modal" onPress={() => router.back()} style={styles.button} />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { padding: 16, gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  subSectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  sectionHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemTitle: { fontSize: 18, fontWeight: '500' },
  label: { fontSize: 16, marginBottom: 4, marginTop: 8 },
  input: { marginBottom: 8 },
  textArea: { minHeight: 70, textAlignVertical: 'top' },
  picker: { marginBottom: 8, height: Platform.OS === 'ios' ? 180 : 50, backgroundColor: '#f0f0f0' },
  divisionContainer: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 16, gap: 4 },
  matchContainer: { padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 6, marginTop: 10, marginLeft: 10, gap: 4 },
  removeButton: { padding: 4 },
  skillUsageItem: { paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#f0f0f0', marginTop: 6 },
  skillToggle: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  skillNameText: { marginLeft: 8, fontSize: 16, flexShrink: 1 },
  skillUsageInputs: { paddingLeft: 28, gap: 6, marginTop: 4 },
  smallInput: { /* styles for smaller input */ },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  button: { marginTop: 24, marginBottom: Platform.OS === 'ios' ? 0 : 16 },
});
