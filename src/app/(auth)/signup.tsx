import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useAuthStore } from '@/src/store/authStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, TextInput } from 'react-native';

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
    <ThemedView style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <ThemedText type="title" style={{ marginBottom: 16, textAlign: 'center' }}>Sign Up</ThemedText>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 8, marginBottom: 8, borderColor: 'gray' }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 8, marginBottom: 16, borderColor: 'gray' }}
      />
      <ThemedButton title={loading ? "Signing Up..." : "Sign Up"} onPress={handleSignUp} disabled={loading} />
      <ThemedButton title="Go to Login" onPress={() => router.replace('/login')} />
    </ThemedView>
  );
}
