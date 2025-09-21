import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
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
import { displayValidationErrors } from '@/src/utils/errorHandling';
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
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [isEditable, setIsEditable] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState<boolean>(false);
  const [isSaveSuccessModalVisible, setIsSaveSuccessModalVisible] = useState<boolean>(false);

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
    },
  }) as any;

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
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
        const info = await myInfo();
        setUserInfo(info);

        setValue('name', info.username || '');
        setValue('email', info.email || '');

        if (info.photo) {
          setSelectedImage(info.photo);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);

      await updateUser(data.name);

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

  const handleEditToggle = () => {
    if (isEditable && userInfo) {
      setValue('name', userInfo.username || '');
      setValue('email', userInfo.email || '');
    }
    setIsEditable(prev => !prev);
  };

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
        } else if (photoData && (photoData as any).id) {
          photoId = (photoData as any).id;
        } else if (typeof photoData === 'number') {
          photoId = photoData;
        } else {
          console.error('Unexpected photo data format:', photoData);
          throw new Error('Could not find photo ID in response');
        }

        await updatePhoto('users', userInfo.id, photoId, selectedImage);
      } else {
        await uploadPhoto('users', userInfo.id, selectedImage);
      }

      const updated = await myInfo();
      setUserInfo(updated);
    } catch (error) {
      console.error('Photo upload/update failed:', error);
      throw error;
    }
  };

  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Perfil</Text>

        {isLoading && <Text style={styles.loadingText}>Carregando informações...</Text>}

        {isEditable && (
          <Text style={styles.infoText}>
            Você pode alterar a sua foto de perfil clicando na imagem abaixo
          </Text>
        )}

        <TouchableOpacity onPress={isEditable ? pickImageAsync : undefined} disabled={!isEditable}>
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
            render={({ field: { onChange, value } }) => (
              <>
                <Fullnamelnput
                  label="Nome"
