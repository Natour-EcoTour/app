import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import { StyleSheet, View, Text, FlatList, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import ImageModal from '../../../components/ImageModal';
import ImageCarousel from '../../../components/ImageCarousel';
import SearchPointInput from '../../../components/SearchPointInput';
import customMapStyle from '../../../utils/map_style';
import Rating from '../../../components/StarRating';
import DescriptionContainer from '../../../components/DescriptionContainer';
import TypeContainer from '../../../components/TypeContainer';
import TimeContainer from '../../../components/TimeContainer';
import AddressContainer from '../../../components/AddressContainer';
import AddReview from '../../../components/AddReview';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ARROW_BUTTON_WIDTH = 40; // fixed width for each arrow button
const CAROUSEL_WIDTH = SCREEN_WIDTH - ARROW_BUTTON_WIDTH * 2 - 32; // subtract arrow widths and container padding

const markers = [
  {
    id: 1,
    type: 'Trilha',
    title: 'Pico do urubu',
    coordinate: { latitude: -23.484787, longitude: -46.206867 },
    icon: require('../../../../assets/points/trail_ico.png'),
    images: [
      { id: '1', image: 'https://cdn.7tv.app/emote/01HSQ3J6Q000008KXKYN01Z0CG/4x.webp' },
      { id: '2', image: 'https://cdn.7tv.app/emote/01JR1QRQASW0P80QPTZAAB2SD6/4x.webp' },
      { id: '3', image: 'https://cdn.7tv.app/emote/01HMFS4B8G000EC6MR9CQX9SEJ/4x.webp' },
    ],
    description: 'Uma trilha desafiadora com vistas incríveis do pico do urubu. Ideal para caminhadas e observação da natureza.',
    startWeekday: "Segunda",
    endWeekday: "Domingo",
    startTime: "08:00",
    endTime: "18:00",
    cep: '64000-680',
    city: 'Teresina',
    neighborhood: 'Cabral',
    uf: 'PI',
    number: '1',
    street: 'Rua Ghandi'
  },
  {
    id: 2,
    type: 'Sitio',
    title: 'Sítio do Seu Joaquim',
    coordinate: { latitude: -23.474011, longitude: -46.216179 },
    icon: require('../../../../assets/points/house_ico.png'),
    images: [
      { id: '1', image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?cs=srgb&dl=pexels-souvenirpixels-417074.jpg&fm=jpg' },
      { id: '2', image: 'https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-fall-nature-scenery-free-image.jpeg?w=600&quality=80' },
      { id: '3', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg' },
    ],
    description: 'Uma trilha desafiadora com vistas incríveis do pico do urubu. Ideal para caminhadas e observação da natureza.',
    startWeekday: "Segunda",
    endWeekday: "Domingo",
    startTime: "08:00",
    endTime: "18:00",
    cep: '64000-680',
    city: 'Teresina',
    neighborhood: 'Cabral',
    uf: 'PI',
    number: '1',
    street: 'Rua Ghandi'
  },
];

export default function Map() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const [searchText, setSearchText] = useState('');

  const [region, setRegion] = useState<Region | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          router.push('../noPermission')
          return;
        }
        let { coords } = await Location.getCurrentPositionAsync({});
        if (isActive) {
          setRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      })();
      // cleanup
      return () => { isActive = false };
    }, [])
  );

  if (!region) {
    // Optional: Loading screen or null while fetching
    return null;
  }

  //console.log('Region:', region);

  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
    setCurrentImageIndex(0);
    bottomSheetRef.current?.snapToIndex(1);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          customMapStyle={customMapStyle}
          showsBuildings={false}
          showsCompass={false}
          showsMyLocationButton={false}
          style={styles.map}
          region={region!}
          showsUserLocation={true}
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

        {!isBottomSheetOpen && (
          <View style={styles.searchWrapper}>
            <SearchPointInput
              onChange={(text) => setSearchText(text)}
              value={searchText}
            />
          </View>
        )}

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.sheetHandle}
          onChange={(index) => {
            setIsBottomSheetOpen(index !== -1);
            if (index === -1) {
              setCurrentImageIndex(0);
            }
          }}
          onClose={() => setCurrentImageIndex(0)}
        >
          <BottomSheetScrollView>
            <BottomSheetView style={styles.sheetContent}>
              {selectedMarker ? (
                <>
                  <TypeContainer
                    type={selectedMarker.type}
                  />

                  <Text style={styles.title}>{selectedMarker.title}</Text>
                  <ImageCarousel
                    images={selectedMarker.images}
                    currentIndex={currentImageIndex}
                    setCurrentIndex={setCurrentImageIndex}
                    onImagePress={(item) => {
                      setIsModalVisible(true);
                    }}
                  />

                  <Rating />

                  <Text style={styles.title}>Descrição</Text>
                  <DescriptionContainer
                    description={selectedMarker.description}
                  />

                  <Text style={styles.title}>Horários</Text>
                  <TimeContainer
                    startWeekday={selectedMarker.startWeekday}
                    endWeekday={selectedMarker.endWeekday}
                    startTime={selectedMarker.startTime}
                    endTime={selectedMarker.endTime}
                  />

                  <Text style={styles.title}>Endereço</Text>
                  <AddressContainer
                    cep={selectedMarker.cep}
                    city={selectedMarker.city}
                    neighborhood={selectedMarker.neighborhood}
                    uf={selectedMarker.uf}
                    number={selectedMarker.number}
                    street={selectedMarker.street}
                  />

                  <AddReview />

                </>
              ) : (
                <Text style={styles.title}>Selecione um ponto no mapa</Text>
              )}

            </BottomSheetView>
          </BottomSheetScrollView>
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
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  sheetBackground: {
    backgroundColor: 'white',
    borderRadius: 30,
    shadowColor: '#000',
    borderColor: 'darkgreen',
    borderWidth: 5,
    borderStyle: 'solid',
  },
  sheetHandle: {
    backgroundColor: 'darkgreen',
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
});
