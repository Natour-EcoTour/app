import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface CpfInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
}

const formatCpf = (cpf: string) => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
  if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  if (cpf.length > 9) cpf = cpf.replace(/\.(\d{3})(\d)/, '.$1-$2');
  return cpf;
};

export default function CpfInput({
  label = 'CPF',
  placeholder = 'Insira seu CPF',
  value,
  onChange,
}: CpfInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        keyboardType="numeric"
        style={styles.input}
        value={value}
        onChangeText={text => onChange(formatCpf(text))}
        maxLength={14}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
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
