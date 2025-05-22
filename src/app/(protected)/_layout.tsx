import { AuthContext } from '@/src/context/AuthContext';
import { Redirect, Stack } from 'expo-router';
import React, { useContext } from 'react';

export const unstable_settings = {
    initialRouteName: "(tabs)", // anchor
  };

  
const ProtectedLayout = () => {
  const auth = useContext(AuthContext)
  
  if(!auth?.session){
    return <Redirect href="/(auth)/login" />
  }
  return (
    <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
        <Stack.Screen name="create-profile" options={{headerShown:false}}/>
        <Stack.Screen name="(modal)/create/skill" options={{headerShown:false, presentation:'modal'}}/>
        <Stack.Screen name="(modal)/create/training" options={{headerShown:false, presentation:'modal'}}/>
        <Stack.Screen name="(modal)/create/competition" options={{headerShown:false, presentation:'modal'}}/>
    </Stack>
  )
}

export default ProtectedLayout

