import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ImageCarousel from '@/src/components/ImageCarousel';
import ImageModal from '@/src/components/ImageModal';
import DescriptionContainer from '@/src/components/DescriptionContainer';
import TimeContainer from '@/src/components/TimeContainer';
import AddressContainer from '@/src/components/AddressContainer';
import { pointDetails } from '@/services/points/pointDetailsService';
import { ActivityIndicator } from 'react-native-paper';
import { translateWeekday } from '@/src/utils/weekdayTranslation';

export default function PendingPointDetail() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [point, setPoint] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { id } = useLocalSearchParams();

  const fetchPoints = async () => {
    setIsLoading(true);
    const data = await pointDetails(Number(id));

    if (data && data.photos) {
      data.images = data.photos.map((photo: string, index: number) => ({
        id: String(index + 1),
        image: photo,
      }));
    } else {
      data.images = [];
    }

    setPoint(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#00672e"
        />
        <Text style={styles.title}>Carregando...</Text>
      </View>
    );
  }

  if (!point) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ponto não encontrado</Text>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.analiseWrapper}>
        <TouchableOpacity style={styles.analiseContainer}>
          <Ionicons name={'arrow-back'} size={20} color={'darkgreen'} />
          <Text style={styles.analise} onPress={() => router.back()}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{point.name}</Text>

      <ImageCarousel
        images={point.images}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
        onImagePress={item => {
          setIsModalVisible(true);
        }}
      />

      <Text style={styles.title}>Descrição</Text>
      <DescriptionContainer description={point.description} />

      <Text style={styles.title}>Horários</Text>
      <TimeContainer
        startWeekday={translateWeekday(point.week_start)}
        endWeekday={translateWeekday(point.week_end)}
        startTime={point.open_time}
        endTime={point.close_time}
      />

      <Text style={styles.title}>Endereço</Text>
      <AddressContainer
        cep={point.zip_code}
        city={point.city}
        neighborhood={point.neighborhood}
        uf={point.uf}
        number={point.number}
        street={point.street}
        latitude={point.latitude}
        longitude={point.longitude}
      />

      {isModalVisible && (
        <ImageModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          imageUri={point?.images[currentImageIndex]?.image}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  analiseWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  analiseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'right',
  },
  analise: {
    fontSize: 20,
    color: '#00672e',
    fontWeight: 'bold',
  },
  statusContainer: {
    alignContent: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
