import {
  Text,
  Image,
  StyleSheet,
  ScrollView,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/src/validations/loginSchema';
import { images } from '@/utils/assets';

import { loginUser } from '@/services/auth/authService';
import * as SecureStore from 'expo-secure-store';

import PasswordInput from '@/components/PasswordInput';
import LoginButton from '@/components/LoginButton';
import CustomModal from '@/components/CustomModal';
import EmailInput from '@/components/EmailInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Checkbox } from 'react-native-paper';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// TODO SE O USER JA TIVER TOKEN ELE DEVE IR DIRETO PARA A TELA DO MAPA
export default function Index() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const insets = useSafeAreaInsets();
  const keyboardOffset = Platform.select({
    ios: insets.top + 16,
    android: 0,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: 'vitorantunes2003@gmail.com',
      password: 'Aa12345678!',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      const { access, refresh } = await loginUser(data.email, data.password, data.rememberMe);

      await SecureStore.setItemAsync('access', access);
      await SecureStore.setItemAsync('refresh', refresh);

      setIsLoading(false);

      setIsModalVisible(true);
    } catch (error) {
      setIsLoading(false);
      console.error('Error logging in:', error);
    }
  };

  return (
    <ImageBackground
      source={images.background}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          style={styles.scrollView}
        >
          <View style={styles.containerBox}>

            <Image source={images.icon} style={styles.iconImage} />
            <Text style={styles.title}>Entre na sua conta</Text>

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

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View style={styles.field}>
                  <PasswordInput
                    value={value}
                    onChange={(text: string) => onChange(text)}
                  />
                  {errors.password && (
                    <Text style={styles.error}>{errors.password.message}</Text>
                  )}
                </View>
              )}
            />

            <View style={styles.actions}>
              <Controller
                control={control}
                name="rememberMe"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    status={value ? 'checked' : 'unchecked'}
                    onPress={() => onChange(!value)}
                    color="#00672e"
                  />
                )}
              />
              <Text>Manter conectado</Text>

              <Text
                style={[styles.noAccountText, { marginLeft: 50 }]}
                onPress={() => router.push('/(auth)/forgotPassword')}
              >
                Redefinir senha
              </Text>
            </View>

            <LoginButton
              text="Entrar"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
            />

            <View style={styles.accountRow}>
              <Text>Não tem uma conta? </Text>
              <Text
                style={styles.noAccountText}
                onPress={() => router.push('/(auth)/register')}
              >
                Cadastre-se
              </Text>
            </View>

            {isModalVisible && (
              <CustomModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                route="./(main)/map"
                title="Logado com sucesso!"
                imageSource={require('@/assets/modalImages/check.png')}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  field: {
    width: '100%'
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  iconImage: {
    width: 200,
    height: 200,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerBox: {
    padding: 45,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: 17,
    marginTop: 35,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#00672e',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  noAccountText: {
    color: '#00672e',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
