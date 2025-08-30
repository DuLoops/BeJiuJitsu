import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  label?: string;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  date, 
  onDateChange, 
  label = "Date" 
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const tintColor = useThemeColor({}, 'tint');

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate && event.type !== 'dismissed') {
      onDateChange(selectedDate);
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.rowContainer}>
        <ThemedText style={styles.label}>{label}:</ThemedText>
      
        {Platform.OS === 'ios' ? (
          // iOS: Always show compact picker
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="compact"
            onChange={handleDateChange}
            maximumDate={new Date()}
            style={styles.iosDatePicker}
          />
        ) : (
          // Android: Show button that opens modal picker
        <TouchableOpacity 
          style={[styles.dateButton, { borderColor: tintColor }]}
          onPress={showDatePicker}
        >
          <ThemedText style={styles.dateButtonText}>
            {formatDate(date)}
          </ThemedText>
        </TouchableOpacity>
      )}
      </ThemedView>
      
      {/* Android modal picker */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </ThemedView>
  );
};

export default DateSelector;

const styles = {
  container: {
    marginBottom: 16,
    backgroundColor: '#ffffff', // White background for container
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rowContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    flex: 0,
    minWidth: 60,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff', // White background for button
    borderColor: '#e1e5e9',
    flex: 1,
    marginLeft: 16,
  },
  dateButtonText: {
    fontSize: 16,
    textAlign: 'center' as const,
  },
  iosDatePicker: {
    flex: 1,
    marginLeft: 16,
  },
}; 