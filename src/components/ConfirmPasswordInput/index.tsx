import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

interface PasswordFormProps {
  password: string;
  onChangePassword: (text: string) => void;
}

export default function PasswordForm({ password, onChangePassword }: PasswordFormProps) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Digite a sua senha"
        keyboardType="default"
        autoCapitalize="none"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={onChangePassword}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    marginBottom: 15,
  },
});
