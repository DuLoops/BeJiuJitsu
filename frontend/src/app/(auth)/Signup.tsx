import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Button } from '@/src/components/ui/Button';
import { Text } from '@/src/components/ui/Text';
import { validateAuthForm, ValidationError } from '@/src/utils/validation';
import { API_URL } from '@/src/config/env';
import { useTheme } from '@/src/context/ThemeContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const { signIn } = useAuth();
  const { activeTheme } = useTheme();

  const getErrorMessage = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const handleSignup = async () => {
    const validationErrors = validateAuthForm(email, password);
    
    if (password !== confirmPassword) {
      validationErrors.push({ 
        field: 'confirmPassword', 
        message: 'Passwords do not match' 
      });
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors([]);
      
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }


      const hasProfile = await signIn({ email, password });
      if (hasProfile) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)/CreateProfile');
      }      
    } catch (error) {
      console.error('Signup error:', error);
      setErrors([{ 
        field: 'email', 
        message: error instanceof Error ? error.message : 'Registration failed'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: activeTheme.background.default,
    },
    form: {
      gap: 16,
    },
    inputContainer: {
      gap: 8,
    },
    input: {
      backgroundColor: activeTheme.background.surface,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: activeTheme.border.primary,
      color: activeTheme.text.primary,
    },
    inputError: {
      borderColor: activeTheme.status.error,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginTop: 20,
    },
    titleContainer: {
      marginBottom: 24,
      marginTop: 32,
    },
    buttonContainer: {
      marginTop: 20,
    }
  });
  
  return (
    <View style={styles.container}>
      <Button
        title="Back"
        onPress={() => router.back()}
        size="sm"
        variant="outline"
        style={styles.backButton}
      />
      <Text
        size="xxxl"
        weight="bold"
        style={styles.titleContainer}
      >
        Create Account
      </Text>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text size="md" weight="medium">Email</Text>
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
            <Text size="sm" variant="accent">{getErrorMessage('email')}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text size="md" weight="medium">Password</Text>
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
            <Text size="sm" variant="accent">{getErrorMessage('password')}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text size="md" weight="medium">Confirm Password</Text>
          <TextInput
            style={[styles.input, getErrorMessage('confirmPassword') && styles.inputError]}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrors(errors.filter(error => error.field !== 'confirmPassword'));
            }}
            secureTextEntry
            />
          {getErrorMessage('confirmPassword') && (
            <Text size="sm" variant="accent">{getErrorMessage('confirmPassword')}</Text>
          )}
        </View>
        
        <Button
          title={isLoading ? 'Creating Account...' : 'Sign Up'}
          onPress={handleSignup}
          disabled={isLoading}
          size="xl"
          style={styles.buttonContainer}
          />

        <Button
          title="Already have an account? Login"
          onPress={() => router.push('/(auth)/Login')}
          size="xl"
          variant="outline"
          />
      </View>
    </View>
  );
}
