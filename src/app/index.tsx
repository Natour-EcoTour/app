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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/src/validations/loginSchema';
import { images } from '@/utils/assets';
import { login, validateTokenAndRedirect } from '../utils/tokenUtils';
import PasswordInput from '@/components/PasswordInput';
import LoginButton from '@/components/LoginButton';
import CustomModal from '@/components/CustomModal';
import EmailInput from '@/components/EmailInput';

interface LoginFormData {
  email: string;
  password: string;
  remember_me: boolean;
}

export default function Index() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);

  const insets = useSafeAreaInsets();
  const keyboardOffset = Platform.select({
    ios: insets.top + 16,
    android: 0,
  });

  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        const hasValidToken = await validateTokenAndRedirect(router);
        if (!hasValidToken) {
          setIsCheckingToken(false);
        }
      } catch (error) {
        console.error('Error checking existing token:', error);
        setIsCheckingToken(false);
      }
    };

    checkExistingToken();
  }, [router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      const result = await login(data);
      
      if (result && result.access && result.refresh) {
        setIsLoading(false);
        setIsModalVisible(true);
      } else {
        setIsLoading(false);
        console.error('Login failed: No tokens received');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error logging in:', error);
    }
  };

  if (isCheckingToken) {
    return (
      <ImageBackground
        source={images.background}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#00672e"
          />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </ImageBackground>
    );
  }

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
                name="remember_me"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#00672e',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
