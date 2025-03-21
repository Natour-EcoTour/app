import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface CpfInputProps {
  label?: string;
  placeholder?: string;
}

const formatCpf = (cpf: string) => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
  if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  if (cpf.length > 9) cpf = cpf.replace(/\.(\d{3})(\d)/, '.$1-$2');
  return cpf;
};

const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let remainder: number;

  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(cpf.charAt(9)) !== digit1) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;

  return parseInt(cpf.charAt(10)) === digit2;
};

const cpfSchema = yup.object({
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .test('is-valid-cpf', 'CPF inválido', (value) => isValidCPF(value || '')),
});

export default function CpfInput({
  label = 'CPF',
  placeholder = 'Insira seu CPF',
}: CpfInputProps) {
  const {
    control,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(cpfSchema),
    defaultValues: { cpf: '' },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name="cpf"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            keyboardType="numeric"
            style={styles.input}
            value={value}
            onChangeText={(text) => {
              onChange(formatCpf(text));
              trigger('cpf');
            }}
            onBlur={onBlur}
            maxLength={14}
          />
        )}
      />
      {errors.cpf && <Text style={styles.error}>{errors.cpf.message}</Text>}
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
  error: {
    color: 'red',
    fontSize: 14,
  },
});
