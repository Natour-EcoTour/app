import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface PasswordInputProps {
  value: string;
  onChange: (text: string) => void;
  label?: string;
  placeholder?: string;
}

const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  return regex.test(password);
};

export default function PasswordInput({
  value,
  onChange,
  label = 'Senha',
  placeholder = 'Digite a sua senha'
}: PasswordInputProps) {
  const [touched, setTouched] = useState(false);
  const isValid = validatePassword(value);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        placeholder={placeholder}
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        style={styles.input}
        value={value}
        onChangeText={onChange}
        onBlur={() => setTouched(true)}
      />
      {touched && !isValid && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>A senha deve conter:</Text>
          <Text style={styles.error}>8 ou mais caracteres</Text>
          <Text style={styles.error}>Letra maiúscula</Text>
          <Text style={styles.error}>Caracter especial</Text>
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
