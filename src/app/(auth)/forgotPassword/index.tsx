import { Text, ScrollView, StyleSheet, TouchableOpacity, View, ImageBackground } from 'react-native';

import { useState } from 'react';
import { router } from 'expo-router';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '@/src/validations/validationSchema';

import SentPasswordModal from '@/src/components/SentPasswordModal/SentPasswordModal';
import EmailInput from '@/src/components/EmailInput';
import { images } from '@/src/utils/assets';

export default function forgotPassword() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: 'a@a.com',
    },
  });

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
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

        <Text style={styles.text}>Digite o e-mail cadastrado na Natour.</Text>
        <Text style={styles.text}>
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
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
        {isModalVisible && (
          <SentPasswordModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
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
    color: '#00672E',
  },
  text: {
    color: '#00672e',
    fontSize: 15,
    marginBottom: 5,
  },
  link: {
    color: 'green',
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
