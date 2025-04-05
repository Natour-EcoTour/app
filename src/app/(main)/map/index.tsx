import React, { useMemo, useRef, useState, useCallback } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import ImageModal from '../../../components/ImageModal';

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
      { id: '1', image: 'https://instagram.fgru4-1.fna.fbcdn.net/v/t51.29350-15/481771387_1024103336198671_2426967987717668001_n.heic?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTc5OS5zZHIuZjI5MzUwLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.fgru4-1.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QEokspsqfRrq8cOgtfzrtQdC_91pi_9I-nN9Ux0Pt485vLBs_HwqBhuAyNUDpuGpU2XU7zq5bqV1rERTsWkw_2P&_nc_ohc=Coq7xYGCcvsQ7kNvwFo5JZY&_nc_gid=LFRImXyAyr9VnEtfa5Jb-g&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=MzU3NjgzNzk0NTI4Mzk3NDY4Ng%3D%3D.3-ccb7-5&oh=00_AYE8L81sto4BWDk9smt9rxnqqVLjkeNjhP5yHGdyUUAyVw&oe=67F753EE&_nc_sid=fc8dfb'},
      { id: '2', image: 'https://instagram.fgru4-1.fna.fbcdn.net/v/t51.29350-15/472456028_1265383644748431_5860172356905565300_n.heic?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5zZHIuZjI5MzUwLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.fgru4-1.fna.fbcdn.net&_nc_cat=103&_nc_oc=Q6cZ2QEnBiDvog0AbhtApyzU0e4pW4iLsjm99lbL9eXJvRH7s8EpxgnRpaWc9q0T1WkmMTusX7z2iR0kRagUH7w6hq-T&_nc_ohc=VqAndmfqka8Q7kNvwFQMknd&_nc_gid=4aF49uoJ6JfRaEKs-yeOuQ&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=MzUzOTAzMzcyMDE0MzU3MzMyNg%3D%3D.3-ccb7-5&oh=00_AYFPuCvfZiEfmKnvbNUpAY9m7NqkD3rln788CG8ARB54CQ&oe=67F73279&_nc_sid=fc8dfb'},
      { id: '3', image: 'https://pbs.twimg.com/media/GhCVa14XMAAIv6i.jpg' },
    ],
  },
  {
    id: 2,
    title: 'Sítio do Seu Joaquim',
    description: 'Sítio',
    coordinate: { latitude: -23.474011, longitude: -46.216179 },
    icon: require('../../../../assets/points/house_ico.png'),
    images: [
      { id: '1', image: 'https://instagram.fgru4-1.fna.fbcdn.net/v/t51.29350-15/481771387_1024103336198671_2426967987717668001_n.heic?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTc5OS5zZHIuZjI5MzUwLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.fgru4-1.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QEokspsqfRrq8cOgtfzrtQdC_91pi_9I-nN9Ux0Pt485vLBs_HwqBhuAyNUDpuGpU2XU7zq5bqV1rERTsWkw_2P&_nc_ohc=Coq7xYGCcvsQ7kNvwFo5JZY&_nc_gid=LFRImXyAyr9VnEtfa5Jb-g&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=MzU3NjgzNzk0NTI4Mzk3NDY4Ng%3D%3D.3-ccb7-5&oh=00_AYE8L81sto4BWDk9smt9rxnqqVLjkeNjhP5yHGdyUUAyVw&oe=67F753EE&_nc_sid=fc8dfb'},
      { id: '2', image: 'https://instagram.fgru4-1.fna.fbcdn.net/v/t51.29350-15/472456028_1265383644748431_5860172356905565300_n.heic?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5zZHIuZjI5MzUwLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.fgru4-1.fna.fbcdn.net&_nc_cat=103&_nc_oc=Q6cZ2QEnBiDvog0AbhtApyzU0e4pW4iLsjm99lbL9eXJvRH7s8EpxgnRpaWc9q0T1WkmMTusX7z2iR0kRagUH7w6hq-T&_nc_ohc=VqAndmfqka8Q7kNvwFQMknd&_nc_gid=4aF49uoJ6JfRaEKs-yeOuQ&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=MzUzOTAzMzcyMDE0MzU3MzMyNg%3D%3D.3-ccb7-5&oh=00_AYFPuCvfZiEfmKnvbNUpAY9m7NqkD3rln788CG8ARB54CQ&oe=67F73279&_nc_sid=fc8dfb'},
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

  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
    setCurrentImageIndex(0);
    bottomSheetRef.current?.expand();
    // Scroll to first image whenever a marker is selected
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });

  }

  const viewabilityConfig = useMemo(() => ({ viewAreaCoveragePercentThreshold: 50 }), []);
  
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index);
    }
  }).current;

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentImageIndex(index);
  };

  const handlePrev = useCallback(() => {
    if (selectedMarker && currentImageIndex > 0) {
      scrollToIndex(currentImageIndex - 1);
    }
  }, [currentImageIndex, selectedMarker]);

  const handleNext = useCallback(() => {
    if (selectedMarker && currentImageIndex < selectedMarker.images.length - 1) {
      scrollToIndex(currentImageIndex + 1);
    }
  }, [currentImageIndex, selectedMarker]);

  const renderImageItem = ({ item }: { item: { id: string; image: string } }) => (
    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="center" />
      </View>
    </TouchableOpacity>
  );

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

        <BottomSheet 
          ref={bottomSheetRef} 
          index={-1} 
          snapPoints={snapPoints} 
          enablePanDownToClose={true}
        >
          <BottomSheetView style={styles.sheetContent}>
            {selectedMarker ? (
              <>
                <Text style={styles.title}>{selectedMarker.title}</Text>
                <View style={styles.carouselContainer}>
                  <TouchableOpacity style={[styles.arrowButton, { width: ARROW_BUTTON_WIDTH }]} onPress={handlePrev} disabled={currentImageIndex === 0}>
                    <Text style={styles.arrowText}>{'<'}</Text>
                  </TouchableOpacity>
                  
                  <View style={[styles.flatListContainer, { width: CAROUSEL_WIDTH }]}>
                    <FlatList
                      ref={flatListRef}
                      data={selectedMarker.images}
                      horizontal
                      pagingEnabled
                      keyExtractor={(item) => item.id}
                      renderItem={renderImageItem}
                      showsHorizontalScrollIndicator={false}
                      onViewableItemsChanged={onViewableItemsChanged}
                      viewabilityConfig={viewabilityConfig}
                    />  
                  </View>
                  <TouchableOpacity style={[styles.arrowButton, { width: ARROW_BUTTON_WIDTH }]} onPress={handleNext} disabled={selectedMarker && currentImageIndex === selectedMarker.images.length - 1}>
                    <Text style={styles.arrowText}>{'>'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.ImagesIndex}>
                  <Text>{currentImageIndex + 1 }/{selectedMarker.images.length}</Text>
                </View>

                <Text style={styles.description}>{selectedMarker.description}</Text>
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
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  imageContainer: {
    width: SCREEN_WIDTH - 40,
    height: 200,
    overflow: 'hidden',
    marginTop: 10,
    marginRight: 10,
    alignContent: 'center',
  },
  listImage: {
    width: SCREEN_WIDTH - 40,
    height: 200,
    resizeMode: 'cover',
  },
  arrowRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 100,
    marginVertical: 10,
  },
  arrowIcon: {
    width: 40,
    height: 40,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  arrowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  arrowText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'gray',
  },
  flatListContainer: {
    // This container reserves the proper width for the FlatList
    overflow: 'hidden',
  },
  image: {
    width: CAROUSEL_WIDTH,
    height: 200, // adjust as needed
  },
  ImagesIndex: {
    alignContent: 'center',
  }
});

