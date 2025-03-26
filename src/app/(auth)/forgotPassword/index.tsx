import { Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import SentPasswordModal from '@/src/components/SentPasswordModal';
import { useState } from 'react';
import { router } from 'expo-router';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '@/src/validations/validationSchema';

import EmailInput from '@/src/components/EmailInput';

export default function forgotPassword() {

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        defaultValues: {
          email: 'a@a.com'
        },
      });

      const onSubmit = (data: any) => {
        console.log('Form data:', data);
        setIsModalVisible(true);
      };
      
  return (
    <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.scrollContentContainer}
    >
      <Text style={styles.title}>Esqueceu sua senha?</Text>

      <Text style={styles.text}>Digite o e-mail cadastrado na Natour.</Text>
      <Text style={styles.text}>Enviaremos um link para redefinir sua senha.</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <EmailInput
              value={value}
              onChange={onChange}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message as string}</Text>}
          </>
        )}
      />
      <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit(onSubmit)}
        >
            <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
      {isModalVisible && (
        <SentPasswordModal 
          isVisible={isModalVisible} 
          onClose={() => setIsModalVisible(false)}
        />
      )}

      <Text style={styles.link} onPress={() => router.push('/')}>Voltar para o login</Text>
    
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
    text: {
      color: '#fff',
      fontSize: 15,
      marginBottom: 5,
    },
    link: {
      color: '#04d361',
      marginTop: 20,
      textDecorationLine: 'underline',
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
      width: '100%',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    noAccountText: {
      color: '#fff',
      marginTop: 20,
      textDecorationLine: 'underline',
    },
});