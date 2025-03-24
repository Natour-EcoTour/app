import { Text, Image, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../app/utils/validationSchema';

import PasswordInput from '../app/components/PasswordInput';
import LoginButton from '../app/components/LoginButton';
import LogedInModal from '../app/components/LogedInModal';
import EmailInput from './components/EmailInput';

export default function Index() {
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: 'a@a.com',
      password: 'Aa12345678!',
    },
  });
  
  const onSubmit = (data: any) => {
    console.log('Form data:', data);
    setIsModalVisible(true);
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContentContainer} 
      style={styles.scrollView}>
      <Image 
        source={require('../assets/images/icon.png')} 
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.title}>Login</Text>
      
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text style={styles.label}>E-mail</Text>
            <EmailInput
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

      <LoginButton onPress={handleSubmit(onSubmit)} />

      <Text style={styles.noAccountText} onPress={() => router.push('/register')}>
        Não possui um cadastro?
      </Text>

      <Text style={styles.noAccountText}>Esqueci a minha senha</Text>

      {isModalVisible && (
        <LogedInModal 
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
    alignSelf: 'flex-start'
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
  noAccountText: {
    color: '#fff',
    marginTop: 20,
    textDecorationLine: 'underline',
  }
});
