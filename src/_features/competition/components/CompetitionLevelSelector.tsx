import React from 'react';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import DropdownPicker from '@/src/components/ui/molecules/DropdownPicker';
import { getBeltColor } from '@/src/constants/Colors';

interface CompetitionLevelSelectorProps {
  competitionLevel: 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK' | 'GRAY' | 'YELLOW' | 'ORANGE' | 'GREEN' | 'ABSOLUTE';
  onCompetitionLevelChange: (level: 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK' | 'GRAY' | 'YELLOW' | 'ORANGE' | 'GREEN' | 'ABSOLUTE') => void;
  style?: any;
}

const CompetitionLevelSelector: React.FC<CompetitionLevelSelectorProps> = ({
  competitionLevel,
  onCompetitionLevelChange,
  style,
}) => {
  return (
    <ThemedCard style={style}>
      <ThemedText style={styles.fieldLabel}>Competition Level</ThemedText>
      <DropdownPicker
        options={[
          { label: 'White', value: 'WHITE' },
          { label: 'Blue', value: 'BLUE' },
          { label: 'Purple', value: 'PURPLE' },
          { label: 'Brown', value: 'BROWN' },
          { label: 'Black', value: 'BLACK' },
          { label: 'Gray', value: 'GRAY' },
          { label: 'Yellow', value: 'YELLOW' },
          { label: 'Orange', value: 'ORANGE' },
          { label: 'Green', value: 'GREEN' },
          { label: 'Absolute (All Belts)', value: 'ABSOLUTE' },
        ]}
        selectedValue={competitionLevel}
        onValueChange={(v) => onCompetitionLevelChange(v as any)}
        placeholder="Select competition level"
        style={styles.dropdown}
        getOptionColor={(v) => v === 'ABSOLUTE' ? '#FFD700' : getBeltColor(v)}
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
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
};

export default CompetitionLevelSelector;