import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface PasswordFormProps {
  label?: string;
  placeholder?: string;
  confirmLabel?: string;
  confirmPlaceholder?: string;
}

const passwordSchema = yup.object({
  password: yup
    .string()
    .required('Senha é obrigatória')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
      'A senha deve ter pelo menos 8 caracteres\n1 letra maiúscula\n1 caractere especial'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Senhas não são idênticas')
    .required('Confirmação de senha é obrigatória'),
});

export default function PasswordForm({
  label = 'Senha',
  placeholder = 'Digite a sua senha',
  confirmLabel = 'Confirmação de senha',
  confirmPlaceholder = 'Repita a sua senha',
}: PasswordFormProps) {
  const {
    control,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={placeholder}
              keyboardType="default"
              autoCapitalize="none"
              secureTextEntry
              autoComplete="password"
              style={styles.input}
              value={value}
              onChangeText={(text) => {
                onChange(text);
                trigger('password');
              }}
              onBlur={onBlur}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{confirmLabel}</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={confirmPlaceholder}
              keyboardType="default"
              autoCapitalize="none"
              secureTextEntry
              autoComplete="password"
              style={styles.input}
              value={value}
              onChangeText={(text) => {
                onChange(text);
                trigger('confirmPassword');
              }}
              onBlur={onBlur}
            />
          )}
        />
        {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
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
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});