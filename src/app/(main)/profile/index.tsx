import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { profileSchema } from '@/src/validations/profileSchema';
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
import { updateUser } from '@/services/user/updateUserService';
import { uploadPhoto, updatePhoto } from '@/services/photos/photoService';
import { displayValidationErrors, getExactError } from '@/src/utils/errorHandling';
import { getPhotoId } from '@/services/photos/photoIdService';
import { ActivityIndicator } from 'react-native-paper';

type ProfileFormData = {
  name: string;
  email: string;
};

type UserInfo = {
  id: number;
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
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    }
  }) as any;

  // IMAGE PICKER
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

  // CARREGA INFORMAÇÕES
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const userInfo = await myInfo();

        setUserInfo(userInfo);

        setValue('name', userInfo.username || '');
        setValue('email', userInfo.email || '');

        if (userInfo.photo) {
          setSelectedImage(userInfo.photo);
        } else {
        }

      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [setValue]);

  // EDITAR NOME E FOTO
  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      // Update user name
      await updateUser(data.name);

      // Handle photo upload if a new image was selected
      if (selectedImage && selectedImage !== userInfo?.photo) {
        await handleImage();
      }

      setIsSaveSuccessModalVisible(true);
      setIsEditable(false);

    } catch (error: any) {
      console.error('Error updating profile:', error);

      if (error.isValidationError && error.data) {
        displayValidationErrors(error.data, 'Erro ao atualizar perfil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // GUARDAR INFOS PRE EDIÇÃO
  const handleEditToggle = () => {
    if (isEditable && userInfo) {
      setValue('name', userInfo.username || '');
      setValue('email', userInfo.email || '');
    }
    setIsEditable(prev => !prev);
  };

  // APAGAR CONTA
  const handleConfirmDelete = async () => {
    setIsConfirmationVisible(false);
    setIsLoading(true);

    try {
      await deleteUser();
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

  // IMAGE HANDLING
  const handleImage = async () => {
    if (!selectedImage || !userInfo) {
      throw new Error('Nenhuma imagem selecionada ou informações do usuário não carregadas');
    }

    try {
      if (userInfo.photo) {
        const photoData = await getPhotoId(userInfo.id);
        let photoId;

        if (Array.isArray(photoData)) {
          if (photoData.length > 0) {
            photoId = photoData[0].id;
          } else {
            throw new Error('No photos found for user');
          }
        } else if (photoData && photoData.id) {
          photoId = photoData.id;
        } else if (photoData && typeof photoData === 'number') {
          photoId = photoData;
        } else {
          console.error('Unexpected photo data format:', photoData);
          throw new Error('Could not find photo ID in response');
        }

        console.log('Updating existing photo with ID:', photoId);
        await updatePhoto('users', userInfo.id, photoId, selectedImage);
      } else {
        console.log('Uploading new photo...');
        await uploadPhoto('users', userInfo.id, selectedImage);
      }
      const updatedUserInfo = await myInfo();
      setUserInfo(updatedUserInfo);
    } catch (error) {
      console.error('Photo upload/update failed:', error);
      throw error;
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
                  label="Nome"
                  editable={isEditable}
                  placeholder="Digite o seu nome"
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
              disabled={isLoading}
            >
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#ffffffff"
                />
              )}
              <Text style={styles.buttonText}>{isLoading ? 'Editando...' : 'Salvar alterações'}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleEditToggle}
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
            onClose={() => setIsConfirmationVisible(false)}
            onConfirm={handleConfirmDelete}
            title="Tem certeza que deseja apagar sua conta?"
            imageSource={require('@/assets/modalImages/trash.png')}
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
            route="../(main)/profile"
            imageSource={require('@/assets/modalImages/check.png')}
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
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  Deletebutton: {
    backgroundColor: '#fc0303',
    width: '50%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    flexDirection: 'row',
  },
  ChangePassbutton: {
    padding: 15,
    alignItems: 'center',
    borderColor: '#00672e',
    borderWidth: 1,
    borderRadius: 10,
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
