import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import { router } from 'expo-router';
import { Linking } from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/src/validations/validationSchema';
import RegisterModal from '@/src/components/RegisterModal';

import Fullnamelnput from "@/src/components/NameInput";
import EmailInput  from '@/src/components/EmailInput';
import PasswordForm from '@/src/components/ConfirmPasswordInput';


export default function RegisterScreen() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: 'Vitor Antunes Ferreira',
      email: 'vitinho@gmail.com',
      // cpf: '45999669839',
      password: 'Aa12345678!',
      confirmPassword: 'Aa12345678!',
    },
  });

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
    setIsModalVisible(true);
  };

  // const formatCpf = (cpf: string) => {
  //   cpf = cpf.replace(/\D/g, '');
  //   if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
  //   if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  //   if (cpf.length > 9) cpf = cpf.replace(/\.(\d{3})(\d)/, '.$1-$2');
  //   return cpf;
  // };

  return (
    <ImageBackground 
          source={require('../../../../assets/images/leaf_bg.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
    >
    <ScrollView contentContainerStyle={styles.scrollContentContainer} style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Fullnamelnput
                  placeholder="Digite o seu nome completo"
                  onChange={onChange}
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
                <EmailInput
                  placeholder="Digite seu e-mail"
                  onChange={onChange}
                  value={value}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message as string}</Text>}
              </>
            )}
          />

          {/* <Controller
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
          /> */}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <>
                <Text style={styles.label}>Senha</Text>
                <PasswordForm
                  password={value}
                  onChangePassword={onChange}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message as string}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <>
                <Text style={styles.label}>Confirmação de senha</Text>
                <PasswordForm
                  password={value}
                  onChangePassword={onChange}
                />
                {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message as string}</Text>}
              </>
            )}
          />

          {/* <Controller
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
          /> */}

          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}
                onPress={() => router.push('/(terms)/userTerms')}>
                Termos de uso
              </Text>
              <Text style={styles.termsText}
                onPress={() => router.push('/(terms)/privacyPolicy')}>
                Política de privacidade
              </Text>
            </View>
          
        </View>
        <Text style={styles.link} onPress={() => router.push('/')}>Voltar para o login</Text>
      </View>
      {isModalVisible && (
              <RegisterModal 
                isVisible={isModalVisible} 
                onClose={() => setIsModalVisible(false)}
              />
            )}
    </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: 'rgba(235, 237, 240, 0.9)',
    borderRadius: 20,
    padding: 50,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 15,
    alignItems: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20
  },
  termsText: {
    marginRight: 20,
    marginLeft: 10,
    color: '#04d361',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  title: {
    color: '#04d361',
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    color: '#000',
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
  link: {
    color: '#04d361',
    marginTop: 20,
    textDecorationLine: 'underline',
  }
});
