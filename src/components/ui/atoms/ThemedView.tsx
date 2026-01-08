import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/src/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    variant?: 'default' | 'view';
};

export default function ThemedView({ style, lightColor, darkColor, variant = 'default', ...otherProps }: ThemedViewProps) {
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        variant === 'default' ? 'background' : 'card'
    );

    return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
