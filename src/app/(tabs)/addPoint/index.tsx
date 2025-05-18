import React, { useState } from 'react';

import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerPointSchema } from '@/src/validations/validationSchema';

import NameInput from '../../../components/NameInput';
import DescriptionInput from '@/src/components/DescriptionInput';
import AddressInput from '@/src/components/AddressInput';
import TimeInput from '@/src/components/TimeInput';
import RegisterPointButton from '@/src/components/RegisterPointButton';
import CustomModal from '@/src/components/CustomModal';
import AddPointMidia from '@/src/components/AddPointMidia';


export default function AddPoint() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerPointSchema),
    defaultValues: {
      name: 'aaa',
      description: 'aaa',
      link: 'https://www.google.com',
      address: {
        cep: '03434455',
        city: 'aaa',
        neighborhood: 'aaa',
        uf: 'aaa',
        street: 'aaa',
        number: 'aaa',
        latitude: 'aaa',
        longitude: 'aaa',
      },
      time: {
        weekStart: 'Segunda-feira',
        weekEnd: 'Segunda-feira',
        timeStart: '1000',
        timeEnd: '1000',
      },
    },
  });

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
              onChange={onChange}
              value={{
                ...value,
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

        <Text style={styles.stepTitle}>Midia</Text>
        <AddPointMidia
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />

        <RegisterPointButton
          text="Cadastrar ponto"
          onPress={handleSubmit((data) => {
            if (selectedImages.length === 0) {
              alert('Adicione pelo menos uma imagem antes de continuar.');
              return;
            }

            console.log('data', data);
            setIsModalVisible(true);
          })}
        />

        {isModalVisible && (
          <CustomModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            route="../myPoints"
            title="Ponto cadastrado com sucesso!"
            imagePath="check"
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
});
