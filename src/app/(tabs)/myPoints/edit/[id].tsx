import { useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AddPoint() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
        weekEnd: 'Domingo',
        timeStart: '10:00',
        timeEnd: '18:00',
      },
      type: 'Trilha',
    },
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.analiseWrapper}>
          <TouchableOpacity style={styles.analiseContainer}>
            <Ionicons name={'arrow-back'} size={20} color={'darkgreen'} />
            <Text style={styles.analise} onPress={() => router.back()}>
              Voltar
            </Text>
          </TouchableOpacity>
        </View>

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
                <Picker.Item label="Trilha" value="trilha" />
                <Picker.Item label="Cachoeira" value="cachoeira" />
                <Picker.Item label="Parque" value="parque" />
                <Picker.Item label="Sítio" value="sitio" />
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

        <Text style={styles.stepTitle}>Mídia</Text>
        <AddPointMidia
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />

        <RegisterPointButton
          text="Editar ponto"
          onPress={handleSubmit(data => {
            if (selectedImages.length === 0) {
              Toast.show({
                type: 'error',
                text1: 'Erro no campo de mídia',
                text2: 'Adicione pelo menos uma imagem antes de continuar.',
              });
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
            route="../../pendingPoints"
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
  analiseWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  analiseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'right',
  },
  analise: {
    fontSize: 20,
    color: '#00672e',
    fontWeight: 'bold',
  },
});
