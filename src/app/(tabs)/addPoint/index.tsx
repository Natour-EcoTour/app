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
import CustomModal from '@/src/components/CustomModal';
import AddPointMidia from '@/src/components/AddPointMidia';
import { Picker } from '@react-native-picker/picker';
import { createPoint } from '@/services/points/createPointService';
import { uploadPhoto } from '@/services/photos/photoService';

export default function AddPoint() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(registerPointSchema),
    defaultValues: {
      name: 'Ponto automático',
      description: 'Descrição automática',
      link: 'https://www.mogidascruzes.sp.gov.br/unidade-e-equipamento/0/parque-centenario-da-imigracao-japonesa',
      address: {
        cep: '',
        city: '',
        neighborhood: '',
        uf: '',
        street: '',
        // number: '',
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

  const setSelectedImagesWithValidation = (value: React.SetStateAction<string[]>) => {
    setSelectedImages(value);

    const newImages = typeof value === 'function' ? value(selectedImages) : value;
    setValue('images', newImages);
    trigger('images');
  };

  const handleCreatePointWithImages = async (data: any) => {
    setIsSubmitting(true);
    try {
      const pointData = {
        name: data.name,
        description: data.description,
        week_start: data.time.weekStart,
        week_end: data.time.weekEnd,
        open_time: data.time.timeStart,
        close_time: data.time.timeEnd,
        point_type: data.type,
        link: data.link || '',
        latitude: parseFloat(data.address.latitude),
        longitude: parseFloat(data.address.longitude),
        zip_code: data.address.cep,
        city: data.address.city,
        neighborhood: data.address.neighborhood,
        state: data.address.uf,
        street: data.address.street,
        number: parseInt(data.address.number),
      };
      console.log('errador? ', pointData.longitude);
      const createdPoint = await createPoint(pointData);

      if (selectedImages.length > 0 && createdPoint?.id) {
        for (let i = 0; i < selectedImages.length; i++) {
          const imageUri = selectedImages[i];
          try {
            const result = await uploadPhoto('points', createdPoint.id, imageUri);
          } catch (error) {
            console.error(`Erro ao fazer upload da imagem ${i + 1}:`, error);
          }
        }
      } else if (selectedImages.length > 0) {
        console.error('Não foi possível fazer upload das imagens: ponto criado sem ID');
      }

      setIsModalVisible(true);
      reset();
      setSelectedImages([]);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar ponto',
        text2: 'Não foi possível criar o ponto. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView>
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
                <Picker.Item label="Sítio" value="house" />
                <Picker.Item label="Loja" value="shop" />
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
        <AddPointMidia
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImagesWithValidation}
        />
        {errors.images && (
          <Text style={styles.error}>{errors.images.message}</Text>
        )}

        <RegisterPointButton
          isLoading={isSubmitting}
          text={isSubmitting ? "Criando ponto..." : "Cadastrar ponto"}
          onPress={isSubmitting ? () => { } : handleSubmit(handleCreatePointWithImages)}
        />

        {isModalVisible && (
          <CustomModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            route="../myPoints"
            title="Ponto cadastrado com sucesso!"
            imageSource={require('@/assets/modalImages/check.png')}
          />
        )}
      </View>
    </ScrollView>
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
});
