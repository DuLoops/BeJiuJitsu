import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownPickerProps {
  options: DropdownOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: any;
  autoOpen?: boolean;
  testID?: string;
  // Optional color provider for options; useful for showing belt colors, etc.
  getOptionColor?: (value: string) => string | undefined;
}

export interface DropdownPickerRef {
  open: () => void;
  close: () => void;
}

const DropdownPicker = forwardRef<DropdownPickerRef, DropdownPickerProps>(({
  options,
  selectedValue,
  onValueChange,
  placeholder = "Select an option",
  style,
  autoOpen = false,
  testID,
  getOptionColor,
}, ref) => {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border'); // Added border color

  const selectedOption = options.find(option => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  const selectedColor = selectedOption && getOptionColor ? getOptionColor(selectedOption.value) : undefined;

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  const handleBackdropPress = () => {
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          { borderColor: tintColor, backgroundColor }, // Use themed background
          style,
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
        testID={testID}
      >
        {selectedColor ? <View style={[styles.colorDot, { backgroundColor: selectedColor }]} /> : null}
        <ThemedText style={styles.dropdownText}>
          {displayText}
        </ThemedText>
        <Ionicons
          name="chevron-down"
          size={20}
          color={iconColor}
          style={[
            styles.dropdownIcon,
            isOpen && styles.dropdownIconOpen
          ]}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleBackdropPress}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleBackdropPress}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={[styles.modalContent, { backgroundColor }]}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <ScrollView
                style={styles.optionsList}
                showsVerticalScrollIndicator={false}
              >
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionItem,
                      { borderBottomColor: borderColor }, // Use themed border
                      option.value === selectedValue && {
                        backgroundColor: tintColor + '20'
                      },
                      index === options.length - 1 && styles.lastOption
                    ]}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                    testID={`${testID}-option-${option.value}`}
                  >
                    {getOptionColor ? (
                      <View style={[styles.colorDot, { backgroundColor: getOptionColor(option.value) }]} />
                    ) : null}
                    <ThemedText
                      style={[
                        styles.optionText,
                        option.value === selectedValue && {
                          color: tintColor,
                          fontWeight: '600'
                        }
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                    {option.value === selectedValue && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={tintColor}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
});

DropdownPicker.displayName = 'DropdownPicker';

export default DropdownPicker;

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    // backgroundColor: '#f9f9f9', // Removed hardcoded color
    minHeight: 50,
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownIcon: {
    marginLeft: 8,
    transform: [{ rotate: '0deg' }],
  },
  dropdownIconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 300,
    maxHeight: '60%',
  },
  modalContent: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    // borderBottomColor: '#f0f0f0', // Removed hardcoded color
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});