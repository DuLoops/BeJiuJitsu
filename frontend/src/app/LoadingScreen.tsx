import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { Text } from '@/src/components/ui/Text';

export function LoadingScreen() {
  const { activeTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: activeTheme.background.default }]}>
      <ActivityIndicator size="large" color={activeTheme.text.primary} />
      <Text size="lg" weight="medium" style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
});