import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import { useAuthStore } from '@/src/stores/authStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUpWithEmail, loading } = useAuthStore();

  const handleSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
      router.replace('/(protected)/create-profile'); // Redirect to profile creation
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message);
    }
  };

  return (
    <ThemedCard style={styles.container}>
      <ThemedText type="title" style={styles.title}>Sign Up</ThemedText>

      <ThemedCard style={styles.inputContainer}>
        <ThemedInput
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          icon={<Ionicons name="mail-outline" size={20} color="#405059" />}
        />
      </ThemedCard>

      <ThemedCard style={styles.inputContainer}>
        <ThemedInput
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon={<Ionicons name="lock-closed-outline" size={20} color="#405059" />}
        />
      </ThemedCard>

      <ThemedCard style={styles.buttonContainer}>
        <ThemedButton title={loading ? "Signing Up..." : "Sign Up"} onPress={handleSignUp} disabled={loading} />
      </ThemedCard>

      <ThemedButton title="Go to Login" onPress={() => router.replace('/login')} variant="outline" />
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 16,
  },
});
