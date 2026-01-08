import React from 'react';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Collapsible } from '@/src/components/ui/molecules/Collapsible';
import { AutocompleteDropdownItem } from '@/src/components/ui/molecules/AutocompleteDropdown';
import CompetitionSearch from './CompetitionSearch';
import CompetitionLevelSelector from './CompetitionLevelSelector';
import DivisionManager from './DivisionManager';
import { DivisionData } from './DivisionCard';
import { TournamentBrand } from '@/src/types/competition';

interface CompetitionDetailsProps {
  // Competition Level
  competitionLevel: 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK' | 'GRAY' | 'YELLOW' | 'ORANGE' | 'GREEN' | 'ABSOLUTE';
  onCompetitionLevelChange: (level: 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK' | 'GRAY' | 'YELLOW' | 'ORANGE' | 'GREEN' | 'ABSOLUTE') => void;

  // Tournament Search
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onSelectCompetition: (item: AutocompleteDropdownItem | null) => void;
  tournamentBrands: TournamentBrand[] | undefined;
  isLoadingBrands: boolean;

  // Divisions
  divisions: DivisionData[];
  onUpdateDivision: (divisionId: string, updates: Partial<DivisionData>) => void;
  onAddDivision: () => void;
  onRemoveDivision: (divisionId: string) => void;
}

const CompetitionDetails: React.FC<CompetitionDetailsProps> = ({
  competitionLevel,
  onCompetitionLevelChange,
  searchText,
  onSearchTextChange,
  onSelectCompetition,
  tournamentBrands,
  isLoadingBrands,
  divisions,
  onUpdateDivision,
  onAddDivision,
  onRemoveDivision,
}) => {
  const borderColor = useThemeColor({}, 'border');
  return (
    <Collapsible title="Details" style={[styles.detailsWrapper, { borderColor }]}>
      <ThemedCard style={styles.detailsContainer}>

        <CompetitionLevelSelector
          competitionLevel={competitionLevel}
          onCompetitionLevelChange={onCompetitionLevelChange}
        />

        <ThemedCard>
          <ThemedText style={styles.fieldLabel}>Tournament</ThemedText>
          <CompetitionSearch
            searchText={searchText}
            onSearchTextChange={onSearchTextChange}
            onSelectCompetition={onSelectCompetition}
            tournamentBrands={tournamentBrands}
            isLoading={isLoadingBrands}
          />
        </ThemedCard>

        <DivisionManager
          divisions={divisions}
          onUpdateDivision={onUpdateDivision}
          onAddDivision={onAddDivision}
          onRemoveDivision={onRemoveDivision}
        />

      </ThemedCard>
    </Collapsible>
  );
};

const styles = {
  detailsWrapper: {
    borderWidth: 1,
    // borderColor: '#ddd', // Should use theme border
    borderRadius: 12,
    marginBottom: 8,
  },
  detailsContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 12,
    paddingVertical: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
};

export default CompetitionDetails;