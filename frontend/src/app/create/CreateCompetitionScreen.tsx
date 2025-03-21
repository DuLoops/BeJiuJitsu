import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { NumberInput } from '@/src/components/ui/NumberInput';
import { SegmentedControl } from '@/src/components/ui/SegmentedControl';
import { Button } from '@/src/components/ui/Button';
import { Detail } from '@/src/components/create/competition/Detail';

interface MatchStats {
  submission: number;
  points: number;
  overtime: number;
  decision: number;
}

interface MatchData {
  winCount: number;
  loseCount: number;
  winDetails: string;
  loseDetails: string;
  winStats: MatchStats;
  loseStats: MatchStats;
}

interface CompetitionData {
  Gi: MatchData;
  NoGi: MatchData;
}

const defaultMatchData: MatchData = {
  winCount: 0,
  loseCount: 0,
  winDetails: '',
  loseDetails: '',
  winStats: { submission: 0, points: 0, overtime: 0, decision: 0 },
  loseStats: { submission: 0, points: 0, overtime: 0, decision: 0 },
};

export default function CreateCompetitionScreen() {
  const [formData, setFormData] = useState<CompetitionData>({
    Gi: { ...defaultMatchData },
    NoGi: { ...defaultMatchData },
  });

  const [selectedType, setSelectedType] = useState<'Gi' | 'NoGi'>('Gi');
  const [selectedResult, setSelectedResult] = useState<'Win' | 'Loss'>('Win');

  const currentData = formData[selectedType];

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <View style={styles.container}>
      <View >
        <Text style={styles.sectionTitle}>Competition Type</Text>
        <SegmentedControl
          segments={['Gi', 'NoGi']}
          selectedSegment={selectedType}
          onSegmentChange={(segment) => setSelectedType(segment as 'Gi' | 'NoGi')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{selectedType} Match Results</Text>
        <View style={styles.row}>
          <NumberInput
            value={currentData.winCount}
            onChange={value => setFormData(prev => ({
              ...prev,
              [selectedType]: {
                ...prev[selectedType],
                winCount: value
              }
            }))}
            minValue={0}
            label="Wins"
          />
          <NumberInput
            value={currentData.loseCount}
            onChange={value => setFormData(prev => ({
              ...prev,
              [selectedType]: {
                ...prev[selectedType],
                loseCount: value
              }
            }))}
            minValue={0}
            label="Losses"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{selectedResult} Details</Text>
        <SegmentedControl
          segments={['Win', 'Loss']}
          selectedSegment={selectedResult}
          onSegmentChange={(segment) => setSelectedResult(segment as 'Win' | 'Loss')}
        />
        <Detail
          data={selectedResult === 'Win' ? currentData.winStats : currentData.loseStats}
          onChange={(data) => {
            const key = selectedResult === 'Win' ? 'winStats' : 'loseStats';
            setFormData(prev => ({
              ...prev,
              [selectedType]: {
                ...prev[selectedType],
                [key]: data
              }
            }));
          }}
          type={selectedResult === 'Win' ? 'win' : 'loss'}
        />
        <View style={styles.skillSection}>
          <Button variant='outline' title="Create new skill" onPress={() => { }} />
          <Button variant='outline' title="Add skill experience" onPress={() => { }} />
        </View>
        <View style={styles.noteSection}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={selectedResult === 'Win' ? currentData.winDetails : currentData.loseDetails}
            onChangeText={(text) => {
              const key = selectedResult === 'Win' ? 'winDetails' : 'loseDetails';
              setFormData(prev => ({
                ...prev,
                [selectedType]: {
                  ...prev[selectedType],
                  [key]: text
                }
              }));
            }}
            style={styles.textArea}
          />
        </View>

      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Save Competition"
          onPress={handleSubmit}
          size="xl"
          variant="primary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
    height: 100,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',


  },
  skillSection: {
    marginTop: 16,
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'space-between',
  },
  noteSection: {
    marginTop: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 8
  },
});
