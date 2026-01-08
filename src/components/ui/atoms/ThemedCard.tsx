import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/src/hooks/useThemeColor';

export type ThemedCardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'default' | 'view' | 'plain';
};

export default function ThemedCard({ style, lightColor, darkColor, variant = 'default', ...otherProps }: ThemedCardProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    variant === 'default' ? 'card' : 'background'
  );


  // Hard shadow style from Design Guide
  const shadowStyle = variant === 'default' ? {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } : {};

  return <View style={[{ backgroundColor }, shadowStyle, style]} {...otherProps} />;
}
