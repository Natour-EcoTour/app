import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface NameInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
}

export default function FullnameInput({
  label = 'Nome completo',
  placeholder = 'Digite o seu nome completo',
  value,
  onChange,
}: NameInputProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        keyboardType="default"
        autoCapitalize="none"
        autoComplete="name"
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
    color: '#000',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    borderRadius: 4,
  },
});
