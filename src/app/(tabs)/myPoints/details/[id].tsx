import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import ImageCarousel from '@/src/components/ImageCarousel';
import ImageModal from '@/src/components/ImageModal';
import DescriptionContainer from '@/src/components/DescriptionContainer';
import TimeContainer from '@/src/components/TimeContainer';
import AddressContainer from '@/src/components/AddressContainer';
import CustomConfirmationModal from '@/src/components/CustomConfirmationModal';

export default function PointDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isActiveModalVisible, setActiveModalVisible] =
    useState<boolean>(false);
  const [pendingActive, setPendingActive] = useState<boolean | null>(null);
  const { id } = useLocalSearchParams();

  const points = [
    {
      id: 1,
      pointName: 'Parque zdos Flamingos',
      pointStatus: true,
      startWeekday: 'Segunda-feira',
      endWeekday: 'Domingo',
      startTime: '08:00',
      endTime: '18:00',
      views: 350,
      review: 5,
      images: [
        {
          id: '1',
          image:
            'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?cs=srgb&dl=pexels-souvenirpixels-417074.jpg&fm=jpg',
        },
        {
          id: '2',
          image:
            'https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-fall-nature-scenery-free-image.jpeg?w=600&quality=80',
        },
        {
          id: '3',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg',
        },
      ],
      description:
        'Uma trilha desafiadora com vistas incríveis do pico do urubu. Ideal para caminhadas e observação da natureza.',
      cep: '64000-680',
      city: 'Teresina',
      neighborhood: 'Cabral',
      uf: 'PI',
      number: '1',
      street: 'Rua Ghandi',
    },
    {
      id: 2,
      pointName: 'Parque dos Fabianos',
      pointStatus: true,
      startWeekday: 'Segunda-feira',
      endWeekday: 'Domingo',
      startTime: '08:00',
      endTime: '18:00',
      views: 0,
      review: 0,
      images: [
        {
          id: '1',
          image:
            'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?cs=srgb&dl=pexels-souvenirpixels-417074.jpg&fm=jpg',
        },
        {
          id: '2',
          image:
            'https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-fall-nature-scenery-free-image.jpeg?w=600&quality=80',
        },
        {
          id: '3',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg',
        },
      ],
      description:
        'Uma trilha desafiadora com vistas incríveis do pico do urubu. Ideal para caminhadas e observação da natureza.',
      cep: '64000-680',
      city: 'Teresina',
      neighborhood: 'Cabral',
      uf: 'PI',
      number: '1',
      street: 'Rua Ghandi',
    },
    {
      id: 3,
      pointName: 'Lagoa do Coração',
      pointStatus: true,
      startWeekday: 'Segunda-feira',
      endWeekday: 'Domingo',
      startTime: '08:00',
      endTime: '18:00',
      views: 120,
      review: 4,
      images: [
        {
          id: '1',
          image:
            'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?cs=srgb&dl=pexels-souvenirpixels-417074.jpg&fm=jpg',
        },
        {
          id: '2',
          image:
            'https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-fall-nature-scenery-free-image.jpeg?w=600&quality=80',
        },
        {
          id: '3',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg',
        },
      ],
      description:
        'Uma trilha desafiadora com vistas incríveis do pico do urubu. Ideal para caminhadas e observação da natureza.',
      cep: '64000-680',
      city: 'Teresina',
      neighborhood: 'Cabral',
      uf: 'PI',
      number: '1',
      street: 'Rua Ghandi',
    },
  ];

  const point = points.find(p => p.id === Number(id));

  if (!point) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ponto não encontrado</Text>
      </View>
    );
  }

  const [isActive, setIsActive] = useState(point.pointStatus);
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
      <View style={styles.statusSwitchContainer}>
        <Text>Status:</Text>
        <Switch
          trackColor={{ false: 'red', true: 'green' }}
          thumbColor={'white'}
          onValueChange={value => {
            if (value) {
              setIsActive(true);
            } else {
              setPendingActive(false);
              setActiveModalVisible(true);
            }
          }}
          value={isActive}
          style={styles.switch}
        />
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isActive ? 'Ativo' : 'Desativado'}
        </Text>
      </View>

      <Text style={styles.title}>{point.pointName}</Text>

      <ImageCarousel
        images={point.images}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
        onImagePress={item => {
          setIsModalVisible(true);
        }}
      />

      <Text style={styles.title}>Visualizações</Text>
      <Text style={styles.text}>{point.views} visualizações</Text>

      <Text style={styles.title}>Descrição</Text>
      <DescriptionContainer description={point.description} />

      <Text style={styles.title}>Horários</Text>
      <TimeContainer
        startWeekday={point.startWeekday}
        endWeekday={point.endWeekday}
        startTime={point.startTime}
        endTime={point.endTime}
      />

      <Text style={styles.title}>Endereço</Text>
      <AddressContainer
        cep={point.cep}
        city={point.city}
        neighborhood={point.neighborhood}
        uf={point.uf}
        number={point.number}
        street={point.street}
      />

      {isModalVisible && (
        <ImageModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          imageUri={point?.images[currentImageIndex]?.image}
        />
      )}

      {isActiveModalVisible && (
        <CustomConfirmationModal
          isVisible={isActiveModalVisible}
          onCancel={() => {
            setPendingActive(null);
            setActiveModalVisible(false);
          }}
          onConfirm={() => {
            setIsActive(false);
            setPendingActive(null);
            setActiveModalVisible(false);
          }}
          title="Deseja desativar esse ponto?"
          imagePath="warning"
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
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  statusSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
