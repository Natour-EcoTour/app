import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Linking } from 'react-native';

interface AddressProps {
  cep?: string;
  city?: string;
  neighborhood?: string;
  uf?: string;
  latitude?: string;
  longitude?: string;
  number?: string;
  street?: string;
}

export default function AddressContainer({
  cep,
  city,
  neighborhood,
  uf,
  number,
  street,
  latitude,
  longitude
}: AddressProps) {
  const handleOpenInMaps = () => {
    let url: string;

    if (latitude && longitude && latitude !== '' && longitude !== '') {
      const coordinates = `${latitude}, ${longitude}`;
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`;
    }
    else if (cep || (street && city)) {
      const address = `${street}, ${number}, ${neighborhood}, ${city} - ${uf}, ${cep}`;
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }
    else {
      console.warn('No valid location data available for maps');
      return;
    }

    Linking.openURL(url).catch(err =>
      console.error('Failed to open map:', err)
    );
  };

  const hasAddress = cep || street || city || neighborhood || uf || number;
  const hasCoordinates = latitude && longitude && latitude !== '' && longitude !== '';

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        {hasAddress ? (
          <>
            {cep && <Text>{cep}</Text>}
            {(city || uf) && (
              <Text>
                {city}{city && uf && ', '}{uf}
              </Text>
            )}
            {(street || number) && (
              <Text>
                {street}{street && number && ', '}{number}
              </Text>
            )}
            {neighborhood && <Text>{neighborhood}</Text>}
          </>
        ) : hasCoordinates ? (
          <>
            <Text>Latitude: {latitude}</Text>
            <Text>Longitude: {longitude}</Text>
          </>
        ) : (
          <Text>Localização não disponível</Text>
        )}
      </View>
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
    justifyContent: 'center',
    alignContent: 'center',
    width: '80%',
  },
  addressContainer: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
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
