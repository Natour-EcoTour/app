import { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { ActivityIndicator, Checkbox } from 'react-native-paper';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/src/validations/registerSchema';

import Fullnamelnput from '@/src/components/NameInput';
import EmailInput from '@/src/components/EmailInput';
import PasswordInput from '@/src/components/PasswordInput';
import SafeKeyboardAvoidingView from '@/src/components/SafeKeyboardAvoidingView';
import { images } from '@/src/utils/assets';
import CodeModal from '@/src/components/CodeModal/CodeModal';
import { sendVerificationCode } from '@/services/singUp/sendVerificationCode';
import { verifyCodeAndRegister } from '@/services/singUp/verifyCodeAndRegister';
import { createAccount } from '@/services/singUp/createAccountService';

// Register form props
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccept: boolean;
}

export default function RegisterScreen() {
  // Use states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Handle form
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),

  });

  // Save form data to secure store
  const saveFormData = useCallback(async () => {
    try {
      const currentValues = getValues();
      await SecureStore.setItemAsync('registerFormData', JSON.stringify(currentValues));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [getValues]);

  // Load form data from secure store
  const loadFormData = useCallback(async () => {
    try {
      const savedData = await SecureStore.getItemAsync('registerFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach((key) => {
          setValue(key as any, parsedData[key]);
        });
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  }, [setValue]);

  // Load form data on mount
  useEffect(() => {
    loadFormData();
  }, [loadFormData]);

  // Save form data when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        saveFormData();
      };
    }, [saveFormData])
  );

  // Clear form data from secure store
  const clearFormData = async () => {
    try {
      await SecureStore.deleteItemAsync('registerFormData');
      reset();
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  };

  // Submit form
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      await sendVerificationCode(data.name, data.email, data.password);

      setIsModalVisible(true);
    } catch (error) {
      console.error('Error sending verification code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={images.background}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeKeyboardAvoidingView>
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          style={styles.scrollView}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Cadastro</Text>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <>
                    <Fullnamelnput
                      label="Nome"
                      editable={true}
                      placeholder="Digite o seu nome"
                      onChange={(text) => {
                        onChange(text);
                        saveFormData();
                      }}
                      value={value}
                    />
                    {errors.name && (
                      <Text style={styles.error}>
                        {errors.name.message as string}
                      </Text>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <>
                    <EmailInput
                      editable={true}
                      placeholder="Digite seu e-mail"
                      onChange={(text) => {
                        onChange(text);
                        saveFormData();
                      }}
                      value={value}
                    />
                    {errors.email && (
                      <Text style={styles.error}>
                        {errors.email.message as string}
                      </Text>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <>
                    <PasswordInput
                      label="Senha"
                      placeholder="Insira sua senha"
                      value={value || ''}
                      onChange={(text) => {
                        onChange(text);
                        saveFormData();
                      }}
                    />
                    {errors.password && (
                      <Text style={styles.error}>
                        {errors.password.message as string}
                      </Text>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <>
                    <PasswordInput
                      label="Confirmação de senha"
                      placeholder="Confirme sua senha"
                      value={value || ''}
                      onChange={(text) => {
                        onChange(text);
                        saveFormData();
                      }}
                    />
                    {errors.confirmPassword && (
                      <Text style={styles.error}>
                        {errors.confirmPassword.message as string}
                      </Text>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="termsAccept"
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <>
                    <View style={styles.termsContainer}>
                      <Checkbox
                        status={value ? 'checked' : 'unchecked'}
                        onPress={() => {
                          const newValue = !value;
                          onChange(newValue);
                          saveFormData();
                        }}
                        color="#00672e"
                      />
                      <Text style={{ fontSize: 13 }}>
                        Declaro que li e aceito os{' '}
                      </Text>
                      <Text
                        style={[styles.termsText, { fontSize: 13 }]}
                        onPress={() => router.push('/(terms)/userTerms')}
                      >
                        termos de uso
                      </Text>
                      <Text>{' e as '}</Text>
                      <Text
                        style={[styles.termsText, { fontSize: 13 }]}
                        onPress={() => router.push('/(terms)/privacyPolicy')}
                      >
                        política de privacidade
                      </Text>
                    </View>
                    {error && <Text style={styles.error}>{error.message}</Text>}
                  </>
                )}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
              >
                {isLoading &&
                  <ActivityIndicator
                    size="small"
                    color="#00672e"
                  />}
                <Text
                  style={styles.buttonText}>
                  {isLoading ? 'Carregando...' : 'Cadastrar'}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Text>Já tem uma conta? </Text>
              <Text style={styles.link} onPress={() => router.push('/')}>
                Entrar
              </Text>
            </View>
          </View>
          {isModalVisible && (
            <CodeModal
              isVisible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
              route="../"
              title="Confirme seu Email"
              subtitle="Enviamos um código para seu email. Digite-o abaixo para confirmar sua conta."
              isPassword={false}
              onCodeSubmit={async (code) => {
                const formData = getValues();

                try {
                  await verifyCodeAndRegister(formData.email, code);

                  await createAccount(
                    formData.name,
                    formData.email,
                    formData.password
                  );

                  await clearFormData();


                } catch (error) {
                  console.error('Registration error:', error);
                  throw error;
                }
              }}
            />
          )}
        </ScrollView>
      </SafeKeyboardAvoidingView>
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
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  termsText: {
    color: '#00672e',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  title: {
    color: '#00672e',
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
    backgroundColor: '#00672e',
    padding: 15,
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: '#00672e',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
