import { Text, ScrollView, StyleSheet, TouchableOpacity, View, ImageBackground } from 'react-native';

import { useState } from 'react';
import { router } from 'expo-router';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '@/src/validations/forgotPasswordSchema';

import EmailInput from '@/src/components/EmailInput';
import { images } from '@/src/utils/assets';
import CustomModal from '@/src/components/CustomModal';
import { sendForgotPasswordCode } from '@/services/auth/sendForgotPassword';

// TODO modal to verify the code!!!
export default function forgotPassword() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: 'vitorantunes2003@gmail.com',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log('Form data:', data.email);
    await sendForgotPasswordCode(data.email);
    setIsModalVisible(true);
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
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </Text>
        </TouchableOpacity>
        {isModalVisible && (
          <CustomModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            title="E-mail enviado!"
            route='../'
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
