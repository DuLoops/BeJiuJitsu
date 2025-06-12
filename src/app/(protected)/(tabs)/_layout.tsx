import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function ProtectedTabsLayout() {
  const router = useRouter();
  
  return (
      <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: { display: 'flex', flexDirection: 'row', alignItems: 'center' } }} initialRouteName='index'>
        <Tabs.Screen name="index" options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) =>
            <FontAwesome5 name={'scroll'} size={24} color={focused ? '#000' : '#666'} />

        }} />
        <Tabs.Screen
          name='createDashboard'
          options={{
            title: 'Create',
            tabBarIcon: ({ focused }) => (
              <Octicons name={'diff-added'} size={26} color={focused ? '#000' : '#666'}  />
            ),
          }} />
        <Tabs.Screen name="community" options={{
          title: 'Community',
          tabBarIcon: ({ focused }) => (
            <FontAwesome5 name={'compass'} size={26} color={focused ? '#000' : '#666'} />
          )
        }} />
      </Tabs>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    
  }
});