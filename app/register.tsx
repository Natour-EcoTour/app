import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from './utils/validationSchema';
import RegisterModal from '../app/components/RegisterModal';


export default function RegisterScreen() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: 'Vitor Antunes Ferreira',
      email: 'vitinho@gmail.com',
      cpf: '45999669839',
      password: 'Aa12345678!',
      confirmPassword: 'Aa12345678!',
    },
  });

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
    setIsModalVisible(true);
  };

  const formatCpf = (cpf: string) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
    if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (cpf.length > 9) cpf = cpf.replace(/\.(\d{3})(\d)/, '.$1-$2');
    return cpf;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContentContainer} style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text style={styles.label}>Nome completo</Text>
                <TextInput
                  placeholder="Digite o seu nome completo"
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.name && <Text style={styles.error}>{errors.name.message as string}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  placeholder="Digite seu e-mail"
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && <Text style={styles.error}>{errors.email.message as string}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                  placeholder="Insira seu CPF"
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(formatCpf(text))}
                  value={value}
                  keyboardType="numeric"
                  maxLength={14}
                />
                {errors.cpf && <Text style={styles.error}>{errors.cpf.message as string}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  placeholder="Digite a sua senha"
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {errors.password && <Text style={styles.error}>{errors.password.message as string}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text style={styles.label}>Confirmação de senha</Text>
                <TextInput
                  placeholder="Repita a sua senha"
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message as string}</Text>}
              </>
            )}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isModalVisible && (
              <RegisterModal 
                isVisible={isModalVisible} 
                onClose={() => setIsModalVisible(false)}
              />
            )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
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
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#04d361',
    padding: 15,
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
