import React from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, Image } from 'react-native';

const markers = [
  {
    id: 1,
    title: 'Pico do urubu',
    description: 'Trilha de caminhada',
    coordinate: { latitude: -23.484787, longitude: -46.206867 },
    icon: require('../../assets/points/trail_ico.png'),
  },
  {
    id: 2,
    title: 'Sítio do Seu Joaquim',
    description: 'Sítio',
    coordinate: { latitude: -23.474011, longitude: -46.216179 },
    icon: require('../../assets/points/house_ico.png'),
  },
];

export default function App() {
  const handleMarkerPress = (marker: any) => {
    console.log(`Clicked on: ${marker.title}`);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.550377,
          longitude: -46.63394,
          latitudeDelta: 6,
          longitudeDelta: 6,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            image={marker.icon}
            title={marker.title}
            description={marker.description}
            onPress={() => handleMarkerPress(marker)}
          >
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
