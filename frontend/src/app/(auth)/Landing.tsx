import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/src/components/ui/Button';
import {Text} from '@/src/components/ui/Text';

export default function Landing() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Find Your Way</Text>
        <Text style={styles.title}>BeJiuJitsu</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.primaryButtons}>
          <Button
            title="Log In"
            onPress={() => router.push('/(auth)/Login')}
            size="xl"
            variant="primary"
          />
          
          <Button
            title="Create an Account"
            onPress={() => router.push('/(auth)/Signup')}
            size="xl"
            variant="primary"
          />
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>or</Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.oauthButtons}>
          <Button
            title="Continue with Google"
            onPress={() => {/* Implement Google OAuth */}}
            size="xl"
            variant="outline"
          />

          <Button
            title="Continue with Apple"
            onPress={() => {/* Implement Apple OAuth */}}
            size="xl"
            variant="outline"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 30, // Increased gap between sections
  },
  primaryButtons: {
    gap: 15,
  },
  oauthButtons: {
    gap: 15,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDDDDD',
  },
  separatorText: {
    color: '#666666',
    fontSize: 14,
  },
});
