import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline';

interface ButtonProps {
  onPress: () => void;
  title: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button = ({ 
  onPress, 
  title, 
  size = 'md',
  variant = 'primary',
  disabled = false,
  style
}: ButtonProps) => {
  const { activeTheme } = useTheme();
  
  const styles = StyleSheet.create({
    button: {
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: activeTheme.background.elevated,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 1.0,
      elevation: 1,
    },
    // Size variants
    sm: { paddingVertical: 4, paddingHorizontal: 8 },
    md: { paddingVertical: 8, paddingHorizontal: 16 },
    lg: { paddingVertical: 16, paddingHorizontal: 24 },
    xl: { paddingVertical: 24, paddingHorizontal: 32 },
    // Button variants using new theme structure
    primary: {
      backgroundColor: activeTheme.button.primary.backgroundColor,
    },
    secondary: {
      backgroundColor: activeTheme.button.secondary.backgroundColor,
    },
    accent: {
      backgroundColor: activeTheme.button.accent.backgroundColor,
    },
    outline: {
      backgroundColor: activeTheme.button.outline.backgroundColor,
      borderWidth: activeTheme.button.outline.borderWidth,
      borderColor: activeTheme.button.outline.borderColor,
    },
    // Text styles using new theme structure
    text: {
      fontSize: 16,
      fontWeight: '600',
    },
    primaryText: {
      color: activeTheme.button.primary.color,
    },
    secondaryText: {
      color: activeTheme.button.secondary.color,
    },
    accentText: {
      color: activeTheme.button.accent.color,
    },
    outlineText: {
      color: activeTheme.button.outline.color,
    },
    disabled: {
      opacity: 0.5,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles[size],
        styles[variant],
        disabled && styles.disabled,
        style
      ]}
    >
      <Text style={[
        styles.text,
        styles[`${variant}Text`]
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
