import React, { useMemo, useRef, useState, useCallback } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import ImageModal from '../../../components/ImageModal';
import ImageCarousel from '../../../components/ImageCarousel';
import SearchPointInput from '../../../components/SearchPointInput';

import customMapStyle from '../../../utils/map_style';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ARROW_BUTTON_WIDTH = 40; // fixed width for each arrow button
const CAROUSEL_WIDTH = SCREEN_WIDTH - ARROW_BUTTON_WIDTH * 2 - 32; // subtract arrow widths and container padding

const markers = [
  {
    id: 1,
    title: 'Pico do urubu',
    description: 'Trilha de caminhada',
    coordinate: { latitude: -23.484787, longitude: -46.206867 },
    icon: require('../../../../assets/points/trail_ico.png'),
    images: [
      { id: '1', image: 'https://cdn.7tv.app/emote/01HSQ3J6Q000008KXKYN01Z0CG/4x.webp' },
      { id: '2', image: 'https://cdn.7tv.app/emote/01JR1QRQASW0P80QPTZAAB2SD6/4x.webp' },
      { id: '3', image: 'https://cdn.7tv.app/emote/01HMFS4B8G000EC6MR9CQX9SEJ/4x.webp' },
    ],
  },
  {
    id: 2,
    title: 'Sítio do Seu Joaquim',
    description: 'Sítio',
    coordinate: { latitude: -23.474011, longitude: -46.216179 },
    icon: require('../../../../assets/points/house_ico.png'),
    images: [
      { id: '1', image: 'https://instagram.fgru4-1.fna.fbcdn.net/v/t51.29350-15/481771387_1024103336198671_2426967987717668001_n.heic?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTc5OS5zZHIuZjI5MzUwLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.fgru4-1.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QEokspsqfRrq8cOgtfzrtQdC_91pi_9I-nN9Ux0Pt485vLBs_HwqBhuAyNUDpuGpU2XU7zq5bqV1rERTsWkw_2P&_nc_ohc=Coq7xYGCcvsQ7kNvwFo5JZY&_nc_gid=LFRImXyAyr9VnEtfa5Jb-g&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=MzU3NjgzNzk0NTI4Mzk3NDY4Ng%3D%3D.3-ccb7-5&oh=00_AYE8L81sto4BWDk9smt9rxnqqVLjkeNjhP5yHGdyUUAyVw&oe=67F753EE&_nc_sid=fc8dfb' },
      { id: '2', image: 'https://instagram.fgru4-1.fna.fbcdn.net/v/t51.29350-15/472456028_1265383644748431_5860172356905565300_n.heic?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5zZHIuZjI5MzUwLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.fgru4-1.fna.fbcdn.net&_nc_cat=103&_nc_oc=Q6cZ2QEnBiDvog0AbhtApyzU0e4pW4iLsjm99lbL9eXJvRH7s8EpxgnRpaWc9q0T1WkmMTusX7z2iR0kRagUH7w6hq-T&_nc_ohc=VqAndmfqka8Q7kNvwFQMknd&_nc_gid=4aF49uoJ6JfRaEKs-yeOuQ&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=MzUzOTAzMzcyMDE0MzU3MzMyNg%3D%3D.3-ccb7-5&oh=00_AYFPuCvfZiEfmKnvbNUpAY9m7NqkD3rln788CG8ARB54CQ&oe=67F73279&_nc_sid=fc8dfb' },
      { id: '3', image: 'https://pbs.twimg.com/media/GhCVa14XMAAIv6i.jpg' },
    ],
  },
];

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const [searchText, setSearchText] = useState('');

  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
    setCurrentImageIndex(0);
    bottomSheetRef.current?.expand();
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          customMapStyle={customMapStyle}
          showsBuildings={false}
          showsCompass={false}
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

        <View style={styles.searchWrapper}>
          <SearchPointInput
            onChange={(text) => setSearchText(text)}
            value={searchText}
          />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onChange={(index) => {
            if (index === -1) {
              setCurrentImageIndex(0);
            }
          }}
          onClose={() => setCurrentImageIndex(0)}
        >
          <BottomSheetView style={styles.sheetContent}>
            {selectedMarker ? (
              <>
                <Text style={styles.title}>{selectedMarker.title}</Text>
                <ImageCarousel
                  images={selectedMarker.images}
                  currentIndex={currentImageIndex}
                  setCurrentIndex={setCurrentImageIndex}
                  onImagePress={(item) => {
                    setIsModalVisible(true);
                  }}
                />
              </>
            ) : (
              <Text style={styles.title}>Selecione um ponto no mapa</Text>
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
      {isModalVisible && (
        <ImageModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          imageUri={selectedMarker?.images[currentImageIndex]?.image}
        />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  map: {
    width: '100%',
    height: '100%',
  },
  sheetContent: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  searchWrapper: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
});
