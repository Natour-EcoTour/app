import React, { useState } from 'react';

import { Text, View, StyleSheet, ScrollView } from 'react-native';

import NameInput from '../../../components/NameInput';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerPointSchema } from '@/src/validations/validationSchema';
import DescriptionInput from '@/src/components/DescriptionInput';
import AddressInput from '@/src/components/AddressInput';
import TimeInput from '@/src/components/TimeInput';
import RegisterPointButton from '@/src/components/RegisterPointButton';
import CustomModal from '@/src/components/CustomModal';

export default function AddPoint() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(registerPointSchema),
    defaultValues: {
      name: 'aaaa',
      description: 'aaaa',
      link: 'https://www.google.com',
      address: {
        cep: 'aaaa',
        city: 'aaaa',
        neighborhood: 'aaaa',
        uf: 'aaaa',
        latitude: 'aaaa',
        longitude: 'aaaa',
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

        {/* NOME DO PONTO */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <NameInput
                label="Nome do ponto"
                editable={true}
                placeholder="Digite o nome do seu ponto"
                onChange={onChange}
                value={value}
              />
              {errors.name && <Text style={styles.error}>{errors.name.message as string}</Text>}
            </>
          )}
        />
        <Text>Midia</Text>

        {/* Descrição DO PONTO */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <DescriptionInput
                label="Descrição do ponto"
                editable={true}
                placeholder="Digite a descrição do seu ponto"
                onChange={onChange}
                value={value}
              />
              {errors.description && <Text style={styles.error}>{errors.description.message as string}</Text>}
            </>
          )}
        />
        {/* horario */}
        <Text>Horário de funcionamento</Text>
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

        {/* URL */}
        <Controller
          control={control}
          name="link"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <NameInput
                label="Link do ponto (opcional)"
                editable={true}
                placeholder="Digite o link do seu ponto"
                onChange={onChange}
                value={value ?? ''}
              />
              {errors.link && <Text style={styles.error}>{errors.link.message as string}</Text>}
            </>
          )}
        />

        <Text>Endereço</Text>
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
                latitude: errors?.address?.latitude?.message,
                longitude: errors?.address?.longitude?.message,
              }}
            />
          )}
        />

        <RegisterPointButton
          text="Cadastrar ponto"
          onPress={handleSubmit((data) => {
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
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
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