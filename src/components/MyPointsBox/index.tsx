import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { View } from 'react-native';

interface MyPointsBoxProps {
  pointName: string;
  pointStatus: boolean;
  starTime: string;
  closeTime: string;
  views: number;
  review: number;
}

export default function MyPointsBox({
  pointName,
  pointStatus,
  starTime,
  closeTime,
  views,
  review
}: MyPointsBoxProps) {
  return (
    <View style={styles.box}>
      <View style={styles.teste}>
        <Text>{pointName}</Text>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBall,
              { backgroundColor: pointStatus ? 'green' : 'red' }
            ]}
          />
          <Text style={styles.statusText}>
            {pointStatus ? 'Ativo' : 'Desativado'}
          </Text>
        </View>
      </View>

      <Text>Horário de funcionamento: {starTime} - {closeTime}</Text>
      <Text>Visualizações: {views}</Text>
      <Text>Avaliação: {review} ⭐</Text>

      <View style={styles.details}>
        <Text style={styles.detailsText}>Ver detalhes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    elevation: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  statusBall: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
  },
  teste: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  detailsText: {
    color: '#00672e',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
