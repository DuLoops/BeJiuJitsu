import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ModalHeaderProps {
  title: string;
  onSave: () => void;
  saveDisabled?: boolean;
  saveTitle?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  title, 
  onSave, 
  saveDisabled = false,
  saveTitle = "Save"
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(protected)/(tabs)');
    }
  };

  return (
    <ThemedView style={[styles.header, { backgroundColor }]}>
      <TouchableOpacity 
        onPress={handleGoBack}
        style={styles.headerButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color={textColor} />
      </TouchableOpacity>
      
      <ThemedText style={styles.headerTitle}>{title}</ThemedText>
      
      <TouchableOpacity 
        onPress={onSave}
        style={[styles.headerButton, saveDisabled && styles.disabledButton]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        disabled={saveDisabled}
      >
        <Ionicons 
          name="checkmark" 
          size={24} 
          color={saveDisabled ? '#ccc' : '#007AFF'} 
        />
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e1e1e1',
  },
  headerButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ModalHeader; 