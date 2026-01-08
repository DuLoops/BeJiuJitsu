import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';




export default function ProtectedTabsLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const tabBarBackground = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
  const tabBarActiveTintColor = useThemeColor({}, 'tabIconSelected');
  const tabBarInactiveTintColor = useThemeColor({}, 'tabIconDefault');
  const tabBarBorderColor = useThemeColor({}, 'border');

  const handleLogTraining = () => {
    setModalVisible(false);
    router.push('/(protected)/(modal)/create/training');
  };

  const handleLogCompetition = () => {
    setModalVisible(false);
    router.push('/(protected)/(modal)/create/competition');
  };

  const handleRecordRoll = () => {
    setModalVisible(false);
    router.push('/(protected)/(modal)/create/record');
  };

  const handlePublishPost = () => {
    setModalVisible(false);
    router.push('/(protected)/(modal)/create/post');
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: tabBarBackground,
            borderTopColor: tabBarBorderColor,
            borderTopWidth: 1, // Ensure border is visible
          },
          tabBarActiveTintColor: tabBarActiveTintColor,
          tabBarInactiveTintColor: tabBarInactiveTintColor,
        }}
        initialRouteName='index'
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Explore',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'bulb' : 'bulb-outline'} size={30} color={color} testID="explore-tab" />
            ),
          }} />
        <Tabs.Screen
          name='create'
          options={{
            title: 'Create',
            tabBarButton: () => (
              <Pressable style={{ alignItems: 'center', margin: 'auto' }} onPress={() => setModalVisible(true)} testID="create-tab">
                <Ionicons name={modalVisible ? 'add-circle' : 'add-circle-outline'} size={40} color={modalVisible ? tabBarActiveTintColor : tabBarInactiveTintColor} />
              </Pressable>
            ),
          }} />
        <Tabs.Screen name="progress" options={{
          title: 'Progress',
          tabBarIcon: ({ focused, color }) =>
            <MaterialCommunityIcons name={focused ? 'signal-cellular-3' : 'signal-cellular-1'} size={30} color={color} testID="progress-tab" />

        }} />
      </Tabs>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <ThemedCard style={[styles.contentContainer, { backgroundColor }]}>
              <View style={styles.handleBar} />
              <View style={styles.content}>
                <View style={styles.buttonContainer}>
                  <ThemedButton
                    title="Training"
                    variant="primary"
                    size="lg"
                    onPress={handleLogTraining}
                    icon={<Ionicons name="barbell" size={24} color="white" />}
                    style={styles.button}
                    testID="log-training-button"
                  />

                  <ThemedButton
                    title="Competition"
                    variant="primary"
                    size="lg"
                    onPress={handleLogCompetition}
                    icon={<Ionicons name="trophy" size={24} color="white" />}
                    style={styles.button}
                    testID="log-competition-button"
                  />

                  <ThemedButton
                    title="Record"
                    variant="primary"
                    size="lg"
                    onPress={handleRecordRoll}
                    icon={<Ionicons name="videocam" size={24} color="white" />}
                    style={styles.button}
                    testID="record-roll-button"
                  />

                  <ThemedButton
                    title="Post"
                    variant="primary"
                    size="lg"
                    onPress={handlePublishPost}
                    icon={<Ionicons name="create" size={24} color="white" />}
                    style={styles.button}
                    testID="publish-post-button"
                  />
                </View>
              </View>
            </ThemedCard>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '80%',
  },
  contentContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
});