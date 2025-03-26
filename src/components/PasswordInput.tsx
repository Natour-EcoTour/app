import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
}

export default function PasswordInput({
  label = 'Senha',
  placeholder = 'Digite a sua senha',
  value,
  onChange,
}: PasswordInputProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        keyboardType="default"
        autoCapitalize="none"
        secureTextEntry
        autoComplete="password"
        style={styles.input}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    borderRadius: 4,
  },
});
