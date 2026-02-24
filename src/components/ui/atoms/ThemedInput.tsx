import { useThemeColor } from '@/src/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface ThemedInputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
}

const ThemedInput = React.forwardRef<TextInput, ThemedInputProps>(
  ({ label, icon, style, ...rest }, ref) => {
    const textColor = useThemeColor({}, 'text');
    const placeholderColor = useThemeColor({}, 'icon');
    const borderColor = useThemeColor({}, 'border');
    const backgroundColor = useThemeColor({}, 'card');

    return (
      <View style={styles.container}>
        {label && <Text style={[styles.label, { color: textColor }]}>{label}</Text>}
        <View style={[styles.inputRow, { borderColor, backgroundColor }]}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <TextInput
            ref={ref}
            style={[styles.input, { color: textColor }, style]}
            placeholderTextColor={placeholderColor}
            {...rest}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2, // Slightly rounded
    paddingHorizontal: 10,
    paddingVertical: 12, // Slightly taller
    borderWidth: 1,
    // Hard shadow for inputs too? Maybe subtle.
    shadowColor: '#2B2B2B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    backgroundColor: 'transparent',
    fontFamily: 'System',
  },
});

export default ThemedInput;
