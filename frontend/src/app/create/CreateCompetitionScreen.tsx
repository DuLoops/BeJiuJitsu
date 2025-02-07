import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Text } from 'react-native';
import { NumberInput } from '@/src/components/ui/NumberInput';
import { ChooseTypeView } from '@/src/components/create/competition/ChooseTypeView';
import { SegmentedControl } from '@/src/components/ui/SegmentedControl';

interface CompetitionData {
  type: 'gi' | 'nogi' | 'both';
  matchCount: number;
  winCount: number;
  loseCount: number;
  winDetails: string;
  loseDetails: string;
  winStats: {
    submission: number;
    points: number;
    overtime: number;
    decision: number;
  };
  loseStats: {
    submission: number;
    points: number;
    overtime: number;
    decision: number;
  };
}

export default function CreateCompetitionScreen () {
  const [formData, setFormData] = useState<CompetitionData>({
    type: 'gi',
    matchCount: 0,
    winCount: 0,
    loseCount: 0,
    winDetails: '',
    loseDetails: '',
    winStats: {
      submission: 0,
      points: 0,
      overtime: 0,
      decision: 0,
    },
    loseStats: {
      submission: 0,
      points: 0,
      overtime: 0,
      decision: 0,
    },
  });

  const [selectedSegment, setSelectedSegment] = useState<'Win' | 'Loss'>('Win');

  const handleSubmit = () => {
    // Handle form submission
    console.log(formData);
  };

  const renderDetails = () => {
    const isWin = selectedSegment === 'Win';
    const stats = isWin ? formData.winStats : formData.loseStats;
    
    return (
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <NumberInput
            label="Submission"
            value={stats.submission}
            onChange={(value) => {
              const key = isWin ? 'winStats' : 'loseStats';
              setFormData(prev => ({
                ...prev,
                [key]: { ...stats, submission: value }
              }));
            }}
            minValue={0}
          />
          <NumberInput
            label="Points"
            value={stats.points}
            onChange={(value) => {
              const key = isWin ? 'winStats' : 'loseStats';
              setFormData(prev => ({
                ...prev,
                [key]: { ...stats, points: value }
              }));
            }}
            minValue={0}
          />
        </View>
        <View style={styles.row}>
          <NumberInput
            label="Overtime"
            value={stats.overtime}
            onChange={(value) => {
              const key = isWin ? 'winStats' : 'loseStats';
              setFormData(prev => ({
                ...prev,
                [key]: { ...stats, overtime: value }
              }));
            }}
            minValue={0}
          />
          <NumberInput
            label="Decision"
            value={stats.decision}
            onChange={(value) => {
              const key = isWin ? 'winStats' : 'loseStats';
              setFormData(prev => ({
                ...prev,
                [key]: { ...stats, decision: value }
              }));
            }}
            minValue={0}
          />
        </View>
        <View style={styles.noteSection}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={isWin ? formData.winDetails : formData.loseDetails}
            onChangeText={(text) => {
              const key = isWin ? 'winDetails' : 'loseDetails';
              setFormData(prev => ({ ...prev, [key]: text }));
            }}
            style={styles.textArea}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ChooseTypeView 
        value={formData.type}
        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
      />

      {/* <View style={styles.section}>
        <Text>Number of Matches</Text>
        <NumberInput 
          value={formData.matchCount}
          onChange={value => setFormData(prev => ({ ...prev, matchCount: value }))}
          minValue={0}
        />
      </View> */}

      <View style={styles.section}>
        <Text>Match Results</Text>
        <View style={styles.row}>
          <NumberInput 
            value={formData.winCount}
            onChange={value => setFormData(prev => ({ ...prev, winCount: value }))}
            minValue={0}
            label="Wins"
          />
          <NumberInput 
            value={formData.loseCount}
            onChange={value => setFormData(prev => ({ ...prev, loseCount: value }))}
            minValue={0}
            label="Losses"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <SegmentedControl
          segments={['Win', 'Loss']}
          selectedSegment={selectedSegment}
          onSegmentChange={(segment) => setSelectedSegment(segment as 'Win' | 'Loss')}
        />
        {renderDetails()}
      </View>

      <Button
        title="Save Competition"
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
  detailsContainer: {
    marginTop: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,

  },
  noteSection: {
    marginTop: 16,
  },
});
