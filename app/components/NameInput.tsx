import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface NameInputProps {
  label?: string;
  placeholder?: string;
}

const nameSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(3, 'Nome muito curto'),
});

export default function FullnameInput({
  label = 'Nome completo',
  placeholder = 'Digite o seu nome completo'
}: NameInputProps) {
  const {
    control,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(nameSchema),
    defaultValues: { name: '' },
  });

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={placeholder}
              keyboardType="default"
              autoCapitalize="none"
              autoComplete="name"
              style={styles.input}
              value={value}
              onChangeText={(text) => {
                onChange(text);
                trigger('name');
              }}
              onBlur={onBlur}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
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
