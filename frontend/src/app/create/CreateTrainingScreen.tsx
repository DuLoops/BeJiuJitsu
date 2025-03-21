import React, { useEffect, useState } from 'react';
import { View, TextInput, Switch, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TrainingPost } from '@/src/types/post';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '@/src/components/ui/Button';

// Add type for navigation
type RootStackParamList = {
  Home: undefined;
  CreateSkillScreen: undefined;
  // Add other screens as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CreateTrainingScreen() {
  const router = useRouter();
  const navigation = useNavigation<NavigationProp>();
  const [isGi, setIsGi] = useState(true);
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState('60');
  const [note, setNote] = useState('');

  useEffect(() => {
    const formData: TrainingPost = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Training',
      type: 'training',
      createdAt: new Date(),
      trainingDate: date,
      duration: parseInt(duration),
      bjjForm: isGi ? 'gi' : 'nogi',
      note,
    };
    // setFormData(formData);
  }, [date, duration, isGi, note]);

  return (
    <View style={styles.container}>
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          const selected = selectedDate || date;
          setDate(selected);
        }}
      />
      <TextInput
        value={duration}
        onChangeText={setDuration}
        placeholder="Duration (minutes)"
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.switchContainer}>
        <Text>Gi</Text>
        <Switch value={isGi} onValueChange={setIsGi} />
        <Text>NoGi</Text>
      </View>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Notes"
        multiline
        style={styles.noteInput}
      />
      <Button
        title="Create Skill"
        onPress={() => navigation.navigate('CreateSkillScreen')}
        size="xl"
      />
      {/* <FlatList
        data={skills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    height: 150,
    textAlignVertical: 'top',
    borderRadius: 5,
  },
});
