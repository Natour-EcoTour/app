import { useState, useEffect } from 'react';

import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerPointSchema } from '@/src/validations/pointSchema';
import Toast from 'react-native-toast-message';

import NameInput from '@/components/NameInput';
import DescriptionInput from '@/src/components/DescriptionInput';
import AddressInput from '@/src/components/AddressInput';
import TimeInput from '@/src/components/TimeInput';
import RegisterPointButton from '@/src/components/RegisterPointButton';
import CustomModal from '@/src/components/CustomModal';
import AddPointMidia from '@/src/components/AddPointMidia';
import { Picker } from '@react-native-picker/picker';
import { updatePoint } from '@/services/points/updatePointService';
import { uploadPointPhoto, updatePointPhoto, deletePointPhoto, deleteMultiplePhotos } from '@/services/photos/photoService';
import { pointDetails } from '@/services/points/pointDetailsService';
import { useRoute, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import * as yup from 'yup';

interface RouteParams {
  id?: string;
  pointId?: string;
  pointData?: {
    id: number;
    name: string;
    description: string;
    link?: string;
    latitude: number;
    longitude: number;
    zip_code: string;
    city: string;
    neighborhood: string;
    state: string;
    street: string;
    number: number;
    week_start: string;
    week_end: string;
    open_time: string;
    close_time: string;
    point_type: string;
    photos?: Array<{
      id: number;
      url: string;
      public_id: string;
    }>;
  };
}

// Create a modified schema for editing that considers existing photos
const createEditPointSchema = (hasExistingPhotos: boolean) => {
  return registerPointSchema.shape({
    // Override the images validation to be optional if there are existing photos
    images: hasExistingPhotos
      ? yup.array().of(yup.string()).optional()
      : yup.array().of(yup.string()).min(1, 'Pelo menos uma imagem é obrigatória').required('Pelo menos uma imagem é obrigatória'),
  });
};

export default function EditPoint() {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as RouteParams;
  const { id, pointId, pointData } = params || {};

  // Use id from route params if available, otherwise use pointId
  const actualPointId = id || pointId;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<Array<{
    id: number;
    url: string;
    public_id: string;
  }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photosToDelete, setPhotosToDelete] = useState<Array<{
    id: number;
    public_id: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(!pointData);
  const [currentPointData, setCurrentPointData] = useState(pointData);

  // Calculate if we have existing photos (excluding those marked for deletion)
  const hasExistingPhotos = existingPhotos.filter(photo =>
    !photosToDelete.some(deletedPhoto => deletedPhoto.id === photo.id)
  ).length > 0;

  // Create dynamic schema based on existing photos
  const editPointSchema = createEditPointSchema(hasExistingPhotos || selectedImages.length > 0);

  const toHHMM = (t?: string) => (t ? t.slice(0, 5) : '');

  function translateWeekday(week_start: string | number | undefined): string {
    if (typeof week_start === 'undefined' || week_start === null) return '';
    const weekdays: { [key: string]: string } = {
      'monday': 'Segunda-feira',
      'tuesday': 'Terça-feira',
      'wednesday': 'Quarta-feira',
      'thursday': 'Quinta-feira',
      'friday': 'Sexta-feira',
      'saturday': 'Sábado',
      'sunday': 'Domingo',
      '1': 'Segunda-feira',
      '2': 'Terça-feira',
      '3': 'Quarta-feira',
      '4': 'Quinta-feira',
      '5': 'Sexta-feira',
      '6': 'Sábado',
      '7': 'Domingo',
    };
    const key = String(week_start).toLowerCase();
    return weekdays[key] || '';
  };

  // Initialize form with default values
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(editPointSchema),
    defaultValues: {
      name: '',
      description: '',
      link: '',
      address: {
        cep: '',
        city: '',
        neighborhood: '',
        uf: '',
        street: '',
        number: '',
        latitude: '',
        longitude: '',
      },
      time: {
        weekStart: 'Segunda-feira',
        weekEnd: 'Domingo',
        timeStart: '08:00',
        timeEnd: '18:00',
      },
      type: 'trail',
      images: [],
    },
  });

  // Fetch point details if not provided via params
  useEffect(() => {
    const fetchPointDetails = async () => {
      if (!actualPointId) {
        console.error('No point ID available');
        setIsLoading(false);
        return;
      }

      if (currentPointData) {
        // Data already available, just set existing photos and update form
        const photos = (currentPointData.photos || []).map(photo => ({
          id: photo.id,
          url: photo.url,
          public_id: photo.public_id
        }));
        setExistingPhotos(photos);
        updateFormWithPointData(currentPointData);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const details = await pointDetails(parseInt(actualPointId));
        setCurrentPointData(details);
        // Transform photo format to match component expectations
        const photos = (details.photos || []).map((photo: any) => ({
          id: photo.id,
          url: photo.url || photo.url,
          public_id: photo.public_id
        }));
        setExistingPhotos(photos);
        updateFormWithPointData(details);
      } catch (error) {
        console.error('Error fetching point details:', error);
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Não foi possível carregar os dados do ponto.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPointDetails();
  }, [actualPointId, !currentPointData]);

  // Helper function to update form with point data
  const updateFormWithPointData = (data: any) => {
    reset({
      name: data.name || '',
      description: data.description || '',
      link: data.link || '',
      address: {
        cep: data.zip_code || '',
        city: data.city || '',
        neighborhood: data.neighborhood || '',
        uf: data.state || '',
        street: data.street || '',
        number: data.number?.toString() || '',
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
      },
      time: {
        weekStart: translateWeekday(data.week_start) || 'Segunda-feira',
        weekEnd: translateWeekday(data.week_end) || 'Domingo',
        timeStart: toHHMM(data.open_time),
        timeEnd: toHHMM(data.close_time),
      },
      type: data.point_type,
      images: [],
    });
  };

  const setSelectedImagesWithValidation = (value: React.SetStateAction<string[]>) => {
    setSelectedImages(value);

    const newImages = typeof value === 'function' ? value(selectedImages) : value;
    setValue('images', newImages);
    trigger('images');
  };

  const handleUpdatePointWithImages = async (data: any) => {
    if (!actualPointId) return;

    // Check if we have at least one image (existing or new) after deletions
    const remainingExistingPhotos = existingPhotos.filter(photo =>
      !photosToDelete.some(deletedPhoto => deletedPhoto.id === photo.id)
    );
    const totalImages = remainingExistingPhotos.length + selectedImages.length;

    if (totalImages === 0) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Pelo menos uma imagem é obrigatória.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // First, delete any photos that were marked for deletion using bulk delete
      if (photosToDelete.length > 0) {
        const photoIds = photosToDelete.map(photo => photo.id);
        const publicIds = photosToDelete.map(photo => photo.public_id);

        try {
          await deleteMultiplePhotos(photoIds, publicIds);
        } catch (error) {
          console.error('Error deleting photos:', error);
          // Don't return here - continue with the update even if deletion fails
        }
      }

      // Update point data
      const updatedPointData = {
        name: data.name,
        description: data.description,
        link: data.link || '',
        address: {
          cep: data.address.cep,
          city: data.address.city,
          neighborhood: data.address.neighborhood,
          uf: data.address.uf,
          street: data.address.street,
          number: data.address.number,
          latitude: data.address.latitude,
          longitude: data.address.longitude,
        },
        time: {
          weekStart: data.time.weekStart,
          weekEnd: data.time.weekEnd,
          timeStart: data.time.timeStart,
          timeEnd: data.time.timeEnd,
        },
        type: data.type,
        images: [],
      };

      await updatePoint(updatedPointData, actualPointId);

      // Upload new images
      if (selectedImages.length > 0) {
        for (let i = 0; i < selectedImages.length; i++) {
          const imageUri = selectedImages[i];
          try {
            await uploadPointPhoto(parseInt(actualPointId), imageUri);
          } catch (error) {
            console.error(`Error uploading image ${i + 1}:`, error);
          }
        }
      }
      setTimeout(() => {
        router.push('/(tabs)/myPoints');
      }, 1);
      Toast.show({
        type: 'success',
        text1: 'Ponto atualizado com sucesso!',
        text2: 'As alterações foram salvas.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar ponto',
        text2: 'Não foi possível atualizar o ponto. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveExistingPhoto = (photoId: number, publicId: string) => {
    // Add the photo to the deletion queue
    setPhotosToDelete(prev => [...prev, { id: photoId, public_id: publicId }]);

    // Remove from existing photos - use functional update with proper filtering
    setExistingPhotos(prev => {
      const filtered = prev.filter(photo => photo.id !== photoId);
      return filtered;
    });

    // Trigger validation after removing a photo to update error states
    setTimeout(() => trigger('images'), 100); // Increased delay to 100ms
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.stepTitle}>Carregando dados do ponto...</Text>
      </View>
    );
  }

  // If no pointData is available after loading, show error
  if (!actualPointId) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Erro: ID do ponto não encontrado</Text>
        <RegisterPointButton
          isLoading={false}
          text="Voltar"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <>
      <ScrollView pointerEvents={isSubmitting ? "none" : "auto"}>
        <View style={styles.container}>
          <Text style={styles.stepTitle}>Geral</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <>
                <NameInput
                  label="Nome do ponto"
                  editable={true}
                  placeholder="Digite o nome do seu ponto"
                  onChange={onChange}
                  value={value}
                />
                {errors.name && (
                  <Text style={styles.error}>{errors.name.message}</Text>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <>
                <DescriptionInput
                  label="Descrição do ponto"
                  editable={true}
                  placeholder="Digite a descrição do seu ponto"
                  onChange={onChange}
                  value={value}
                />
                {errors.description && (
                  <Text style={styles.error}>{errors.description.message}</Text>
                )}
              </>
            )}
          />

          <Text style={styles.stepTitle}>Horário de funcionamento</Text>
          <Controller
            control={control}
            name="time"
            render={({ field: { onChange, value } }) => (
              <TimeInput
                onChange={onChange}
                value={value}
                errors={{
                  weekStart: errors?.time?.weekStart?.message,
                  weekEnd: errors?.time?.weekEnd?.message,
                  timeStart: errors?.time?.timeStart?.message,
                  timeEnd: errors?.time?.timeEnd?.message,
                }}
              />
            )}
          />

          <Text style={styles.stepTitle}>Tipo do ponto</Text>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={value}
                  onValueChange={itemValue => onChange(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Trilha" value="trail" />
                  <Picker.Item label="Cachoeira" value="water_fall" />
                  <Picker.Item label="Parque" value="park" />
                  <Picker.Item label="Sítio" value="farm" />
                  <Picker.Item label="Outro" value="other" />
                </Picker>
                {errors.type && (
                  <Text style={styles.error}>{errors.type.message}</Text>
                )}
              </View>
            )}
          />

          <Text style={styles.stepTitle}>Website</Text>
          <Controller
            control={control}
            name="link"
            render={({ field: { onChange, value } }) => (
              <>
                <NameInput
                  label="Link do ponto (opcional)"
                  editable={true}
                  placeholder="Digite o link do seu ponto"
                  onChange={onChange}
                  value={value ?? ''}
                />
                {errors.link && (
                  <Text style={styles.error}>{errors.link.message}</Text>
                )}
              </>
            )}
          />

          <Text style={styles.stepTitle}>Endereço</Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <AddressInput
                onChange={onChange}
                value={{
                  cep: value.cep ?? '',
                  city: value.city ?? '',
                  neighborhood: value.neighborhood ?? '',
                  uf: value.uf ?? '',
                  street: value.street ?? '',
                  number: value.number ?? '',
                  latitude: value.latitude ?? '',
                  longitude: value.longitude ?? '',
                }}
                errors={{
                  cep: errors?.address?.cep?.message,
                  city: errors?.address?.city?.message,
                  neighborhood: errors?.address?.neighborhood?.message,
                  uf: errors?.address?.uf?.message,
                  street: errors?.address?.street?.message,
                  number: errors?.address?.number?.message,
                  latitude: errors?.address?.latitude?.message,
                  longitude: errors?.address?.longitude?.message,
                }}
              />
            )}
          />

          <Text style={styles.stepTitle}>Mídia</Text>
          {existingPhotos.length > 0 || selectedImages.length > 0 ? (
            <AddPointMidia
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImagesWithValidation}
              existingPhotos={existingPhotos}
              onRemoveExistingPhoto={handleRemoveExistingPhoto}
            />
          ) : (
            <AddPointMidia
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImagesWithValidation}
              existingPhotos={[]}
              onRemoveExistingPhoto={undefined}
            />
          )}
          {errors.images && (
            <Text style={styles.error}>{errors.images.message}</Text>
          )}

          <RegisterPointButton
            isLoading={isSubmitting}
            text={isSubmitting ? "Atualizando ponto..." : "Atualizar ponto"}
            onPress={isSubmitting ? () => { } : handleSubmit(handleUpdatePointWithImages)}
          />
        </View>
      </ScrollView>

      {/* Overlay to prevent all interactions during submission */}
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Text style={styles.loadingText}>
              {photosToDelete.length > 0 || selectedImages.length > 0
                ? "Atualizando ponto..."
                : "Salvando alterações..."}
            </Text>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginBottom: 15,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});