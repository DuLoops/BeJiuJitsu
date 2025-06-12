import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { router } from 'expo-router';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const CreateModal = () => {
  return (
    <Modal
    animationType="fade"
    transparent={true}
  >
    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}  >
      <View style={{ width: 200, padding: 20, backgroundColor: 'white', borderRadius: 10, marginBottom: 80, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Pressable 
          style={{ width: '100%', paddingVertical: 4, alignItems: 'center' }}
          onPress={() => { router.push('/(protected)/(modal)/create/training'); }}
        >
          <ThemedText>Training</ThemedText>
        </Pressable>
        <View style={{ height: 1, backgroundColor: '#ccc', width: '100%', marginVertical: 10 }} />
        <Pressable
          style={{ width: '100%', paddingVertical: 4, alignItems: 'center' }}
          onPress={() => { router.push('/(protected)/(modal)/create/competition'); }}
        >
          <ThemedText>Competition</ThemedText>
        </Pressable>
        <View style={{ height: 1, backgroundColor: '#ccc', width: '100%', marginVertical: 10 }} />
        <Pressable
          style={{ width: '100%', paddingVertical: 4, alignItems: 'center' }}
          onPress={() => { router.push('/(protected)/(modal)/create/skill'); }}
        >
          <ThemedText>Skill</ThemedText>
        </Pressable>
      </View>
    </View>
  </Modal>
  )
}

const createDashboard = () => {
  return (
    <View>
      <Text>createDashboard</Text>
    </View>
  )
}


export default createDashboard

const styles = StyleSheet.create({})