import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserSkillList from '@/src/features/skill/components/UserSkillList';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // For the + icon

export default function SkillsTabScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.title}>My Jiu-Jitsu Skills</ThemedText>
        <ThemedButton 
          onPress={() => router.push('/(protected)/(modal)/create/skill')} 
          title="Add Skill" 
          icon={<Ionicons name="add-circle-outline" size={20} color={"white"} />} // Adjust color as per ThemedButton props
          style={styles.addButton} // Style for the button itself
          textStyle={styles.addButtonText} // Style for the text if ThemedButton supports it
        />
      </View>
      <UserSkillList />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Removed padding here to allow UserSkillList to control its own padding if needed
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 25 : 15, // Adjust for status bar on Android
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Use theme color later
    backgroundColor: '#f8f8f8', // Use theme color later
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // Add color from theme
  },
  addButton: {
    // Style for the button container, ThemedButton might have its own defaults
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButtonText: {
    // Style for the button text if ThemedButton allows direct text styling
    // fontSize: 16, // Example
  }
});
