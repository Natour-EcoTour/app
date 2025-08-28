import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import MypointsBox from '@/components/MyPointsBox';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMyPoints } from '@/services/points/getMyPointsService';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';

export default function MyPoints() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [points, setPoints] = useState<any[]>([]);

  const fetchPoints = async () => {
    console.log('Fetching points...');
    setIsLoading(true);
    const data = await getMyPoints({ status: 'true' });
    console.log('Points fetched:', data?.points?.length || 0);
    setPoints(data?.points || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  const handlePointDeleted = () => {
    fetchPoints();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.analiseWrapper}>
        <TouchableOpacity style={styles.analiseContainer}>
          <Ionicons name={'arrow-back'} size={20} color={'darkgreen'} />
          <Text
            style={styles.analise}
            onPress={() => router.push('/(main)/settings')}
          >
            Voltar
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meus Pontos: {points.length}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#00672e" />
      ) : points.length === 0 ? (
        <View>
          <Text style={styles.emptyText}>Nenhum ponto cadastrado</Text>
          <Text
            style={styles.link}
            onPress={() => router.push('/(tabs)/addPoint')}
          >
            Clique aqui para cadastrar um novo ponto
          </Text>
        </View>
      ) : (
        points.map(point => (
          <MypointsBox
            key={point.id}
            id={point.id}
            pointName={point.name}
            pointStatus={'true'}
            starTime={point.open_time}
            closeTime={point.close_time}
            views={point.views}
            rating={point.avg_rating}
            screen="myPoints"
            onDeleteSuccess={handlePointDeleted}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#00672e',
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    marginTop: 25,
    fontSize: 17,
    color: '#00672e',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
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
});
