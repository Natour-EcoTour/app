import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface EmailInputProps {
  value: string;
  onChange: (text: string) => void;
  label?: string;
  placeholder?: string;
}

const validateEmail = (email: string): boolean => {
  const regex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  return regex.test(email);
}

export default function EmailInput({
  value,
  onChange,
  label = 'E-mail',
  placeholder = 'Digite seu e-mail',
}: EmailInputProps) {
  const [touched, setTouched] = React.useState(false);
  const isValid = validateEmail(value);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        placeholder={placeholder}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={styles.input}
        value={value}
        onChangeText={onChange}
        onBlur={() => setTouched(true)}
      />
      {touched && !isValid && (
        <Text style={styles.error}>E-mail inválido</Text>
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
