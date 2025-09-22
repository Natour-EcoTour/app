import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function AddressInput({
  value,
  onChange,
  errors = {},
}: {
  value: {
    cep?: string;
    city?: string;
    neighborhood?: string;
    uf?: string;
    latitude?: string;
    longitude?: string;
    number?: string;
    street?: string;
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

  const inputTheme = {
    colors: {
      primary: '#00672e',
      outline: '#cccccc',
      onSurfaceVariant: '#666666',
      background: '#ffffff',
    },
  };

  const handleCoordinateChange = (
    text: string,
    field: 'latitude' | 'longitude'
  ) => {
    let cleaned = text.replace(/[^0-9.\-]/g, '');

    if (cleaned.includes('-')) {
      const minusCount = (cleaned.match(/-/g) || []).length;
      if (minusCount > 1) {
        cleaned = cleaned.replace(/-/g, '');
        if (text.startsWith('-')) {
          cleaned = '-' + cleaned;
        }
      } else if (!cleaned.startsWith('-')) {
        cleaned = cleaned.replace('-', '');
      }
    }

    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) {
      const parts = cleaned.split('.');
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    onChange({ ...value, [field]: cleaned });
  };

  const handleTextChange = (field: keyof typeof value, text: string) => {
    onChange({ ...value, [field]: text });
  };

  const handleCepChange = async (text: string) => {
    const cleanedCep = text.replace(/\D/g, '');

    // Update CEP immediately
    const updatedValue = { ...value, cep: cleanedCep };
    onChange(updatedValue);

    if (cleanedCep.length === 8) {
      try {
        setIsFetchingCep(true);
        const response = await fetch(
          `https://cep.awesomeapi.com.br/json/${cleanedCep}`
        );
        const data = await response.json();

        if (!data.erro && response.ok) {
          // Create the complete updated object with all fields
          const completeUpdatedValue = {
            ...updatedValue, // Keep the current CEP value
            city: data.city || '',
            neighborhood: data.district || '',
            uf: data.state || '',
            street: data.address || data.address_name || '',
            latitude: data.lat || '',
            longitude: data.lng || '',
            // Keep number unchanged
            number: value.number || '',
          };

          onChange(completeUpdatedValue);

          Toast.show({
            type: 'success',
            text1: 'CEP encontrado!',
            text2: 'Endereço preenchido automaticamente.',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro no CEP',
            text2: 'CEP não encontrado ou inválido.',
          });
        }
      } catch (error) {
        console.error('CEP API error:', error);
        Toast.show({
          type: 'error',
          text1: 'Erro no CEP',
          text2: 'Não foi possível consultar o CEP. Verifique sua conexão.',
        });
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="#6B7280"
        label="Latitude"
        mode="outlined"
        style={styles.input}
        value={value.latitude || ''}
        onChangeText={text => handleCoordinateChange(text, 'latitude')}
        keyboardType="numbers-and-punctuation"
        theme={inputTheme}
        outlineColor="#cccccc"
        activeOutlineColor="#00672e"
        maxLength={10}
      />
      <Text style={styles.helperText}>Ex: -23.517001</Text>
      {errors.latitude && (
        <Text style={styles.error}>{errors.latitude}</Text>
      )}

      <TextInput
        placeholderTextColor="#6B7280"
        label="Longitude"
        mode="outlined"
        style={styles.input}
        value={value.longitude || ''}
        onChangeText={text => handleCoordinateChange(text, 'longitude')}
        keyboardType="numbers-and-punctuation"
        theme={inputTheme}
        outlineColor="#cccccc"
        activeOutlineColor="#00672e"
        maxLength={10}
      />
      <Text style={styles.helperText}>Ex: -46.183404</Text>
      {errors.longitude && (
        <Text style={styles.error}>{errors.longitude}</Text>
      )}

      <Checkbox.Item
        label="Cadastrar por CEP?"
        status={isChecked ? 'checked' : 'unchecked'}
        onPress={() => setIsChecked(!isChecked)}
        color="#00672e"
        labelStyle={{ fontSize: 16 }}
      />

      {isChecked && (
        <>
          <TextInput
            placeholderTextColor="#6B7280"
            label="CEP"
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            outlineColor="#cccccc"
            activeOutlineColor="#00672e"
            value={value.cep || ''}
            onChangeText={handleCepChange}
            keyboardType="numeric"
            maxLength={8}
            right={isFetchingCep ? <TextInput.Icon icon="loading" /> : undefined}
          />
          {errors.cep && <Text style={styles.error}>{errors.cep}</Text>}

          <TextInput
            placeholderTextColor="#6B7280"
            label="Cidade"
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            outlineColor="#cccccc"
            activeOutlineColor="#00672e"
            value={value.city || ''}
            onChangeText={text => handleTextChange('city', text)}
          />
          {errors.city && <Text style={styles.error}>{errors.city}</Text>}

          <TextInput
            placeholderTextColor="#6B7280"
            label="Bairro"
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            outlineColor="#cccccc"
            activeOutlineColor="#00672e"
            value={value.neighborhood || ''}
            onChangeText={text => handleTextChange('neighborhood', text)}
          />
          {errors.neighborhood && (
            <Text style={styles.error}>{errors.neighborhood}</Text>
          )}

          <TextInput
            placeholderTextColor="#6B7280"
            label="UF"
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            outlineColor="#cccccc"
            activeOutlineColor="#00672e"
            value={value.uf || ''}
            onChangeText={text => handleTextChange('uf', text.toUpperCase())}
            maxLength={2}
            autoCapitalize="characters"
          />
          {errors.uf && <Text style={styles.error}>{errors.uf}</Text>}

          <TextInput
            placeholderTextColor="#6B7280"
            label="Rua"
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            outlineColor="#cccccc"
            activeOutlineColor="#00672e"
            value={value.street || ''}
            onChangeText={text => handleTextChange('street', text)}
          />
          {errors.street && <Text style={styles.error}>{errors.street}</Text>}

          <TextInput
            placeholderTextColor="#6B7280"
            label="Número"
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            outlineColor="#cccccc"
            activeOutlineColor="#00672e"
            value={value.number || ''}
            onChangeText={text =>
              handleTextChange('number', text.replace(/\D/g, ''))
            }
            keyboardType="numeric"
          />
          {errors.number && <Text style={styles.error}>{errors.number}</Text>}
        </>
      )}
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
  helperText: {
    color: '#666666',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -8,
    paddingLeft: 12,
  },
});