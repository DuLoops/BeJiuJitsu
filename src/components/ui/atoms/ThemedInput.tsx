import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface ThemedInputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
}

const ThemedInput = React.forwardRef<TextInput, ThemedInputProps>(
  ({ label, icon, style, ...rest }, ref) => {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputRow}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor="#888"
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
    color: '#222',
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    padding: 0,
    backgroundColor: 'transparent',
  },
});

export default ThemedInput;
