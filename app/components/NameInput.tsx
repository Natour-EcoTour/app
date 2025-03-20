import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface NameInputProps {
  value: string;
  onChange: (text: string) => void;
  label?: string;
  placeholder?: string;
}

const validateName = (fullName: string): boolean => {
  return fullName.trim().length > 3;
};

export default function FullnameInput({
  value,
  onChange,
  label = 'Nome completo',
  placeholder = 'Digite o seu nome completo'
}: NameInputProps) {
  const [touched, setTouched] = useState(false);
  const isValid = validateName(value);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
        <TextInput
          placeholder='Digite seu nome'
          keyboardType='default'
          autoCapitalize='words'
          autoComplete='name'
          style={styles.input}
          onChangeText={onChange}
          onBlur={() => setTouched(true)}
       />
      {touched && !isValid && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>Insira um nome válido</Text>
        </View>
      )}
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
  errorContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  error: {
    color: 'red',
    fontSize: 14,
  }
});
