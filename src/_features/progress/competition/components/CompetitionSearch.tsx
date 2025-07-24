import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import AutocompleteDropdown, { AutocompleteDropdownItem } from '@/src/components/ui/molecules/AutocompleteDropdown';
import { TournamentBrand } from '@/src/types/competition';
import React from 'react';
import { ActivityIndicator } from 'react-native';

interface CompetitionSearchProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onSelectCompetition: (item: AutocompleteDropdownItem | null) => void;
  tournamentBrands: TournamentBrand[] | undefined;
  isLoading: boolean;
  label?: string;
}

const CompetitionSearch: React.FC<CompetitionSearchProps> = ({
  searchText,
  onSearchTextChange,
  onSelectCompetition,
  tournamentBrands,
  isLoading,
  label = "Tournament"
}) => {
  const competitionData = tournamentBrands?.map(brand => ({
    id: brand.id,
    title: brand.name,
  })) || [];

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>{label}:</ThemedText>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <AutocompleteDropdown
          data={competitionData}
          value={searchText}
          onChangeText={onSearchTextChange}
          onSelectItem={onSelectCompetition}
          placeholder="Optional (search tournaments)"
          maxSuggestions={6}
          style={styles.dropdown}
        />
      )}
    </ThemedView>
  );
};

export default CompetitionSearch;

const styles = {
  container: {
    marginBottom: 16,
    backgroundColor: '#ffffff', // White background for container
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 12,
  },
  loader: {
    marginTop: 10,
  },
  dropdown: {
    // Additional styling can be added here if needed
  },
}; 