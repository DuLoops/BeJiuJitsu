import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

import CreateCompetitionScreen, { CreateCompetitionScreenRef } from '@/src/_features/competition/screens/CreateCompetitionScreen';
import CreateTrainingScreen, { CreateTrainingScreenRef } from '@/src/_features/training/screens/CreateTrainingScreen';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/stores/authStore';

type TabType = 'training' | 'competition';

export default function CreateIndexScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('training');
  const [refsReady, setRefsReady] = useState(false);
  const { session } = useAuthStore(); // This will cause re-render when auth state changes
  
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



  const renderContent = () => {
    switch (selectedTab) {
      case 'training':
        return <CreateTrainingScreen ref={trainingScreenRef} />;
      case 'competition':
        return <CreateCompetitionScreen ref={competitionScreenRef} />;
      default:
        return <CreateTrainingScreen ref={trainingScreenRef} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header Navigation */}
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

      {/* Toggle Navigation */}
      <ThemedView style={[styles.tabContainer, { borderBottomColor: borderColor }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'training' && styles.activeTab,
            { backgroundColor: tabBackgroundColor }
          ]}
          onPress={() => setSelectedTab('training')}
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
          onPress={() => setSelectedTab('competition')}
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
      </ThemedView>

      {/* Content */}
      <ThemedView style={styles.content}>
        {renderContent()}
      </ThemedView>
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
