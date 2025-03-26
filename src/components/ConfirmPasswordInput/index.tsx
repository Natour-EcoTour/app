import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface PasswordFormProps {
  label?: string;
  placeholder?: string;
  confirmLabel?: string;
  confirmPlaceholder?: string;
  password: string;
  confirmPassword: string;
  onChangePassword: (text: string) => void;
  onChangeConfirmPassword: (text: string) => void;
}

export default function PasswordForm({
  label = 'Senha',
  placeholder = 'Digite a sua senha',
  confirmLabel = 'Confirmação de senha',
  confirmPlaceholder = 'Repita a sua senha',
  password,
  confirmPassword,
  onChangePassword,
  onChangeConfirmPassword,
}: PasswordFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          placeholder={placeholder}
          keyboardType="default"
          autoCapitalize="none"
          secureTextEntry
          autoComplete="password"
          style={styles.input}
          value={password}
          onChangeText={onChangePassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{confirmLabel}</Text>
        <TextInput
          placeholder={confirmPlaceholder}
          keyboardType="default"
          autoCapitalize="none"
          secureTextEntry
          autoComplete="password"
          style={styles.input}
          value={confirmPassword}
          onChangeText={onChangeConfirmPassword}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
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
    borderRadius: 4,
  },
});
