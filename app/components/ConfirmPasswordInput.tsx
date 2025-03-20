import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface PasswordConfirmationInputProps {
  password: string;
  confirmPassword: string;
  onChange: (text: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ConfirmPasswordPassword({
  password,
  confirmPassword,
  onChange,
  label = 'Confirmação de senha',
  placeholder = 'Repita a sua senha',
}: PasswordConfirmationInputProps) {
  const [touched, setTouched] = useState(false);
  const isMatch = password === confirmPassword;

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        placeholder={placeholder}
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        style={styles.input}
        value={confirmPassword}
        onChangeText={onChange}
        onBlur={() => setTouched(true)}
      />
      {touched && !isMatch && (
        <Text style={styles.error}>Senhas não são identicas</Text>
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
