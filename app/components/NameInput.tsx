import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface NameInputProps {
  value: string;
  onChange: (text: string) => void;
  label?: string;
  placeholder?: string;
}

const nameSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(3, 'Nome muito curto'),
});

export default function FullnameInput({
  value,
  onChange,
  label = 'Nome completo',
  placeholder = 'Digite o seu nome completo'
}: NameInputProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(nameSchema),
    defaultValues: { name: value },
  });

  const [touched, setTouched] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
        <Controller
          placeholder={placeholder}
          keyboardType='default'
          autoCapitalize='words'
          autoComplete='name'
          style={styles.input}
          onChangeText={onChange}
          onBlur={() => setTouched(true)}
       />
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
