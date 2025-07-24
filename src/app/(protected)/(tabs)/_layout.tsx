import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import ThemedText from '@/src/components/ui/atoms/ThemedText';
import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';




export default function ProtectedTabsLayout() {

  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <>

      <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: { display: 'flex', flexDirection: 'row', alignItems: 'center' } }} initialRouteName='index'>
        <Tabs.Screen
          name='index'
          options={{
            title: 'Explore',
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? 'bulb' : 'bulb-outline'} size={30} color={focused ? '#000' : '#666'} />
            ),
          }} />
        <Tabs.Screen
          name='createModal'
          options={{
            title: 'Create',
            tabBarButton: () => (
              <Pressable style={{ alignItems: 'center', margin: 'auto' }} onPress={() => setModalVisible(true)}>
                <Ionicons name={modalVisible ? 'add-circle' : 'add-circle-outline'} size={40} color={modalVisible ? '#000' : '#666'} />
              </Pressable>
            ),
          }} />
        <Tabs.Screen name="progress" options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) =>
            <MaterialCommunityIcons name={focused ? 'signal-cellular-3' : 'signal-cellular-1'} size={30} color={focused ? '#000' : '#666'} />

        }} />
      </Tabs>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={{ width: 200, padding: 20, backgroundColor: 'white', borderRadius: 10, marginBottom: 80, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 4, alignItems: 'center' }}
              onPress={() => { setModalVisible(false); router.push('/(protected)/(modal)/create/training'); }}
            >
              <ThemedText>Training</ThemedText>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#ccc', width: '100%', marginVertical: 10 }} />
            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 4, alignItems: 'center' }}
              onPress={() => { setModalVisible(false); router.push('/(protected)/(modal)/create/competition'); }}
            >
              <ThemedText>Competition</ThemedText>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#ccc', width: '100%', marginVertical: 10 }} />
            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 4, alignItems: 'center' }}
              onPress={() => { setModalVisible(false); router.push('/(protected)/(modal)/create/skill'); }}
            >
              <ThemedText>Skill</ThemedText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}