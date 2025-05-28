import { useThemeColor } from '@/src/hooks/useThemeColor';
import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline';

interface ButtonProps {
  onPress: () => void;
  title: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

const ThemedButton = ({ 
  onPress, 
  title, 
  size = 'md',
  variant = 'primary',
  disabled = false,
  style,
  icon
}: ButtonProps) => {
  // Use only valid color keys from Colors
  const backgroundColor = variant === 'outline' ? 'transparent' : useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = variant === 'outline' ? useThemeColor({}, 'tint') : undefined;
  const shadowColor = useThemeColor({}, 'icon');

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 1.0,
      elevation: 1,
      backgroundColor,
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: borderColor,
      opacity: disabled ? 0.5 : 1,
    },
    // Size variants
    sm: { paddingVertical: 4, paddingHorizontal: 8 },
    md: { paddingVertical: 8, paddingHorizontal: 16 },
    lg: { paddingVertical: 16, paddingHorizontal: 24 },
    xl: { paddingVertical: 24, paddingHorizontal: 32 },
    text: {
      fontSize: 16,
      fontWeight: '600',
      color: textColor,
      marginLeft: icon ? 8 : 0,
    },
    iconContainer: {
      // Add styles for icon container if needed
    }
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles[size],
        style
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ThemedButton;
