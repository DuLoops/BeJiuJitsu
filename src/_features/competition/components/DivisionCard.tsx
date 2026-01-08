import React from 'react';
import { TextInput } from 'react-native';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import DropdownPicker from '@/src/components/ui/molecules/DropdownPicker';

export interface DivisionData {
  tempId: string;
  bjjType: 'GI' | 'NOGI' | 'BOTH';
  weightType: 'kg_under' | 'lbs_under' | 'open';
  weightClassUnderKg?: number | null;
  ageCategory?: string | null;
  overallResultInDivision?: number | null;
}

interface DivisionCardProps {
  division: DivisionData;
  onUpdateDivision: (divisionId: string, updates: Partial<DivisionData>) => void;
  onRemoveDivision: (divisionId: string) => void;
}

const DivisionCard: React.FC<DivisionCardProps> = ({
  division,
  onUpdateDivision,
  onRemoveDivision,
}) => {
  return (
    <ThemedCard style={styles.divisionCard}>
      <ThemedCard>
        <ThemedCard style={styles.divisionField}>
          <ThemedText style={styles.inlineSmall}>Gi/NoGi</ThemedText>
          <DropdownPicker
            options={[
              { label: 'Gi', value: 'GI' },
              { label: 'NoGi', value: 'NOGI' },
              { label: 'Both', value: 'BOTH' },
            ]}
            selectedValue={division.bjjType}
            onValueChange={(v) => onUpdateDivision(division.tempId, { bjjType: v as any })}
            placeholder="BJJ Type"
            style={styles.dropdown}
          />
        </ThemedCard>
      </ThemedCard>
      
      {/* Weight Class Section */}
      <ThemedCard style={styles.weightClassSection}>
        <ThemedText style={styles.inlineSmall}>Weight Class</ThemedText>
        <ThemedCard style={styles.weightClassRow}>
          <ThemedCard style={styles.weightTypeDropdown}>
            <DropdownPicker
              options={[
                { label: 'kg (under)', value: 'kg_under' },
                { label: 'lbs (under)', value: 'lbs_under' },
                { label: 'Open', value: 'open' }
              ]}
              selectedValue={division.weightType}
              onValueChange={(v) => onUpdateDivision(division.tempId, {
                weightType: v as 'kg_under' | 'lbs_under' | 'open',
                weightClassUnderKg: v === 'open' ? null : (division.weightClassUnderKg || 70)
              })}
              placeholder="Weight Type"
              style={styles.dropdown}
            />
          </ThemedCard>
          {division.weightType !== 'open' && (
            <TextInput
              style={[styles.weightInput, styles.weightNumberInput]}
              value={division.weightClassUnderKg?.toString() || ''}
              onChangeText={(t) => onUpdateDivision(division.tempId, { 
                weightClassUnderKg: parseInt(t) || 70 
              })}
              placeholder="Weight"
              keyboardType="numeric"
            />
          )}
        </ThemedCard>
      </ThemedCard>

      <ThemedButton 
        title="Remove Division" 
        onPress={() => onRemoveDivision(division.tempId)}
        style={styles.removeDivisionButton}
      />
    </ThemedCard>
  );
};

const styles = {
  divisionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  divisionField: {
    flex: 1,
    marginHorizontal: 4,
  },
  weightClassSection: {
    marginTop: 12,
  },
  weightClassRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginTop: 4,
  },
  weightTypeDropdown: {
    flex: 1,
  },
  weightNumberInput: {
    flex: 0.5,
    minWidth: 80,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  weightInput: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inlineSmall: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  removeDivisionButton: {
    backgroundColor: '#dc3545',
    marginTop: 12,
  },
};

export default DivisionCard;