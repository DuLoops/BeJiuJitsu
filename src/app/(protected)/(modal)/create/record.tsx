import React, { useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import CreateCompetitionScreen, { CreateCompetitionScreenRef } from '@/src/_features/competition/screens/CreateCompetitionScreen';
import ModalHeader from '@/src/components/ui/molecules/ModalHeader';
import { useThemeColor } from '@/src/hooks/useThemeColor';

export default function RecordScreen() {
  const [isSaving, setIsSaving] = useState(false);
  const competitionScreenRef = useRef<CreateCompetitionScreenRef>(null);
  
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const handleSave = async () => {
    if (!competitionScreenRef.current) return;
    
    try {
      setIsSaving(true);
      await competitionScreenRef.current.handleSave();
      // Note: The CreateCompetitionScreen handles navigation after successful save
    } catch (error) {
      console.error('Error saving competition:', error);
      Alert.alert('Error', 'Failed to save competition. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isSaveDisabled = isSaving || (competitionScreenRef.current && !competitionScreenRef.current.isValid);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ModalHeader
        title="Record Video"
        leftButton={{
          icon: <Ionicons name="arrow-back" size={24} color={textColor} />,
          onPress: handleBack,
        }}
        rightButton={{
          text: isSaving ? undefined : 'Save',
          icon: isSaving ? <ActivityIndicator size="small" color={tintColor} /> : undefined,
          onPress: handleSave,
          disabled: isSaveDisabled,
          textColor: isSaveDisabled ? textColor + '60' : tintColor,
        }}
      />
    </SafeAreaView>
  );
}