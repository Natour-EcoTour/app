import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Linking } from 'react-native';

interface AddressProps {
  cep: string;
  city: string;
  neighborhood: string;
  uf: string;
  // latitude?: string;
  // longitude?: string;
  number: string;
  street: string;
}

export default function AddressContainer({
  cep,
  city,
  neighborhood,
  uf,
  number,
  street,
}: AddressProps) {
  const handleOpenInMaps = () => {
    const address = `${street}, ${number}, ${neighborhood}, ${city} - ${uf}, ${cep}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    Linking.openURL(url).catch(err =>
      console.error('Failed to open map:', err)
    );
  };

  return (
    <View style={styles.container}>
      <Text>{cep}</Text>
      <Text>
        {city}, {uf}
      </Text>
      <Text>
        {street}, {number}
      </Text>
      <Text>{neighborhood}</Text>

      <TouchableOpacity style={styles.mapButton} onPress={handleOpenInMaps}>
        <View style={styles.mapContent}>
          <Text style={styles.mapColor}>Abrir no maps</Text>
          <FontAwesome6 name="map" size={15} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '45%',
  },
  mapButton: {
    backgroundColor: 'darkgreen',
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContent: {
    alignItems: 'center',
  },
  mapColor: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
});
