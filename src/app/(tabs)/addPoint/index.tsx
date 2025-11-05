import { useState } from 'react';
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
import AddPointMidia from '@/src/components/AddPointMidia';
import { Picker } from '@react-native-picker/picker';
import { createPoint } from '@/services/points/createPointService';
import { uploadPointPhoto } from '@/services/photos/photoService';
import { router } from 'expo-router';

export default function AddPoint() {
  // Use states
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(registerPointSchema),
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

  // Set selected images with validation
  const setSelectedImagesWithValidation = (value: React.SetStateAction<string[]>) => {
    setSelectedImages(value);
    const newImages = typeof value === 'function' ? value(selectedImages) : value;
    setValue('images', newImages);
    trigger('images');
  };

  // Convert time to minutes
  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  // Validate URL
  const isValidUrl = (url?: string) => {
    if (!url) return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    return /^https?:\/\/\S+\.\S+/.test(trimmed);
  };

  // Handle create point with images
  const handleCreatePointWithImages = async (data: any) => {
    if (selectedImages.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Pelo menos uma imagem é obrigatória.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!data.name?.trim()) {
        Toast.show({ type: 'error', text1: 'Erro', text2: 'Nome do ponto é obrigatório.' });
        setIsSubmitting(false);
        return;
      }
      if (!data.description?.trim()) {
        Toast.show({ type: 'error', text1: 'Erro', text2: 'Descrição do ponto é obrigatória.' });
        setIsSubmitting(false);
        return;
      }

      const startM = toMinutes(data.time.timeStart);
      const endM = toMinutes(data.time.timeEnd);
      if (endM < startM) {
        Toast.show({
          type: 'error',
          text1: 'Horário inválido',
          text2: 'Fechamento não pode ser anterior à abertura.',
        });
        setIsSubmitting(false);
        return;
      }

      const latStr = data.address.latitude?.trim();
      const lngStr = data.address.longitude?.trim();
      const hasLat = !!latStr;
      const hasLng = !!lngStr;

      if (hasLat !== hasLng) {
        Toast.show({
          type: 'error',
          text1: 'Coordenadas incompletas',
          text2: 'Informe latitude E longitude ou deixe ambas em branco.',
        });
        setIsSubmitting(false);
        return;
      }

      const pointData: any = {
        name: data.name.trim(),
        description: data.description.trim(),
        week_start: data.time.weekStart,
        week_end: data.time.weekEnd,    
        open_time: data.time.timeStart,
        close_time: data.time.timeEnd,
        point_type: data.type,
      };

      if (data.link?.trim() && isValidUrl(data.link)) {
        pointData.link = data.link.trim();
      }

      if (hasLat && hasLng) {
        const lat = parseFloat(latStr!);
        const lng = parseFloat(lngStr!);
        const latOk = !isNaN(lat) && lat >= -90 && lat <= 90;
        const lngOk = !isNaN(lng) && lng >= -180 && lng <= 180;
        if (!latOk || !lngOk) {
          Toast.show({
            type: 'error',
            text1: 'Coordenadas inválidas',
            text2: 'Latitude ∈ [-90,90], longitude ∈ [-180,180].',
          });
          setIsSubmitting(false);
          return;
        }
        pointData.latitude = lat;
        pointData.longitude = lng;
      }

      pointData.zip_code = data.address.cep?.trim() || '';
      pointData.city = data.address.city?.trim() || '';
      pointData.neighborhood = data.address.neighborhood?.trim() || '';
      pointData.state = data.address.uf?.trim() || '';
      pointData.street = data.address.street?.trim() || '';

      if (data.address.number && String(data.address.number).trim()) {
        const num = parseInt(String(data.address.number).trim(), 10);
        if (!isNaN(num) && num > 0) {
          pointData.number = num;
        }
      }
      const createdPoint = await createPoint(pointData);
      const pointId = createdPoint.id || createdPoint.point_id;
      if (!pointId) throw new Error('Point ID not returned from creation');

      for (let i = 0; i < selectedImages.length; i++) {
        const imageUri = selectedImages[i];
        try {
          await uploadPointPhoto(pointId, imageUri);
        } catch (e) {
          console.error(`Error uploading image ${i + 1}:`, e);
        }
      }

      Toast.show({
        type: 'success',
        text1: 'Ponto criado com sucesso!',
        text2: 'Cadastro concluído e fotos enviadas.',
      });

      setTimeout(() => {
        router.push('/(tabs)/myPoints');
      }, 1);
    } catch (error: any) {
      console.error('Error creating point:', error);

      let errorMessage = 'Não foi possível criar o ponto. Tente novamente.';
      if (error?.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }

      Toast.show({
        type: 'error',
        text1: 'Erro ao criar ponto',
        text2: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ScrollView pointerEvents={isSubmitting ? 'none' : 'auto'}>
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
                {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
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
                {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}
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
                {errors.type && <Text style={styles.error}>{errors.type.message}</Text>}
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
                {errors.link && <Text style={styles.error}>{errors.link.message}</Text>}
              </>
            )}
          />

          <Text style={styles.stepTitle}>Endereço</Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <AddressInput
                onChange={(newValue) => {
                  onChange(newValue);
                  setTimeout(() => trigger('address'), 100);
                }}
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
          <AddPointMidia
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImagesWithValidation}
            existingPhotos={[]}
            onRemoveExistingPhoto={undefined}
          />
          {errors.images && <Text style={styles.error}>{errors.images.message}</Text>}

          <RegisterPointButton
            isLoading={isSubmitting}
            text={isSubmitting ? 'Criando ponto...' : 'Criar ponto'}
            onPress={isSubmitting ? () => {} : handleSubmit(handleCreatePointWithImages)}
          />
        </View>
      </ScrollView>

      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Text style={styles.loadingText}>
              {selectedImages.length > 0 ? 'Criando ponto e enviando fotos...' : 'Criando ponto...'}
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
    color: '#000'
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