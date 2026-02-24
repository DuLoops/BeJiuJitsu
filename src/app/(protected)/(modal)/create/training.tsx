import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';

import CreateTrainingScreen, { CreateTrainingScreenRef } from '@/src/_features/training/screens/CreateTrainingScreen';
import ModalHeader from '@/src/components/ui/molecules/ModalHeader';
import { useThemeColor } from '@/src/hooks/useThemeColor';

export default function TrainingScreen() {
  const [isSaving, setIsSaving] = useState(false);
  const trainingScreenRef = useRef<CreateTrainingScreenRef>(null);

  const backgroundColor = useThemeColor({}, 'background');

  const handleSave = async () => {
    if (!trainingScreenRef.current) return;

    try {
      setIsSaving(true);
      await trainingScreenRef.current.handleSave();
      // Note: The CreateTrainingScreen handles navigation after successful save
    } catch (error) {
      console.error('Error saving training:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveDisabled = isSaving || (trainingScreenRef.current && !trainingScreenRef.current.isValid());

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ModalHeader
        title="Log Training"
        onSave={handleSave}
        saveDisabled={isSaveDisabled}
        saveTitle={isSaving ? 'Saving...' : 'Save'}
      />
      <CreateTrainingScreen ref={trainingScreenRef} />
    </SafeAreaView>
  );
}
