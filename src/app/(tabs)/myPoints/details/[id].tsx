import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import ImageCarousel from '@/src/components/ImageCarousel';
import ImageModal from '@/src/components/ImageModal';
import DescriptionContainer from '@/src/components/DescriptionContainer';
import TimeContainer from '@/src/components/TimeContainer';
import AddressContainer from '@/src/components/AddressContainer';
import CustomConfirmationModal from '@/src/components/CustomConfirmationModal';
import { pointDetails } from '@/services/points/pointDetailsService';
import { changePointStatus } from '@/services/points/changePointStatusService';

export default function PointDetail() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChangingStatus, setIsChangingStatus] = useState<boolean>(false);
  const [point, setPoint] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isActiveModalVisible, setActiveModalVisible] =
    useState<boolean>(false);
  const [pendingActive, setPendingActive] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
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

  useEffect(() => {
    if (point) {
      setIsActive(point?.is_active || false);
    }
  }, [point]);

  const handleStatusChange = async (value: boolean) => {
    if (isChangingStatus) {
      return;
    }

    if (value) {
      try {
        setIsChangingStatus(true);
        const result = await changePointStatus(Number(id));

        if (result) {
          setPoint((prevPoint: any) => ({ ...prevPoint, is_active: result.is_active }));
        }

      } catch (error) {
        console.error('Error activating point:', error);
      } finally {
        setIsChangingStatus(false);
      }
    } else {
      setPendingActive(false);
      setActiveModalVisible(true);
    }
  };

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
      <View style={styles.statusSwitchContainer}>
        <Text>Status:</Text>
        <Switch
          trackColor={{ false: 'red', true: 'green' }}
          thumbColor={'white'}
          disabled={isChangingStatus}
          onValueChange={value => {
            if (value) {
              handleStatusChange(true);
            } else {
              handleStatusChange(false);
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

      <Text style={styles.title}>{point.name}</Text>

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

      {/* TODO AJUSTAR NO BACK PARA QUE week_start E week_end SEJAM ENUM OU ALGO DO TIPO PQ TA SALVANDO COMO DATA */}
      <Text style={styles.title}>Horários</Text>
      <TimeContainer
        startWeekday={point.startWeekday}
        endWeekday={point.endWeekday}
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
          onConfirm={async () => {
            if (isChangingStatus) {
              return;
            }

            try {
              setIsChangingStatus(true);
              const result = await changePointStatus(Number(id));

              if (result) {
                setPoint((prevPoint: any) => ({ ...prevPoint, is_active: result.is_active }));
              }

              setPendingActive(null);
              setActiveModalVisible(false);
            } catch (error) {
              setPendingActive(null);
              setActiveModalVisible(false);
            } finally {
              setIsChangingStatus(false);
            }
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
