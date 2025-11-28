import {
  createFullCompetitionEntry,
  fetchTournamentBrands,
  fetchUserSkillsForCompetitionSelection,
} from '@/src/_features/competition/services/competitionService';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import CompetitionDetails from '@/src/_features/competition/components/CompetitionDetails';
import MatchCard from '@/src/_features/competition/components/MatchCard';
import MatchForm from '@/src/_features/competition/components/MatchForm';
import VideoRecorderModal from '@/src/_features/competition/components/VideoRecorderModal';
import { DivisionData } from '@/src/_features/competition/components/DivisionCard';
import TitleAndDateInput from '@/src/components/layout/TitleAndDateInput';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import Alert from '@/src/components/ui/molecules/Alert';
import { AutocompleteDropdownItem, AutocompleteDropdownContextProvider } from '@/src/components/ui/molecules/AutocompleteDropdown';

import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/stores/authStore';
import { TournamentBrand } from '@/src/types/competition';
import { MatchRecord } from '@/src/types/match';

const generateTempId = () => `temp_${Math.random().toString(36).substr(2, 9)}`;

const createInitialMatch = (): MatchRecord => ({
  id: generateTempId(),
  bjjType: 'GI',
  outcome: 'WIN',
  outcomeMethod: 'SUBMISSION',
  name: 'Match 1',
  note: null,
  videoUrl: null,
  skillUsages: [],
  isExpanded: true,
});

interface CreateCompetitionScreenProps {
  onSave?: () => void;
}

export interface CreateCompetitionScreenRef {
  handleSave: () => void;
  isValid: () => boolean;
  isSaving: () => boolean;
  getMatchCount: () => number;
}

const CreateCompetitionScreen = forwardRef<CreateCompetitionScreenRef, CreateCompetitionScreenProps>(({ onSave }, ref) => {
  const { session } = useAuthStore();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const backgroundColor = useThemeColor({}, 'background');

  // ScrollView ref for auto-scrolling to new matches
  const scrollViewRef = useRef<ScrollView>(null);

  // Competition details
  const [title, setTitle] = useState('Competition');
  const [date, setDate] = useState(new Date());
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
  };

  // Divisions and matches
  const [divisions, setDivisions] = useState<DivisionData[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [lastAddedMatchId, setLastAddedMatchId] = useState<string | null>(null);
  const [competitionLevel, setCompetitionLevel] = useState<'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK' | 'GRAY' | 'YELLOW' | 'ORANGE' | 'GREEN' | 'ABSOLUTE'>('ABSOLUTE');

  // Video recorder state
  const [showVideoRecorder, setShowVideoRecorder] = useState<string | null>(null);

  // Alert state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    matchId?: string;
    isSuccess?: boolean;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  // Loading state for saving
  const [isSaving, setIsSaving] = useState(false);

  // Start with zero matches by default

  const { data: tournamentBrands, isLoading: isLoadingBrands } = useQuery<TournamentBrand[], Error>({
    queryKey: ['tournamentBrands'],
    queryFn: fetchTournamentBrands,
  });

  const { data: userSkills } = useQuery({
    queryKey: ['userSkillsForCompetitionSelection', userId],
    queryFn: () => fetchUserSkillsForCompetitionSelection(userId!),
    enabled: !!userId,
  });

  const handleSelectCompetition = (item: AutocompleteDropdownItem | null) => {
    if (!item?.title) {
      if (searchText === '' && item === null) {
        setSelectedCompetition('');
        setSearchText('');
      }
      return;
    }
    setSearchText(item.title);
    setSelectedCompetition(item.title);
  };

  const handleCompetitionSearchChange = (text: string) => {
    setSearchText(text);
    setSelectedCompetition(text);
  };

  // Division management functions
  const handleUpdateDivision = (divisionId: string, updates: Partial<DivisionData>) => {
    setDivisions(prev => prev.map(d => 
      d.tempId === divisionId ? { ...d, ...updates } : d
    ));
  };

  const handleAddDivision = () => {
    setDivisions(prev => [...prev, { 
      tempId: generateTempId(), 
      bjjType: 'GI', 
      weightType: 'open',
      weightClassUnderKg: null, 
      ageCategory: null, 
      overallResultInDivision: null 
    }]);
  };

  const handleRemoveDivision = (divisionId: string) => {
    setDivisions(prev => prev.filter(d => d.tempId !== divisionId));
  };

  const addMatch = () => {
    const newMatch = createInitialMatch();
    newMatch.name = `Match ${matches.length + 1}`;
    // If exactly one division exists, auto-assign and hide selector later
    if (divisions.length === 1) newMatch.divisionTempId = divisions[0].tempId;
    setMatches(prev => [...prev, newMatch]);
    setLastAddedMatchId(newMatch.id);

    // Scroll to the newly added match with a small delay to ensure rendering
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const removeMatch = (matchId: string) => {
    const matchIndex = matches.findIndex(m => m.id === matchId);
    const matchNumber = matchIndex + 1;

    setAlertConfig({
      visible: true,
      title: 'Delete Match',
      message: `Are you sure you want to delete Match ${matchNumber}? This action cannot be undone.`,
      matchId,
    });
  };

  const confirmDeleteMatch = () => {
    if (alertConfig.matchId) {
      const updatedMatches = matches.filter(m => m.id !== alertConfig.matchId);
      setMatches(updatedMatches);

      // No auto-add; allow zero matches
    }
    setAlertConfig({ visible: false, title: '', message: '' });
  };

  const cancelDeleteMatch = () => {
    setAlertConfig({ visible: false, title: '', message: '' });
  };

  const updateMatch = (matchId: string, updates: Partial<MatchRecord>) => {
    setMatches(matches.map(m => m.id === matchId ? { ...m, ...updates } : m));
  };

  const toggleMatchExpansion = (matchId: string) => {
    setMatches(matches.map(m =>
      m.id === matchId ? { ...m, isExpanded: !m.isExpanded } : m
    ));
  };

  const handleAddVideo = (matchId: string) => {
    setShowVideoRecorder(matchId);
  };

  const isFormValid = () => {
    if (!userId) return false;
    if (!title.trim()) return false;
    return true; // Only require title and date - matches are optional
  };

  const handleSaveAll = async () => {
    if (!userId) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'You must be logged in to save.',
      });
      return;
    }

    // Filter valid matches (matches are optional now)
    const validMatches = matches.filter(match =>
      match.bjjType && match.outcome && match.outcomeMethod && match.name
    );

    setIsSaving(true);

    try {
      // Find the selected tournament brand ID
      const selectedTournamentBrand = tournamentBrands?.find(brand => brand.name === selectedCompetition);

      // Prepare competition data structure for the API
      // Group matches by selected division (or default bucket when none)
      const divisionBuckets: Record<string, any> = {};
      const ensureBucket = (tempId: string, bjjType: string) => {
        if (!divisionBuckets[tempId]) {
          const division = divisions.find(d => d.tempId === tempId);
          divisionBuckets[tempId] = {
            tempId,
            bjjType: bjjType as any,
            divisionWeightUnit: division?.weightClassUnderKg || null,
            divisionWeightType: division?.weightType || 'open',
            ageCategory: null,
            overallResultInDivision: null,
            competitionMatches: [] as any[],
          };
        }
      };

      validMatches.forEach((match) => {
        const div = divisions.find(d => d.tempId === match.divisionTempId);
        const bucketId = div?.tempId || 'default';
        ensureBucket(bucketId, div?.bjjType || 'GI');
        divisionBuckets[bucketId].competitionMatches.push({
          tempId: match.id,
          name: match.name,
          outcome: match.outcome,
          outcomeMethod: match.outcomeMethod,
          myScore: match.myScore,
          opponentScore: match.opponentScore,
          note: match.note,
          videoUrl: match.videoUrl,
          matchOrder: (divisionBuckets[bucketId].competitionMatches.length || 0) + 1,
          skillUsages: match.skillUsages.map(skill => ({
            userSkillId: skill.id,
            quantity: '1',
            success: true,
          })),
        });
      });

      const competitionData = {
        title,
        tournamentBrandId: selectedTournamentBrand?.id || null,
        competitionLevel,
        date: date.toISOString().split('T')[0],
        location: null,
        notes: null,
        divisions: Object.values(divisionBuckets),
      };

      // Save to backend
      await createFullCompetitionEntry(userId, competitionData);

      // Invalidate progress queries to refresh the progress page
      queryClient.invalidateQueries({ queryKey: ['progress-activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity-summary'] });

      setAlertConfig({
        visible: true,
        title: 'Competition Saved',
        message: `Competition "${title}" with ${validMatches.length} match(es) has been saved successfully!`,
        isSuccess: true,
      });

    } catch (error) {
      console.error('Error saving competition:', error);
      setAlertConfig({
        visible: true,
        title: 'Save Error',
        message: 'Failed to save competition. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAlertDismiss = () => {
    const wasSuccess = alertConfig.isSuccess;
    setAlertConfig({ visible: false, title: '', message: '' });

    // Navigate back after successful save
    if (wasSuccess) {
      try {
        // For modal screens, use dismiss() instead of back()
        router.dismiss();
      } catch (error) {
        // Fallback to tabs if dismiss fails
        router.replace('/(protected)/(tabs)');
      }
    }
  };

  const getAlertActions = () => {
    if (alertConfig.matchId) {
      // Delete confirmation actions
      return [
        { text: 'Cancel', style: 'cancel' as const, onPress: cancelDeleteMatch },
        { text: 'Delete', style: 'destructive' as const, onPress: confirmDeleteMatch },
      ];
    } else {
      // Regular alert actions
      return [
        { text: 'OK', onPress: handleAlertDismiss },
      ];
    }
  };

  useImperativeHandle(ref, () => ({
    handleSave: handleSaveAll,
    isValid: isFormValid,
    isSaving: () => isSaving,
    getMatchCount: () => matches.length,
  }));

  return (
    <AutocompleteDropdownContextProvider>
      <ThemedView style={[styles.container, { backgroundColor }]}>
          <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.innerContainer}>
            {/* Title and Date Input */}
            <TitleAndDateInput
              title={title}
              onTitleChange={setTitle}
              titlePlaceholder="Competition" 
              date={date}
              onDateChange={handleDateChange}
            />

            <CompetitionDetails
              competitionLevel={competitionLevel}
              onCompetitionLevelChange={setCompetitionLevel}
              searchText={searchText}
              onSearchTextChange={handleCompetitionSearchChange}
              onSelectCompetition={handleSelectCompetition}
              tournamentBrands={tournamentBrands}
              isLoadingBrands={isLoadingBrands}
              divisions={divisions}
              onUpdateDivision={handleUpdateDivision}
              onAddDivision={handleAddDivision}
              onRemoveDivision={handleRemoveDivision}
            />


            {/* Matches Section */}
            {matches.map((match, index) => (
              <MatchCard
                key={match.id}
                match={match}
                index={index}
                onToggleExpansion={toggleMatchExpansion}
              >
                <MatchForm
                  match={match}
                  onUpdateMatch={updateMatch}
                  onAddVideo={handleAddVideo}
                  onDeleteMatch={removeMatch}
                  divisions={divisions}
                  autoOpenOutcome={match.id === lastAddedMatchId}
                />
              </MatchCard>
            ))}

            {/* Add Match Button */}
            <ThemedButton
              title="Add Match"
              variant="primary"
              onPress={addMatch}
              icon={<Ionicons name="add" size={20} color="white" />}
              testID="add-match-button"
            />

            {/* Video Recorder Modal */}
            <VideoRecorderModal
              visible={!!showVideoRecorder}
              onClose={() => setShowVideoRecorder(null)}
              matchId={showVideoRecorder || undefined}
            />

            {/* Alert */}
            <Alert
              visible={alertConfig.visible}
              title={alertConfig.title}
              message={alertConfig.message}
              actions={getAlertActions()}
              onDismiss={handleAlertDismiss}
            />
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </AutocompleteDropdownContextProvider>
  );
});

CreateCompetitionScreen.displayName = 'CreateCompetitionScreen';

export default CreateCompetitionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  innerContainer: {
    padding: 16,
    gap: 12
  },
});
