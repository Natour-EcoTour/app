import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface EmailInputProps {
  label?: string;
  placeholder?: string;
}

const emailSchema = yup.object({
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
});

export default function EmailInput({
  label = 'E-mail',
  placeholder = 'Digite seu e-mail',
  
}: EmailInputProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: { email: string }) => {
    console.log('E-mail enviado:', data);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
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
  submit: {
    color: '#4CAF50',
    fontSize: 16,
    marginTop: 10,
  },
});
