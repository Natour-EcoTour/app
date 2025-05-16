import { Text, View, StyleSheet } from 'react-native';

import NameInput from '../../../components/NameInput';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerPointSchema } from '@/src/validations/validationSchema';
import DescriptionInput from '@/src/components/DescriptionInput';

import TimeInput from '@/src/components/TimeInput';

export default function Settings() {

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(registerPointSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  return (
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
      <TimeInput></TimeInput>
      <Text>Horário</Text>
      <Text>URL</Text>

      <Text>Endereço</Text>
      <Text>Coordenadas (se precisar)</Text>
    </View>
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