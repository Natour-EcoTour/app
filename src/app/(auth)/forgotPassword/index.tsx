import { Text, ScrollView, StyleSheet, TouchableOpacity, View, ImageBackground } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { images } from '@/src/utils/assets';
import * as SecureStore from 'expo-secure-store';

import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordEmailSchema } from '@/src/validations/forgotPasswordSchema';

import EmailInput from '@/src/components/EmailInput';
import CodeModal from '@/src/components/CodeModal/CodeModal';

import { sendForgotPasswordCode } from '@/services/auth/sendForgotPassword';
import { updateForgotPassword } from '@/services/auth/updateForgotPassword';

export default function forgotPassword() {
  const [isCodeModalVisible, setIsCodeModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: 'vitorantunes2003@gmail.com',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await sendForgotPasswordCode(data.email);
      setIsCodeModalVisible(true);
    } catch (error) {
      console.error('Error sending forgot password code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFormData = async () => {
    try {
      await SecureStore.deleteItemAsync('registerFormData');
      reset();
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  };

  return (
    <ImageBackground
      source={images.background}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <Text style={styles.title}>Esqueceu sua senha?</Text>

        <Text style={styles.text}>
          Digite o e-mail cadastrado na Natour.
          {'\n'}
          Enviaremos um link para redefinir sua senha.
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <EmailInput
                editable
                value={value}
                onChange={(text: string) => onChange(text)}
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleSubmit(onSubmit)();
          }}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </Text>
        </TouchableOpacity>

        {isCodeModalVisible && (
          <CodeModal
            isVisible={isCodeModalVisible}
            onClose={() => setIsCodeModalVisible(false)}
            route="../"
            title="Confirme seu Email"
            subtitle="Enviamos um código para seu email. Digite-o abaixo para confirmar sua conta."
            isPassword={true}
            onCodeSubmit={async (code, password) => {
              const formData = getValues();

              if (!password) {
                console.error('Password is required');
                return;
              }

              try {
                await updateForgotPassword(formData.email, code, password);
                await clearFormData();
              } catch (error) {
                console.error('Password reset error:', error);
                throw error;
              }
            }}
          />
        )}

        <Text style={styles.link} onPress={() => router.push('/')}>
          Voltar para o login
        </Text>
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
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  field: {
    width: '100%'
  },
  title: {
    fontSize: 17,
    marginTop: 35,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#00672e',
  },
  text: {
    fontSize: 15,
    marginBottom: 25,
    textAlign: 'center',
  },
  link: {
    color: '#00672e',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    marginTop: 20,
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
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#00672e',
    padding: 15,
    width: 350,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  }
});
