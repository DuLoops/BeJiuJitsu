import { useThemeColor } from '@/src/hooks/useThemeColor';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption';
};

export default function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const secondaryColor = useThemeColor({}, 'secondaryText');

  const textColor = (type === 'caption' || type === 'link') ? secondaryColor : color;

  return (
    <Text
      style={[
        { color: textColor },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'caption' ? styles.caption : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'System', // Sans-serif for body
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: 'System',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
    fontFamily: 'serif', // Serif for headers
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif', // Serif for headers
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontFamily: 'System',
    textDecorationLine: 'underline',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'System',
  },
});
