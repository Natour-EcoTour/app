import { useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, FlatList, Dimensions, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import ImageModal from '@/components/ImageModal';
import ImageCarousel from '@/components/ImageCarousel';
import SearchPointInput from '@/components/SearchPointInput';
import customMapStyle from '@/utils/map_style';
import Rating from '@/components/StarRating';
import DescriptionContainer from '@/components/DescriptionContainer';
import TypeContainer from '@/components/TypeContainer';
import TimeContainer from '@/components/TimeContainer';
import AddressContainer from '@/components/AddressContainer';
import AddReview from '@/components/AddReview';
import { useRouter } from 'expo-router';
import { points } from '@/src/utils/assets';
import { mapPoints } from '@/services/map/mapPoints';
import { mapPointDetails } from '@/services/map/mapPointDetailsService';
import { addView } from '@/services/map/addViewService';


export default function Map() {
  const router = useRouter();
  
  // Default map region
  const DEFAULT_REGION = {
    latitude: -23.484787,
    longitude: -46.206867,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  
  // Use states
  const [markers, setMarkers] = useState<any[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImageItem, setModalImageItem] = useState<any | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [loading, setLoading] = useState(true);
  
  // Use refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null);
  const mapRef = useRef<MapView>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // Get icon for point type
  const getIconForPointType = (pointType: string) => {
    const iconMap: { [key: string]: any } = {
      'water_fall': points.waterfall,
      'park': points.park,
      'house': points.house,
      'shop': points.shop,
      'trail': points.trail,
    };
    return iconMap[pointType] || points.marker;
  };

  // Translate weekday to Portuguese
  function translateWeekday(week_start: string | number | undefined): string {
    if (typeof week_start === 'undefined' || week_start === null) return '';
    const weekdays: { [key: string]: string } = {
      'monday': 'Segunda-feira',
      'tuesday': 'Terça-feira',
      'wednesday': 'Quarta-feira',
      'thursday': 'Quinta-feira',
      'friday': 'Sexta-feira',
      'saturday': 'Sábado',
      'sunday': 'Domingo',
      '1': 'Segunda-feira',
      '2': 'Terça-feira',
      '3': 'Quarta-feira',
      '4': 'Quinta-feira',
      '5': 'Sexta-feira',
      '6': 'Sábado',
      '7': 'Domingo',
    };
    const key = String(week_start).toLowerCase();
    return weekdays[key] || '';
  };

  // Fetch all map points
  const fetchPoints = async () => {
    setLoading(true);
    const data = await mapPoints();

    const transformedMarkers = data?.map((point: any) => ({
      id: point.id,
      coordinate: {
        latitude: point.latitude,
        longitude: point.longitude,
      },
      title: point.name,
      type: point.point_type,
      icon: getIconForPointType(point.point_type),
      city: point.city,
      neighborhood: point.neighborhood,
      state: point.state,
    })) || [];

    setMarkers(transformedMarkers);
    setLoading(false);
  };

  useEffect(() => {
    fetchPoints();
  }, []);

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
        setLoading(false);
      })();
      return () => { isActive = false };
    }, [])
  );

  const handleMarkerPress = async (marker: any) => {

    setSelectedMarker(marker);
    setCurrentImageIndex(0);
    setLoadingDetails(true);
    bottomSheetRef.current?.snapToIndex(1);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });

    try {
      const detailedData = await mapPointDetails(marker.id);

      const detailedMarker = {
        ...marker,
        description: detailedData.description || 'Sem descrição disponível',
        rating: detailedData.avg_rating || 0,
        views: detailedData.views || 0,
        isActive: detailedData.is_active,
        link: detailedData.link,
        cep: detailedData.zip_code,
        uf: detailedData.state,
        number: detailedData.number,
        street: detailedData.street,
        latitude: marker.coordinate?.latitude,
        longitude: marker.coordinate?.longitude,
        images: detailedData.photos?.map((url: string, index: number) => ({
          id: `${marker.id}-${index}`,
          image: url
        })) || [],
        startWeekday: translateWeekday(detailedData.week_start),
        endWeekday: translateWeekday(detailedData.week_end),
        startTime: detailedData.open_time?.slice(0, 5),
        endTime: detailedData.close_time?.slice(0, 5),
      };

      setSelectedMarker(detailedMarker);
      await addView(marker.id);
    } catch (error) {
      console.error('Error fetching point details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSearchResultSelect = async (resultId: number, resultName: string) => {
    const marker = markers.find(m => m.id === resultId);

    if (marker) {
      mapRef.current?.animateToRegion({
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);

      await handleMarkerPress(marker);

      setSearchText('');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          customMapStyle={customMapStyle}
          showsBuildings={false}
          showsCompass={false}
          showsMyLocationButton={false}
          style={styles.map}
          region={region!}
          showsUserLocation={true}
          loadingEnabled={loading}
          loadingIndicatorColor="#00672e"
          loadingBackgroundColor="#ffffff"
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              onPress={() => handleMarkerPress(marker)}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <Image
                source={marker.icon}
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
            </Marker>

          ))}
        </MapView>

        {!isBottomSheetOpen && (
          <View style={styles.searchWrapper}>
            <SearchPointInput
              onChangeText={setSearchText}
              value={searchText}
              onSelectResult={handleSearchResultSelect}
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
          <BottomSheetScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
            {selectedMarker ? (
              <>
                <TypeContainer type={selectedMarker.type} />
                <Text style={styles.title}>{selectedMarker.title}</Text>

                {loadingDetails ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00672e" />
                    <Text style={styles.loadingText}>Carregando detalhes...</Text>
                  </View>
                ) : (
                  <>
                    <ImageCarousel
                      images={selectedMarker.images}
                      currentIndex={currentImageIndex}
                      setCurrentIndex={setCurrentImageIndex}
                      onImagePress={(item) => {
                        setModalImageItem(item);
                        setIsModalVisible(true);
                      }}
                    />

                    <Rating rating={selectedMarker.rating || 0} />

                    <Text style={styles.title}>Descrição</Text>
                    <DescriptionContainer description={selectedMarker.description} />

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
                      latitude={selectedMarker.latitude}
                      longitude={selectedMarker.longitude}
                    />
                    <AddReview
                      pointId={selectedMarker.id}
                    />
                  </>
                )}
              </>
            ) : (
              <Text style={styles.title}>Selecione um ponto no mapa</Text>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
      {isModalVisible && (
        <ImageModal
          isVisible={isModalVisible}
          onClose={() => { setIsModalVisible(false); setModalImageItem(null); }}
          imageItem={modalImageItem}
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});