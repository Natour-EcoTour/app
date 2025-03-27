import React, { useCallback, useMemo, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Image } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const markers = [
  {
    id: 1,
    title: 'Pico do urubu',
    description: 'Trilha de caminhada',
    coordinate: { latitude: -23.484787, longitude: -46.206867 },
    icon: require('../../../../assets/points/trail_ico.png'),
  },
  {
    id: 2,
    title: 'Sítio do Seu Joaquim',
    description: 'Sítio',
    coordinate: { latitude: -23.474011, longitude: -46.216179 },
    icon: require('../../../../assets/points/house_ico.png'),
  },
];

export default function App() {
  // State to store the selected marker
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  // ref for bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Bottom Sheet snap points
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // Handle marker press
  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
    bottomSheetRef.current?.expand(); // Expand Bottom Sheet when a marker is clicked
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              onPress={() => handleMarkerPress(marker)}
            />
          ))}
        </MapView>

        <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose={true}>
          <BottomSheetView style={styles.sheetContent}>
            {selectedMarker ? (
              <>
                <Text style={styles.title}>{selectedMarker.title}</Text>
                <Text style={styles.description}>{selectedMarker.description}</Text>
              </>
            ) : (
              <Text style={styles.title}>Selecione um ponto no mapa</Text>
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
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
  sheetContent: {
    padding: 16,
    alignItems: 'center',
  },
  markerIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
});
