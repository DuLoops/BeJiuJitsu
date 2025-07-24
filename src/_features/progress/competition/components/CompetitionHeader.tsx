import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface CompetitionHeaderProps {
  onDone?: () => void;
}

const CompetitionHeader: React.FC<CompetitionHeaderProps> = ({ onDone }) => {
  const iconColor = useThemeColor({}, 'icon');

  const handleBack = () => {
    router.back();
  };

  const handleDone = () => {
    if (onDone) {
      onDone();
    } else {
      router.back();
    }
  };

  return (
    <ThemedView style={styles.header}>
      <TouchableOpacity onPress={handleBack}>
        <Ionicons name="chevron-back" size={24} color={iconColor} />
      </TouchableOpacity>
      <ThemedText style={styles.headerTitle}>Competition</ThemedText>
      <ThemedButton title="Done" onPress={handleDone} />
    </ThemedView>
  );
};

export default CompetitionHeader;

const styles = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    flex: 1,
  },
}; 