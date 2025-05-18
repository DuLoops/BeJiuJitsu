import ThemedInput from '@/src/components/ui/ThemedInput';
import { AuthContext } from '@/src/context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ThemedButton from '../components/ui/ThemedButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    } catch (error: any) {
      let message = error?.message || error?.error_description || error?.toString() || 'Sign in failed';
      Alert.alert(message);
    }
    router.replace('/');
  };

  const handleSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
      Alert.alert('Please check your inbox for email verification!');
    } catch (error: any) {
      Alert.alert(error.message || 'Sign up failed');
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
});