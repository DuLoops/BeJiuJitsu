import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform } from 'react-native';

import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';

interface TitleAndDateInputProps {
  title: string;
  onTitleChange: (title: string) => void;
  titlePlaceholder?: string;
  date: Date;
  onDateChange: (date: Date) => void;
}

export default function TitleAndDateInput({
  title,
  onTitleChange,
  titlePlaceholder = "Enter title",
  date,
  onDateChange,
}: TitleAndDateInputProps) {
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    onDateChange(currentDate);
  };

  return (
    <>
      {/* Title Input */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionLabel}>Title</ThemedText>
        <ThemedInput
          value={title}
          onChangeText={onTitleChange}
          placeholder={titlePlaceholder}
          style={styles.titleInput}
          testID="competition-title-input"
        />
      </ThemedView>

      {/* Date Picker */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionLabel}>Date</ThemedText>
        {Platform.OS !== 'ios' && (
          <ThemedButton 
            variant="outline"
            onPress={() => setShowDatePicker(true)} 
            title={`Selected: ${date.toLocaleDateString()}`} 
          />
        )}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
      </ThemedView>
    </>
  );
}

const styles = {
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  titleInput: {
    fontSize: 16,
  },
};
