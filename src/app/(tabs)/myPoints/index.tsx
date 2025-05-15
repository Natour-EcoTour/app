import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

import MypointsBox from '../../../components/MyPointsBox';
import { router } from 'expo-router';

// interface Point {
//   id: number;
//   pointName: string;
//   pointStatus: boolean;
//   starTime: string;
//   closeTime: string;
//   views: number;
//   review: number;
// }

export default function MyPoints() {
  const points = [
    {
      id: 1,
      pointName: 'Parque dos Flamingos',
      pointStatus: false,
      starTime: '09:00',
      closeTime: '18:00',
      views: 350,
      review: 5,
    },
    {
      id: 2,
      pointName: 'Parque dos Fabianos',
      pointStatus: true,
      starTime: '10:00',
      closeTime: '11:00',
      views: 0,
      review: 0,
    },
    {
      id: 3,
      pointName: 'Lagoa do Coração',
      pointStatus: true,
      starTime: '07:30',
      closeTime: '17:45',
      views: 120,
      review: 4,
    },
    {
      id: 4,
      pointName: 'Parque dos Flamingos',
      pointStatus: false,
      starTime: '09:00',
      closeTime: '18:00',
      views: 350,
      review: 5,
    },
    {
      id: 5,
      pointName: 'Parque dos Fabianos',
      pointStatus: true,
      starTime: '10:00',
      closeTime: '11:00',
      views: 0,
      review: 0,
    },
    {
      id: 6,
      pointName: 'Lagoa do Coração',
      pointStatus: true,
      starTime: '07:30' ,
      closeTime: '17:45',
      views: 120,
      review: 4,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meus Pontos</Text>

      {points.length === 0 ? (
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
        points.map((point) => (
          <MypointsBox
            key={point.id}
            id={point.id}
            pointName={point.pointName}
            pointStatus={point.pointStatus}
            starTime={point.starTime}
            closeTime={point.closeTime}
            views={point.views}
            review={point.review}
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
  }
});
