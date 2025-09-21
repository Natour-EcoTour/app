import {
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';

import MypointsBox from '@/components/MyPointsBox';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getMyPoints } from '@/services/points/getMyPointsService';
import { ActivityIndicator } from 'react-native-paper';

export default function PendingPoints() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    const fetchPoints = async () => {
      setIsLoading(true);
      const data = await getMyPoints({ status: 'null' });
      setPoints(data?.points || []);
      setIsLoading(false);
    };

    fetchPoints();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pontos em análise: {points.length}</Text>
      {isLoading ? (
        <>
          <ActivityIndicator size="large" color="#00672e" />
          <Text style={styles.emptyText}>Carregando...</Text>
        </>
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
            pointStatus={'null'}
            starTime={point.open_time}
            closeTime={point.close_time}
            views={point.views}
            rating={point.avg_rating}
            screen="pendingPoints"
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
    marginTop: 20,
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
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  analiseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'right',
  },
  analise: {
    fontSize: 15,
    color: '#00672e',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
