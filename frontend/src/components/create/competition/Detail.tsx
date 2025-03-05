import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NumberInput } from '@/src/components/ui/NumberInput';

interface DetailData {
  submission: number;
  points: number;
  overtime: number;
  decision: number;
}

interface DetailProps {
  data: DetailData;
  onChange: (data: DetailData) => void;
  type: 'win' | 'loss';
}

export const Detail: React.FC<DetailProps> = ({
  data,
  onChange,
  type
}) => {

  const handleChange = (key: keyof DetailData, value: number) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.row}>
          <NumberInput
            label="Submission"
            value={data.submission}
            onChange={(value) => handleChange('submission', value)}
            minValue={0}
          />
          <NumberInput
            label="Points"
            value={data.points}
            onChange={(value) => handleChange('points', value)}
            minValue={0}
          />
        </View>
        <View style={styles.row}>
          <NumberInput
            label="Overtime"
            value={data.overtime}
            onChange={(value) => handleChange('overtime', value)}
            minValue={0}
          />
          <NumberInput
            label="Decision"
            value={data.decision}
            onChange={(value) => handleChange('decision', value)}
            minValue={0}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginVertical: 16
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  }
});
