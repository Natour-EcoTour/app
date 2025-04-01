import React, { useCallback, useMemo, useRef, useState } from 'react'; 
import MapView, { Marker } from 'react-native-maps'; 
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';  
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'; 
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; 

import StarRating from '../../../components/StarRating';

const { width } = Dimensions.get('window'); 

const markers = [ 
  { 
    id: 1, 
    title: 'Pico do urubu', 
    description: 'O Pico do Urubu, é um pico com 1140 metros de altitude localizado no município de Mogi das Cruzes, Estado de São Paulo.', 
    coordinate: { latitude: -23.484787, longitude: -46.206867 }, 
    icon: require('../../../../assets/points/trail_ico.png'),
    images: [
      'https://images-ext-1.discordapp.net/external/FUjYOjNNNSC1lXOSKcECRLga4eBpKrcHVFlNUT860z0/https/pbs.twimg.com/media/GaM0XF5aUAAwCf8.jpg%3Alarge?format=webp&width=585&height=780',
      'https://media.discordapp.net/attachments/827008047054192720/1241429142243643412/Untitled-1.png?ex=67ec15fc&is=67eac47c&hm=a494ca42eff43d1578af57e4285a867cd86fa9cac7175501978b5cbad74580a1&=&format=webp&quality=lossless&width=125&height=125'
    ],
  }, 
  { 
    id: 2, 
    title: 'Sítio do Seu Joaquim', 
    description: 'Sítio', 
    coordinate: { latitude: -23.474011, longitude: -46.216179 }, 
    icon: require('../../../../assets/points/house_ico.png'),
    images: [
      'https://media.discordapp.net/attachments/827008047054192720/1300183225057935390/image.png?ex=67ec41fd&is=67eaf07d&hm=b7d360e8ba92d3abc8778ab444959d54e7a10e539b98e5aa30c5ea86d79b3e07&=&format=webp&quality=lossless&width=1075&height=680',
      'https://media.discordapp.net/attachments/827008047054192720/1241429142243643412/Untitled-1.png?ex=67ec15fc&is=67eac47c&hm=a494ca42eff43d1578af57e4285a867cd86fa9cac7175501978b5cbad74580a1&=&format=webp&quality=lossless&width=125&height=125'
    ],
  }, 
]; 

export default function App() { 
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Add state to track the current image index
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null); // Reference for FlatList
  
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  
  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
    setCurrentIndex(0); // Reset to first image when a new marker is selected
    bottomSheetRef.current?.expand();
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

                <FlatList 
                  ref={flatListRef} 
                  style={styles.imageContainer} 
                  keyExtractor={(item, index) => index.toString()} 
                  data={selectedMarker.images.map((img: string) => ({ url: img }))} 
                  renderItem={({item}) => ( 
                    <Image source={{ uri: item?.url }} style={styles.listImage} /> 
                  )} 
                  contentContainerStyle={{ gap: 20 }} 
                  snapToInterval={40} 
                  pagingEnabled 
                  horizontal 
                />

                <Text style={styles.description}>{selectedMarker.description}</Text>
                
                <StarRating />
                
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
    fontSize: 25,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  imageContainer: {
    width: width - 40,
    height: 200,
    overflow: 'hidden',
    marginTop: 10,
    marginRight: 10,
    alignContent: 'center',
  },
  listImage: {
    width: width - 40,
    height: 200,
    resizeMode: 'cover',
  },
  arrowRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 100,
    marginVertical: 10,
  },
  arrowButton: {
    marginHorizontal: 20,
  },
  arrowIcon: {
    width: 40,
    height: 40,
  },
});
