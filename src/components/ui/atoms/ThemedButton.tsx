import { PALETTE } from '@/src/constants/Colors';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'success';

interface ButtonProps {
  onPress: () => void;
  title: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  testID?: string;
}

const ThemedButton = ({
  onPress,
  title,
  size = 'md',
  variant = 'primary',
  disabled = false,
  style,
  icon,
  testID
}: ButtonProps) => {
  // Use only valid color keys from Colors
  const tintColor = useThemeColor({}, 'tint');
  const themeTextColor = useThemeColor({}, 'text');
  const themeBackgroundColor = useThemeColor({}, 'background');
  const shadowColor = PALETTE.light.cardShadow; // Hard shadow is always Sumi Charcoal

  // Determine colors based on variant
  const { backgroundColor, textColor, borderColor, borderWidth, shadowOpacity, elevation } = (() => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: PALETTE.common.accent, // Vermilion Stamp
          textColor: PALETTE.dark.textPrimary, // Vellum White
          borderColor: undefined,
          borderWidth: 0,
          shadowOpacity: 1,
          elevation: 4,
        };
      case 'secondary': // Fallback for old 'accent' or new secondary usage if mapped
      case 'outline':
        // Slate Indigo in Light, Faded Slate in Dark
        // We can check if tintColor is Vermilion (Light) or something else, 
        // but better to use the specific Palette colors based on theme context if possible.
        // However, useThemeColor 'icon' maps to Slate Indigo (Light) and Faded Slate (Dark).
        // Let's use 'icon' color from theme for the outline/text.
        const outlineColor = useThemeColor({}, 'icon');
        return {
          backgroundColor: 'transparent',
          textColor: outlineColor,
          borderColor: outlineColor,
          borderWidth: 2,
          shadowOpacity: 0,
          elevation: 0,
        };
      case 'success':
        return {
          backgroundColor: PALETTE.common.success,
          textColor: PALETTE.dark.textPrimary,
          borderColor: undefined,
          borderWidth: 0,
          shadowOpacity: 1,
          elevation: 4,
        };
      case 'accent': // Keeping accent as Vermilion for now, similar to primary but maybe different context? 
        // The prompt says "Primary (Action): Uses Vermilion Stamp". 
        // "Secondary (Outline): Uses Slate Indigo...".
        // Let's map 'accent' to Primary for now or keep as is if it was distinct. 
        // Previous code: accent -> tintColor (Vermilion). 
        // Let's treat 'accent' same as 'primary' or deprecated. 
        // For safety, I will map 'accent' to Primary colors as well since tint is Vermilion.
        return {
          backgroundColor: PALETTE.common.accent,
          textColor: PALETTE.dark.textPrimary,
          borderColor: undefined,
          borderWidth: 0,
          shadowOpacity: 1,
          elevation: 4,
        };
      default:
        return {
          backgroundColor: themeBackgroundColor,
          textColor: themeTextColor,
          borderColor: undefined,
          borderWidth: 0,
          shadowOpacity: 1,
          elevation: 4,
        };
    }
  })();

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 2, // Strictly 2px
      shadowColor: shadowColor,
      shadowOffset: { width: 4, height: 4 }, // Hard shadow 4px 4px
      shadowOpacity: shadowOpacity, // Solid shadow
      shadowRadius: 0, // No blur
      elevation: elevation,
      backgroundColor,
      borderWidth: borderWidth,
      borderColor: borderColor,
      opacity: disabled ? 0.5 : 1,
    },
    // Size variants
    sm: { paddingVertical: 6, paddingHorizontal: 12 },
    md: { paddingVertical: 10, paddingHorizontal: 20 },
    lg: { paddingVertical: 16, paddingHorizontal: 24 },
    xl: { paddingVertical: 24, paddingHorizontal: 32 },
    text: {
      fontSize: 16,
      fontWeight: '600',
      color: textColor,
      marginLeft: icon ? 8 : 0,
      fontFamily: 'System', // Should be Sans-serif
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
      testID={testID}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ThemedButton;
