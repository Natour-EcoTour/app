import { Text, Image, StyleSheet, ScrollView, View, ImageBackground } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../validations/validationSchema';

import { loginUser } from '../../services/authService';
import * as SecureStore from 'expo-secure-store';

import PasswordInput from '../components/PasswordInput';
import LoginButton from '../components/LoginButton';
import CustomModal from '../components/CustomModal';
import EmailInput from '../components/EmailInput';

export default function Index() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: 'eliza48@yahoo.com',
      password: 'Aa12345678!',
    },
  }); 

  const onSubmit = async (data: any) => {
    try {
      const { access, refresh } = await loginUser(data.email, data.password);

      await SecureStore.setItemAsync('access', access);
      await SecureStore.setItemAsync('refresh', refresh);

      console.log("User logged in successfully:", access);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

    return (

      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          style={styles.scrollView}
        >
          <View style={styles.containerBox}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={{ width: 200, height: 200 }}
            />
            <Text style={styles.title}>Entre na sua conta</Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <EmailInput
                    editable={true}
                    value={value}
                    onChange={onChange}
                  />
                  {errors.email && <Text style={styles.error}>{errors.email.message as string}</Text>}
                </>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <PasswordInput
                    value={value}
                    onChange={onChange}
                  />
                  {errors.password && <Text style={styles.error}>{errors.password.message as string}</Text>}
                </>
              )}
            />

            <Text style={styles.noAccountText} onPress={() => router.push('/(auth)/forgotPassword')}>
              Esquecia minha senha
            </Text>

            <LoginButton
              text='Entrar'
              onPress={handleSubmit(onSubmit)}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text>
                Não tem uma conta?{' '}
              </Text>
              <Text style={styles.noAccountText} onPress={() => router.push('/(auth)/register')}>
                Cadastre-se
              </Text>
            </View>

            {isModalVisible && (
              <CustomModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                route="./(main)/map"
                title="Logado com sucesso!"
                imagePath="check"
              />
            )}
          </View>
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
    containerBox: {
      padding: 50,
      width: '100%',
      alignItems: 'center',
    },
    title: {
      alignSelf: 'flex-start',
      fontSize: 17,
      marginTop: 35,
      marginBottom: 5,
      fontWeight: 'bold',
      color: '#00672e'
    },
    label: {
      color: '#333',
      marginBottom: 5,
      fontSize: 16,
    },
    error: {
      color: 'red',
      fontSize: 14,
      marginBottom: 15,
      alignSelf: 'flex-start'
    },
    noAccountText: {
      color: '#00672e',
      textDecorationLine: 'underline',
      fontWeight: 'bold',
    }
  })
;
