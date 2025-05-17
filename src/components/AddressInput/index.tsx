import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';

export default function AddressInput({
  value,
  onChange,
  errors = {}
}: {
  value: {
    cep: string;
    city: string;
    neighborhood: string;
    uf: string;
    latitude: string;
    longitude: string;
  };
  onChange: (val: any) => void;
  errors?: {
    cep?: string;
    city?: string;
    neighborhood?: string;
    uf?: string;
    latitude?: string;
    longitude?: string;
  };
}) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCoordinateChange = (text: string, field: 'latitude' | 'longitude') => {
    const cleaned = text.replace(/[^0-9\.\-]/g, '');
    onChange({ ...value, [field]: cleaned });
  };

  const handleTextChange = (field: keyof typeof value, text: string) => {
    onChange({ ...value, [field]: text });
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
          {isChecked && errors.latitude && <Text style={styles.error}>{errors.latitude}</Text>}

          <TextInput
            label="Longitude"
            mode="outlined"
            style={styles.input}
            value={value.longitude}
            onChangeText={(text) => handleCoordinateChange(text, 'longitude')}
            keyboardType="numbers-and-punctuation"
          />
          {isChecked && errors.longitude && <Text style={styles.error}>{errors.longitude}</Text>}
        </>
      )}

      <TextInput
        label="CEP"
        mode="outlined"
        style={styles.input}
        value={value.cep}
        onChangeText={(text) => handleTextChange('cep', text)}
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
      />
      {errors.uf && <Text style={styles.error}>{errors.uf}</Text>}
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
