import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Animated } from 'react-native';

import CreateCompetitionScreen, { CreateCompetitionScreenRef } from '@/src/_features/competition/screens/CreateCompetitionScreen';
import CreateTrainingScreen, { CreateTrainingScreenRef } from '@/src/_features/training/screens/CreateTrainingScreen';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import Alert from '@/src/components/ui/molecules/Alert';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/stores/authStore';

type TabType = 'training' | 'competition';

export default function CreateIndexScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('training');
  const [refsReady, setRefsReady] = useState(false);
  const { session } = useAuthStore();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [pendingTab, setPendingTab] = useState<TabType | null>(null);

  // Refs for child screens
  const trainingScreenRef = useRef<CreateTrainingScreenRef>(null);
  const competitionScreenRef = useRef<CreateCompetitionScreenRef>(null);

  // Check if refs are ready and monitor auth state
  useEffect(() => {
    const checkRefs = () => {
      const hasTrainingRef = trainingScreenRef.current !== null;
      if (hasTrainingRef) {
        setRefsReady(true);
      }
    };
    
    // Check refs on mount
    checkRefs();
    const interval = setInterval(checkRefs, 100);
    
    // Clear interval once refs are ready
    if (refsReady) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [refsReady]);
  
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const tabBackgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({ light: '#e1e5e9', dark: '#333' }, 'icon');
  const iconColor = useThemeColor({}, 'icon');

  const handleSave = () => {
    const currentScreenRef = selectedTab === 'training' ? trainingScreenRef : competitionScreenRef;
    if (currentScreenRef.current) {
      currentScreenRef.current.handleSave();
    }
  };

  const handleTabSwitch = (targetTab: TabType) => {
    // Don't warn if switching to the same tab
    if (targetTab === selectedTab) return;

    // Show alert and store pending tab
    setPendingTab(targetTab);
    setShowAlert(true);
  };

  const handleConfirmSwitch = () => {
    if (pendingTab) {
      setSelectedTab(pendingTab);
    }
    setShowAlert(false);
    setPendingTab(null);
  };

  const handleCancelSwitch = () => {
    setShowAlert(false);
    setPendingTab(null);
  };

  const renderContent = () => {
    // Remount screens on tab switch (no data persistence)
    switch (selectedTab) {
      case 'training':
        return <CreateTrainingScreen ref={trainingScreenRef} />;
      case 'competition':
        return <CreateCompetitionScreen ref={competitionScreenRef} />;
      default:
        return <CreateTrainingScreen ref={trainingScreenRef} />;
    }
  };

  // Animated header height based on scroll
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [60, 0],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Fixed Header */}
      <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => { if (router.canGoBack()) { router.back(); } else { router.replace('/(protected)/(tabs)'); } }}
        >
          <Ionicons name="arrow-back" size={24} color={iconColor} />
        </TouchableOpacity>

        <ThemedText style={[styles.headerTitle, { color: textColor }]}>
          Log
        </ThemedText>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleSave}
          testID="save-button"
        >
          <ThemedText style={[
            styles.saveText,
            { color: tintColor }
          ]}>
            Save
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Scrollable Tabs */}
      <Animated.View
        style={[
          styles.tabContainer,
          {
            borderBottomColor: borderColor,
            height: headerHeight,
            opacity: headerOpacity,
            overflow: 'hidden',
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'training' && styles.activeTab,
            { backgroundColor: tabBackgroundColor }
          ]}
          onPress={() => handleTabSwitch('training')}
          testID="log-training-tab"
        >
          <ThemedText
            style={[
              styles.tabText,
              { color: selectedTab === 'training' ? tintColor : textColor }
            ]}
          >
            Training
          </ThemedText>
          {selectedTab === 'training' && (
            <ThemedView style={[styles.activeIndicator, { backgroundColor: tintColor }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'competition' && styles.activeTab,
            { backgroundColor: tabBackgroundColor }
          ]}
          onPress={() => handleTabSwitch('competition')}
          testID="log-competition-tab"
        >
          <ThemedText
            style={[
              styles.tabText,
              { color: selectedTab === 'competition' ? tintColor : textColor }
            ]}
          >
            Competition
          </ThemedText>
          {selectedTab === 'competition' && (
            <ThemedView style={[styles.activeIndicator, { backgroundColor: tintColor }]} />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Content with scroll listener */}
      <Animated.ScrollView
        style={styles.content}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {renderContent()}
      </Animated.ScrollView>

      {/* Tab Switch Warning Alert */}
      <Alert
        visible={showAlert}
        title="Switch Tab?"
        message={`Any unsaved ${selectedTab === 'training' ? 'Training' : 'Competition'} data will be discarded. Continue?`}
        actions={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: handleCancelSwitch,
          },
          {
            text: 'Switch',
            style: 'destructive',
            onPress: handleConfirmSwitch,
          },
        ]}
        onDismiss={handleCancelSwitch}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 60,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeTab: {
    // Additional styling for active tab if needed
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  content: {
    flex: 1,
  },
});
