import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Button } from '@/src/components/ui/Button';
import { ValidationError } from '@/src/utils/validation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const { signIn } = useAuth();

  const getErrorMessage = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const handleLogin = async () => {
    const newErrors: ValidationError[] = [];
    
    if (!email) newErrors.push({ field: 'email', message: 'Email is required' });
    if (!password) newErrors.push({ field: 'password', message: 'Password is required' });
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors([]);
      
      // Attempt to sign in
      const hasProfile = await signIn({ email, password });
      
      // Only navigate if sign in was successful
      if (hasProfile === true) {
        router.replace('/(tabs)');
      } else if (hasProfile === false) {
        router.replace('/(onboarding)/CreateProfile');
      }
      
    } catch (error) {
      // Clear password field on authentication error
      setPassword('');
      setErrors([{ 
        field: 'general', 
        message: error instanceof Error ? error.message : 'Invalid email or password'
      }]);
      // Make sure loading is set to false on error
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Back"
        onPress={() => router.back()}
        size="sm"
        variant="outline"
        style={styles.backButton}
      />
      <Text style={styles.title}>Welcome Back</Text>
      <View style={styles.form}>
        {getErrorMessage('general') && (
          <Text style={[styles.errorText, styles.generalError]}>{getErrorMessage('general')}</Text>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, getErrorMessage('email') && styles.inputError]}
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors(errors.filter(error => error.field !== 'email'));
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {getErrorMessage('email') && (
            <Text style={styles.errorText}>{getErrorMessage('email')}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, getErrorMessage('password') && styles.inputError]}
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors(errors.filter(error => error.field !== 'password'));
            }}
            secureTextEntry
          />
          {getErrorMessage('password') && (
            <Text style={styles.errorText}>{getErrorMessage('password')}</Text>
          )}
        </View>

        <Button
          title={isLoading ? 'Loading...' : 'Login'}
          onPress={handleLogin}
          disabled={isLoading}
          size="xl"
          variant="primary"
          style={{ marginTop: 20 }}
        />
        <Button
          title="Don't have an account? Sign up"
          onPress={() => router.push('/(auth)/Signup')}
          size="xl"
          variant="outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 50,
  },
  form: {
    gap: 15,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  generalError: {
    marginTop: 10,
    marginBottom: 10,
  },
});
