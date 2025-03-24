import { Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '../app/utils/validationSchema';

import EmailInput from './components/EmailInput';

export default function forgotPassword() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        defaultValues: {
          email: 'a@a.com'
        },
      });

  return (
    <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.scrollContentContainer}
    >
      <Text style={styles.title}>Esqueci a minha senha</Text>

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
            onPress={handleSubmit(() => {console.log('enviar')})}
        >
            <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    
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
    },
    button: {
        backgroundColor: '#04d361',
        padding: 15,
        width: 200,
        alignItems: 'center',
        borderRadius: 4,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
});
