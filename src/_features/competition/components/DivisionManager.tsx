import React from 'react';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import DivisionCard, { DivisionData } from './DivisionCard';

interface DivisionManagerProps {
  divisions: DivisionData[];
  onUpdateDivision: (divisionId: string, updates: Partial<DivisionData>) => void;
  onAddDivision: () => void;
  onRemoveDivision: (divisionId: string) => void;
  style?: any;
}

const DivisionManager: React.FC<DivisionManagerProps> = ({
  divisions,
  onUpdateDivision,
  onAddDivision,
  onRemoveDivision,
  style,
}) => {
  return (
    <ThemedCard style={style}>
      <ThemedText style={styles.fieldLabel}>Divisions</ThemedText>
      {divisions.map((division) => (
        <DivisionCard
          key={division.tempId}
          division={division}
          onUpdateDivision={onUpdateDivision}
          onRemoveDivision={onRemoveDivision}
        />
      ))}
      <ThemedButton 
        title="Add Division" 
        onPress={onAddDivision}
        style={styles.addDivisionButton}
      />
    </ThemedCard>
  );
};

const styles = {
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  addDivisionButton: {
    backgroundColor: '#28a745',
    marginTop: 8,
  },
};

export default DivisionManager;