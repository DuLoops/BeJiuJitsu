import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useUpdateUserSkill } from '@/src/services/userSkillService';
import { UserSkillType, SequenceStep } from '@/src/types/skillType';

export default function EditSkillScreen() {
  const params = useLocalSearchParams<{ userSkillParam: string }>();
  const updateUserSkill = useUpdateUserSkill();
  
  if (!params.userSkillParam) {
    return (
      <View style={styles.container}>
        <Text variant="primary">Error: No skill data provided</Text>
      </View>
    );
  }

  let skillData: UserSkillType;
  try {
    skillData = JSON.parse(params.userSkillParam);
  } catch (error) {
    return (
      <View style={styles.container}>
        <Text variant="primary">Error: Invalid skill data</Text>
      </View>
    );
  }

  const [note, setNote] = useState(skillData.note || '');
  const [sequence, setSequence] = useState<SequenceStep[]>(skillData.sequence || []);

  const handleSave = async () => {
    try {
      await updateUserSkill.mutateAsync({
        skillId: skillData.id,
        data: {
          note,
          sequence
        }
      });
      router.back();
    } catch (error) {
      console.error('Failed to update skill:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="primary" style={styles.skillName}>{skillData.skill.name}</Text>
        <Text variant="muted" style={styles.category}>{skillData.skill.categoryId}</Text>
      </View>

      <View style={styles.section}>
        <Text variant="primary">Notes</Text>
        <TextInput
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
          style={styles.textArea}
          placeholder="Add notes about this skill..."
        />
      </View>

      <View style={styles.section}>
        <Text variant="primary">Sequence</Text>
        <TextInput
          multiline
          numberOfLines={4}
          value={sequence.map(s => s.intention).join('\n')}
          onChangeText={(text) => {
            const newSequence: SequenceStep[] = text.split('\n')
              .filter(s => s.trim())
              .map((intention, index) => ({
                stepNumber: index + 1,
                intention,
                details: []
              }));
            setSequence(newSequence);
          }}
          style={styles.textArea}
          placeholder="Add sequence steps (one per line)..."
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          variant="primary"
          size="xl"
          disabled={updateUserSkill.isPending}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
  },
  skillName: {
    fontSize: 24,
    marginBottom: 4,
  },
  category: {
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
  }
});
