import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';

import CreateCompetitionScreen, { CreateCompetitionScreenRef } from '@/src/_features/competition/screens/CreateCompetitionScreen';
import ModalHeader from '@/src/components/ui/molecules/ModalHeader';
import { useThemeColor } from '@/src/hooks/useThemeColor';

export default function CompetitionScreen() {
  const [isSaving, setIsSaving] = useState(false);
  const competitionScreenRef = useRef<CreateCompetitionScreenRef>(null);

  const backgroundColor = useThemeColor({}, 'background');

  const handleSave = async () => {
    if (!competitionScreenRef.current) return;

    try {
      setIsSaving(true);
      await competitionScreenRef.current.handleSave();
      // Note: The CreateCompetitionScreen handles navigation after successful save
    } catch (error) {
      console.error('Error saving competition:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveDisabled = isSaving || (competitionScreenRef.current && !competitionScreenRef.current.isValid());

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ModalHeader
        title="Log Competition"
        onSave={handleSave}
        saveDisabled={isSaveDisabled}
        saveTitle={isSaving ? 'Saving...' : 'Save'}
      />
      <CreateCompetitionScreen ref={competitionScreenRef} />
    </SafeAreaView>
  );
}
