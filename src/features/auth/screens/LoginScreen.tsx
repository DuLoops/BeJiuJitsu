import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import { ThemedText } from '@/src/components/ui/atoms/ThemedText';
import { AuthContext } from '@/src/context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  if (!auth) {
    return (
      <View style={styles.container}>
        <Text>Error: Auth context is not available. Ensure LoginScreen is wrapped by AuthProvider.</Text>
      </View>
    );
  }

  const { loading, signInWithEmail, signUpWithEmail } = auth;

  const handleSignIn = async () => {
    try {
      await signInWithEmail(email, password);
      setErrorMessage(null);
      router.replace('/');
    } catch (error: any) {
      let message = error?.message || error?.error_description || error?.toString() || 'Sign in failed';
      console.log(message);
      setErrorMessage(message);
    }
  };

  const handleSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
      setErrorMessage('Please check your inbox!');
    } catch (error: any) {
      setErrorMessage(error.message || 'Sign up failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <ThemedInput
          label="Email"
          icon={<Ionicons name="mail" size={24} color="black" />}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <ThemedInput
          label="Password"
          icon={<Ionicons name="lock-closed" size={24} color="black" />}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <ThemedButton disabled={loading} onPress={handleSignIn} title="Sign in" />
      </View>
      <View style={styles.verticallySpaced}>
        <ThemedButton disabled={loading} onPress={handleSignUp} title="Sign up" />
      </View>
      {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}
    </View>
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