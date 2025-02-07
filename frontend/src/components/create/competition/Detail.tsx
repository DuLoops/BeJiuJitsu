import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Accordion, AccordionItem } from '@/src/components/ui/Accordion';
import { NumberInput } from '@/src/components/ui/NumberInput';

interface DetailData {
  submission: number;
  points: number;
  overtime: number;
  decision: number;
}

interface DetailAccordionProps {
  data: DetailData;
  onChange: (data: DetailData) => void;
  type: 'win' | 'loss';
}

export const DetailAccordion: React.FC<DetailAccordionProps> = ({
  data,
  onChange,
  type
}) => {
  const title = type === 'win' ? 'Win Details' : 'Loss Details';

  const handleChange = (key: keyof DetailData, value: number) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <Accordion>
      <AccordionItem title={title}>
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
      </AccordionItem>
    </Accordion>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
