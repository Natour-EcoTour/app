import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox } from 'react-native-paper';
import { registerSchema } from '@/src/validations/validationSchema';
import { router } from 'expo-router';

import Fullnamelnput from "@/src/components/NameInput";
import EmailInput from '@/src/components/EmailInput';
import PasswordForm from '@/src/components/ConfirmPasswordInput';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

export default function Profile() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [isEditable, setIsEditable] = useState(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: 'Vitor Antunes Ferreira',
      email: 'vitinho@gmail.com',
      password: 'Aa12345678!',
      confirmPassword: 'Aa12345678!',
      termsAccept: true,
    },
  });

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  return (
    <GestureHandlerRootView>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>PERFIL</Text>

        <TouchableOpacity onPress={pickImageAsync}>
          <Image
            source={
              selectedImage
                ? { uri: selectedImage }
                : require('../../../../assets/images/no_pfp.jpg')
            }
            style={styles.image}
          />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Fullnamelnput
                  editable={isEditable}
                  placeholder="Digite o seu nome completo"
                  onChange={onChange}
                  value={value}
                />
                {errors.name && <Text style={styles.error}>{errors.name.message as string}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <EmailInput
                  editable={false}
                  placeholder="Digite seu e-mail"
                  onChange={onChange}
                  value={value}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message as string}</Text>}
              </>
            )}
          />

          {isEditable && (
            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.buttonText}>Salvar alterações</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.button} onPress={() => setIsEditable(prev => !prev)}>
            <Text style={styles.buttonText}>{isEditable ? 'Cancelar' : 'Editar perfil'}</Text>
          </TouchableOpacity>

          {!isEditable && (
            <>
              <TouchableOpacity style={styles.ChangePassbutton} onPress={() => console.log('Trocar senha!')}>
                <Text style={styles.ChangePasswordbuttonText}>Alterar senha</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.Deletebutton} onPressIn={() => console.log('Conta apagada!')}>
                <Text style={styles.buttonText}>Apagar conta</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 50,
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
    marginTop: 10,
    marginBottom: 20
  },
  Deletebutton: {
    backgroundColor: '#fc0303',
    width: '50%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 4,
  },
  ChangePassbutton: {
    padding: 15,
    alignItems: 'center',
    borderColor: '#00672e',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  ChangePasswordbuttonText: {
    color: '#00672e',
    fontSize: 16,
  },
  link: {
    color: '#00672e',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 100,
    resizeMode: 'contain',
  }
});
