import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { View, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <Tabs screenOptions={{headerShown:false, tabBarShowLabel:false, tabBarStyle: {display: 'flex', flexDirection: 'row', alignItems:'center'}}} initialRouteName='index'>
        <Tabs.Screen name="index" options={{
            title:'Home',
            tabBarIcon:({focused})=>
                <Ionicons name={focused && !modalVisible ? 'home-sharp' : 'home-outline'} size={24} color={focused && !modalVisible ? '#000' : '#666'} />
                // <MaterialCommunityIcons name="home-variant-outline" size={24} color={getColor(focused)} style={{width:'full'}}/>
            
        }}/>
        <Tabs.Screen name='Create' options={{
            title:'Create',
            tabBarButton: () => (
                <Pressable style={{alignItems:'center', margin:'auto' }}  onPress={() => setModalVisible(true)}>
                  <Ionicons name={modalVisible ? 'add-circle' : 'add-circle-outline'} size={modalVisible ? 30: 30} color={modalVisible ? '#000' : '#666'}/>
                </Pressable>
            ),
        }}/>
        <Tabs.Screen name="Profile" options={{
            title:'Profile',
            tabBarIcon:({focused})=>(
                <FontAwesome name={focused && !modalVisible? 'user' : 'user-o'} size={focused ? 26 : 24} color={focused && !modalVisible ? '#000' : '#666'} />
            )
        }}/>
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
              onPress={() => { setModalVisible(false); router.push('/create/CreateTrainingScreen'); }}
            >
              <Text size="lg" weight="medium">Training</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#ccc', width: '100%', marginVertical: 10 }} />
            <TouchableOpacity 
              style={{ width: '100%', paddingVertical: 4, alignItems: 'center' }}
              onPress={() => { setModalVisible(false); router.push('/create/CreateCompetitionScreen'); }}
            >
              <Text size="lg" weight="medium">Competition</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#ccc', width: '100%', marginVertical: 10 }} />
            <TouchableOpacity 
              style={{ width: '100%', paddingVertical: 4, alignItems: 'center' }}
              onPress={() => { setModalVisible(false); router.push('/create/CreateSkillScreen'); }}
            >
              <Text size="lg" weight="medium">Skill</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
