import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function AddressInput({
  value,
  onChange,
  errors = {},
}: {
  value: {
    cep: string;
    city: string;
    neighborhood: string;
    uf: string;
    latitude?: string;
    longitude?: string;
    number: string;
    street: string;
  };
  onChange: (val: any) => void;
  errors?: {
    cep?: string;
    city?: string;
    neighborhood?: string;
    uf?: string;
    latitude?: string;
    longitude?: string;
    number?: string;
    street?: string;
  };
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const handleCoordinateChange = (text: string, field: 'latitude' | 'longitude') => {
    const cleaned = text.replace(/[^0-9.\-]/g, '');
    onChange({ ...value, [field]: cleaned });
  };

  const handleTextChange = (field: keyof typeof value, text: string) => {
    onChange({ ...value, [field]: text });
  };

  const handleCepChange = async (text: string) => {
    const cleanedCep = text.replace(/\D/g, '');
    onChange({ ...value, cep: cleanedCep });

    if (cleanedCep.length === 8) {
      try {
        setIsFetchingCep(true);
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          onChange({
            ...value,
            cep: cleanedCep,
            city: data.localidade || '',
            neighborhood: data.bairro || '',
            uf: data.uf || '',
            street: data.logradouro || '',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro no CEP',
            text2: `CEP não encontrado ou inválido.`,
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Erro no CEP',
          text2: `CEP não encontrado ou inválido.`,
        });
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Checkbox.Item
        label="Cadastrar por coordenadas?"
        status={isChecked ? 'checked' : 'unchecked'}
        onPress={() => setIsChecked(!isChecked)}
        color="#00672e"
        labelStyle={{ fontSize: 16 }}
      />

      {isChecked && (
        <>
          <TextInput
            label="Latitude"
            mode="outlined"
            style={styles.input}
            value={value.latitude}
            onChangeText={(text) => handleCoordinateChange(text, 'latitude')}
            keyboardType="numbers-and-punctuation"
          />
          {errors.latitude && <Text style={styles.error}>{errors.latitude}</Text>}

          <TextInput
            label="Longitude"
            mode="outlined"
            style={styles.input}
            value={value.longitude}
            onChangeText={(text) => handleCoordinateChange(text, 'longitude')}
            keyboardType="numbers-and-punctuation"
          />
          {errors.longitude && <Text style={styles.error}>{errors.longitude}</Text>}
        </>
      )}

      <TextInput
        label="CEP"
        mode="outlined"
        style={styles.input}
        value={value.cep}
        onChangeText={handleCepChange}
        keyboardType="numeric"
        right={isFetchingCep ? <TextInput.Icon icon="loading" /> : undefined}
      />
      {errors.cep && <Text style={styles.error}>{errors.cep}</Text>}

      <TextInput
        label="Cidade"
        mode="outlined"
        style={styles.input}
        value={value.city}
        onChangeText={(text) => handleTextChange('city', text)}
      />
      {errors.city && <Text style={styles.error}>{errors.city}</Text>}

      <TextInput
        label="Bairro"
        mode="outlined"
        style={styles.input}
        value={value.neighborhood}
        onChangeText={(text) => handleTextChange('neighborhood', text)}
      />
      {errors.neighborhood && <Text style={styles.error}>{errors.neighborhood}</Text>}

      <TextInput
        label="UF"
        mode="outlined"
        style={styles.input}
        value={value.uf}
        onChangeText={(text) => handleTextChange('uf', text)}
        maxLength={2}
        autoCapitalize="characters"
      />
      {errors.uf && <Text style={styles.error}>{errors.uf}</Text>}

      <TextInput
        label="Rua"
        mode="outlined"
        style={styles.input}
        value={value.street}
        onChangeText={(text) => handleTextChange('street', text)}
      />
      {errors.street && <Text style={styles.error}>{errors.street}</Text>}

      <TextInput
        label="Número"
        mode="outlined"
        style={styles.input}
        value={value.number?.toString() || ''}
        onChangeText={(text) => handleTextChange('number', text.replace(/\D/g, ''))}
        keyboardType="numeric"
      />
      {errors.number && <Text style={styles.error}>{errors.number}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
  },
  input: {
    marginBottom: 10,
    width: '100%',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    marginTop: -5,
  },
});
