import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

import MypointsBox from '../../../components/MyPointsBox';

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
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meus Pontos</Text>

      {points.map((point) => (
        <MypointsBox
          key={point.id}
          pointName={point.pointName}
          pointStatus={point.pointStatus}
          starTime={point.starTime}
          closeTime={point.closeTime}
          views={point.views}
          review={point.review}
        />
      ))}
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
});
