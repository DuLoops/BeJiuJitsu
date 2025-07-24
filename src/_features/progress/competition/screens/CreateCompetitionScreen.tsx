import {
  fetchTournamentBrands,
  fetchUserSkillsForCompetitionSelection,
} from '@/src/_features/progress/competition/services/competitionService';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import CompetitionSearch from '@/src/_features/progress/competition/components/CompetitionSearch';
import DateSelector from '@/src/_features/progress/competition/components/DateSelector';
import MatchCard from '@/src/_features/progress/competition/components/MatchCard';
import MatchForm from '@/src/_features/progress/competition/components/MatchForm';
import VideoRecorderModal from '@/src/_features/progress/competition/components/VideoRecorderModal';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import Alert from '@/src/components/ui/molecules/Alert';
import { AutocompleteDropdownContextProvider, AutocompleteDropdownItem } from '@/src/components/ui/molecules/AutocompleteDropdown';
import ModalHeader from '@/src/components/ui/molecules/ModalHeader';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/store/authStore';
import { TournamentBrand } from '@/src/types/competition';
import { MatchRecord } from '@/src/types/match';

const generateTempId = () => `temp_${Math.random().toString(36).substr(2, 9)}`;

const createInitialMatch = (): MatchRecord => ({
  id: generateTempId(),
  bjjType: 'GI',
  outcome: 'WIN',
  method: 'SUBMISSION',
  note: null,
  videoUrl: '',
  skillUsages: [],
  isExpanded: true,
});

export default function CreateCompetitionScreen() {
  const { session } = useAuthStore();
  const userId = session?.user?.id;
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'background');
  
  // ScrollView ref for auto-scrolling to new matches
  const scrollViewRef = useRef<ScrollView>(null);

  // Competition details
  const [date, setDate] = useState(new Date());
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  
  // Match records - initialize with first match
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  
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

  // Create first match on component mount
  useEffect(() => {
    if (matches.length === 0) {
      setMatches([createInitialMatch()]);
    }
  }, []);

  const { data: tournamentBrands, isLoading: isLoadingBrands } = useQuery<TournamentBrand[], Error>({
    queryKey: ['tournamentBrands'],
    queryFn: fetchTournamentBrands,
  });

  const { data: userSkills, isLoading: isLoadingUserSkills } = useQuery({
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

  const addMatch = () => {
    const newMatch = createInitialMatch();
    setMatches([...matches, newMatch]);
    
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
      
      // If no matches left, create a new one
      if (updatedMatches.length === 0) {
        setMatches([createInitialMatch()]);
      }
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

  const handleSaveMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      // Here you would typically save individual match to backend
      setAlertConfig({
        visible: true,
        title: 'Match Saved',
        message: 'Match record has been saved successfully.',
      });
    }
  };

  const handleSaveAll = () => {
    if (!userId) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'You must be logged in to save.',
      });
      return;
    }

    // Validate that we have at least basic match data
    const validMatches = matches.filter(match => 
      match.bjjType && match.outcome && match.method
    );

    if (validMatches.length === 0) {
      setAlertConfig({
        visible: true,
        title: 'Validation Error',
        message: 'Please complete at least one match before saving.',
      });
      return;
    }

    // Here you would typically save all competition data to backend
    // For now, show success message and close screen
    setAlertConfig({
      visible: true,
      title: 'Competition Saved',
      message: `Competition with ${validMatches.length} match(es) has been saved successfully!`,
      isSuccess: true,
    });

    console.log('Saving competition data:', {
      date: date.toISOString().split('T')[0],
      competition: selectedCompetition,
      matches: validMatches.map(match => ({
        bjjType: match.bjjType,
        outcome: match.outcome,
        method: match.method,
        myScore: match.myScore,
        opponentScore: match.opponentScore,
        note: match.note,
        videoUrl: match.videoUrl,
        skillUsages: match.skillUsages,
      }))
    });
  };

  const handleAlertDismiss = () => {
    const wasSuccess = alertConfig.isSuccess;
    setAlertConfig({ visible: false, title: '', message: '' });
    
    // Navigate back after successful save
    if (wasSuccess) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/(protected)/(tabs)');
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ModalHeader 
        title="Competition"
        onSave={handleSaveAll}
        saveDisabled={!userId || isLoadingBrands || isLoadingUserSkills}
      />
      
      <AutocompleteDropdownContextProvider>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.container} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
      <ThemedView style={styles.innerContainer}>
            <DateSelector 
              date={date} 
              onDateChange={setDate} 
            />

            <CompetitionSearch
              searchText={searchText}
              onSearchTextChange={handleCompetitionSearchChange}
              onSelectCompetition={handleSelectCompetition}
              tournamentBrands={tournamentBrands}
              isLoading={isLoadingBrands}
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
                  onSaveMatch={handleSaveMatch}
                  onDeleteMatch={removeMatch}
                />
              </MatchCard>
            ))}

            {/* Add Match Button */}
            <ThemedButton
              title="Match"
              onPress={addMatch}
              style={styles.addMatchButton}
              icon={<Ionicons name="add" size={20} color={iconColor} />}
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
    backgroundColor: '#f5f5f5', // Light gray background
  },
  innerContainer: { 
    padding: 16, 
    gap: 12 
  },
  addMatchButton: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#fff', // White background for button
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
});
