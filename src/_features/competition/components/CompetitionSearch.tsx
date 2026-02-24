import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import AutocompleteDropdown, { AutocompleteDropdownItem } from '@/src/components/ui/molecules/AutocompleteDropdown';
import { TournamentBrand } from '@/src/types/competition';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

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
    <View>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <AutocompleteDropdown
          data={competitionData}
          value={searchText}
          onChangeText={onSearchTextChange}
          onSelectItem={onSelectCompetition}
          placeholder="Search tournaments"
          maxSuggestions={6}
          style={styles.dropdown}
          inputContainerStyle={styles.input}
        />
      )}
      </View>
  );
};

export default CompetitionSearch;

const styles = {
  label: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 12,
  },
  loader: {
    marginTop: 10,
  },
  dropdown: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#ddd',
  },
}; 