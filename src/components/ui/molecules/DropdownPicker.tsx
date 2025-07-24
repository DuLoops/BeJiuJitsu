import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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
}

const DropdownPicker: React.FC<DropdownPickerProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = "Select an option",
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'background');

  const selectedOption = options.find(option => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

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
          { borderColor: tintColor },
          style,
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
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
                      option.value === selectedValue && {
                        backgroundColor: tintColor + '20'
                      },
                      index === options.length - 1 && styles.lastOption
                    ]}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                  >
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
};

export default DropdownPicker;

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f9f9f9',
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
    borderBottomColor: '#f0f0f0',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});
