import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedView from '@/src/components/ui/atoms/ThemedView';
import { useAuthStore } from '@/src/stores/authStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { loading, signInWithEmail, session, isInitialized } = useAuthStore();
  const params = useGlobalSearchParams<{ redirect?: string }>();
  const redirectParam = Array.isArray(params.redirect) ? params.redirect?.[0] : params.redirect;

  // useEffect(() => {
  //   if (isInitialized && session) {
  //     if (redirectParam && redirectParam.startsWith('/')) {
  //       router.replace(redirectParam);
  //     } else {
  //       router.replace('/(protected)/(tabs)');
  //     }
  //   }
  // }, [session, isInitialized, redirectParam]);

  const handleSignIn = async () => {
    setErrorMessage(null);
    try {
      await signInWithEmail(email, password);
    } catch (error: any) {
      let message = error?.message || error?.error_description || error?.toString() || 'Sign in failed';
      console.log(message);
      setErrorMessage(message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.verticallySpaced, styles.mt20]}>
        <ThemedInput
          label="Email"
          icon={<Ionicons name="mail" size={24} color="black" />}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </ThemedView>
      <ThemedView style={styles.verticallySpaced}>
        <ThemedInput
          label="Password"
          icon={<Ionicons name="lock-closed" size={24} color="black" />}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </ThemedView>
      <ThemedView style={[styles.verticallySpaced, styles.mt20]}>
        <ThemedButton disabled={loading} onPress={handleSignIn} title="Sign in" />
      </ThemedView>
      <ThemedView style={styles.verticallySpaced}>
        <ThemedButton onPress={() => router.push('/(auth)/signup')} title="Create account" />
      </ThemedView>
      {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});