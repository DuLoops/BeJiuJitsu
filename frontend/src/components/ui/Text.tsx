import React from 'react';
import { Text as RNText, StyleSheet, TextStyle, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';

type TextVariant = 'primary' | 'secondary' | 'muted' | 'accent';
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextLineHeight = 'tight' | 'normal' | 'relaxed';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  lineHeight?: TextLineHeight;
  centered?: boolean;
}

const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const Text = ({
  variant = 'primary',
  size = 'md',
  weight = 'normal',
  lineHeight = 'normal',
  centered = false,
  style,
  children,
  ...props
}: TextProps) => {
  const { activeTheme } = useTheme();

  const styles = StyleSheet.create({
    base: {
      fontSize: FONT_SIZES[size],
      fontWeight: weight,
      lineHeight: FONT_SIZES[size] * LINE_HEIGHTS[lineHeight],
      textAlign: centered ? 'center' : 'left',
    },
    primary: {
      color: activeTheme.text.primary,
    },
    secondary: {
      color: activeTheme.text.secondary,
    },
    muted: {
      color: activeTheme.text.muted,
    },
    accent: {
      color: activeTheme.text.accent,
    },
  });

  return (
    <RNText 
      style={[styles.base, styles[variant], style]} 
      {...props}
    >
      {children}
    </RNText>
  );
};
