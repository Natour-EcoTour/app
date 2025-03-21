import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
}

const passwordSchema = yup.object({
  password: yup
    .string()
    .required('Senha é obrigatória')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
      'A senha deve ter pelo menos 8 caracteres\n1 letra maiúscula\n1 caractere especial'
    ),
});

export default function PasswordInput({
  label = 'Senha',
  placeholder = 'Digite a sua senha',
}: PasswordInputProps) {
  const {
    control,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  return (
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
  error: {
    color: 'red',
    fontSize: 14,
  },
});
