import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/src/validations/registerSchema';
import Toast from 'react-native-toast-message';

import Fullnamelnput from '@/src/components/NameInput';
import EmailInput from '@/src/components/EmailInput';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';

import CustomModal from '@/src/components/CustomModal';
import CustomConfirmationModal from '@/src/components/CustomConfirmationModal';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/src/utils/assets';
import { useRouter } from 'expo-router';
import { myInfo } from '@/services/user/myInfoService';
import { deleteUser } from '@/services/user/deleteUserService';

type ProfileFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccept: boolean;
};

type UserInfo = {
  email: string;
  photo: string | null;
  username: string;
};

export default function Profile() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [isEditable, setIsEditable] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isConfirmationVisible, setIsConfirmationVisible] =
    useState<boolean>(false);
  const [isSaveSuccessModalVisible, setIsSaveSuccessModalVisible] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
    }
  }) as any;

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const userInfo = await myInfo();
        console.log('User info:', userInfo);

        setUserInfo(userInfo);

        setValue('name', userInfo.username || '');
        setValue('email', userInfo.email || '');

        if (userInfo.photo) {
          setSelectedImage(userInfo.photo);
        }

      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [setValue]);

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
    setIsSaveSuccessModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmationVisible(false);
    setIsLoading(true);

    try {
      console.log('deletando')
      await deleteUser();
      console.log('deletado')
      setIsModalVisible(true);
      router.replace('/');
    } catch (error: any) {
      if (error.isNetworkError || error.isUnauthorized) {
        router.replace('/');
        console.log('erro de network')
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao deletar conta',
          text2: 'Tente novamente mais tarde',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Perfil</Text>

        {isLoading && (
          <Text style={styles.loadingText}>Carregando informações...</Text>
        )}

        {isEditable && (
          <Text style={styles.infoText}>
            Você pode alterar a sua foto de perfil clicando na imagem abaixo
          </Text>
        )}
        <TouchableOpacity
          onPress={isEditable ? pickImageAsync : undefined}
          disabled={!isEditable}
        >
          <Image
            source={
              selectedImage
                ? { uri: selectedImage }
                : userInfo?.photo
                  ? { uri: userInfo.photo }
                  : images.noPfp
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
                  label="Nome completo"
                  editable={isEditable}
                  placeholder="Digite o seu nome completo"
                  onChange={onChange}
                  value={value}
                />
                {errors.name && (
                  <Text style={styles.error}>
                    {errors.name.message as string}
                  </Text>
                )}
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
                {errors.email && (
                  <Text style={styles.error}>
                    {errors.email.message as string}
                  </Text>
                )}
              </>
            )}
          />

          {isEditable && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonText}>Salvar alterações</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsEditable(prev => !prev)}
          >
            <Text style={styles.buttonText}>
              {isEditable ? 'Cancelar' : 'Editar perfil'}
            </Text>
          </TouchableOpacity>

          {!isEditable && (
            <>
              <TouchableOpacity
                style={styles.ChangePassbutton}
                onPress={() => router.push('./profile/changePassword')}
              >
                <Text style={styles.ChangePasswordbuttonText}>
                  Alterar senha
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.Deletebutton}
                onPressIn={() => setIsConfirmationVisible(true)}
              >
                <Ionicons name={'trash-bin'} size={20} color={'white'} />
                <Text style={styles.buttonText}>Apagar conta</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {isConfirmationVisible && (
          <CustomConfirmationModal
            isVisible={isConfirmationVisible}
            onCancel={() => setIsConfirmationVisible(false)}
            onConfirm={handleConfirmDelete}
            title="Tem certeza que deseja apagar sua conta?"
            imagePath="warning"
          />
        )}

        {isModalVisible && (
          <CustomModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            route="../../"
            title="Conta apagada com sucesso!"
            imagePath="check"
          />
        )}

        {isSaveSuccessModalVisible && (
          <CustomModal
            isVisible={isSaveSuccessModalVisible}
            onClose={() => {
              setIsSaveSuccessModalVisible(false);
              setIsEditable(false);
            }}
            title="Alterações salvas com sucesso!"
            imagePath="check"
            route="../(main)/profile"
          />
        )}
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
    marginBottom: 20,
  },
  Deletebutton: {
    backgroundColor: '#fc0303',
    width: '50%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 4,
    flexDirection: 'row',
  },
  Exitbutton: {
    backgroundColor: 'rgba(22, 150, 0, 0.24)',
    marginBottom: 10,
    width: '50%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'darkgreen',
    flexDirection: 'row',
  },
  ChangePassbutton: {
    padding: 15,
    alignItems: 'center',
    borderColor: '#00672e',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 20,
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
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  infoText: {
    textAlign: 'center',
  },
  loadingText: {
    color: '#000000ff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 15,
  },
});
