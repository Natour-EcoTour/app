import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';

interface MyPointsBoxProps {
  id: number;
  pointName: string;
  pointStatus: string;
  starTime: string;
  closeTime: string;
  views: number;
  review: number;
  screen: "myPoints" | "pendingPoints";
}

export default function MyPointsBox({
  id,
  pointName,
  pointStatus,
  starTime,
  closeTime,
  views,
  review,
  screen
}: MyPointsBoxProps) {
  return (
    <View style={styles.box}>
      <View style={styles.teste}>
        <Text style={styles.title}>{pointName}</Text>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBall,
              { backgroundColor: pointStatus === 'Ativo' ? 'green' : pointStatus === 'Desativado' ? 'red' : 'yellow' }
            ]}
          />
          <Text style={styles.statusText}>
            {pointStatus === 'Ativo'
              ? 'Ativo'
              : pointStatus === 'Desativado'
              ? 'Desativado'
              : 'Em análise'}
          </Text>
        </View>
      </View>

      <Text>Horário de funcionamento: {starTime} - {closeTime}</Text>
      <Text>Visualizações: {views}</Text>
      <Text>Avaliação: {review} ⭐</Text>

      <View style={styles.details}>
        <Link
          href={{
            pathname: `/${screen}/details/[id]`,
            params: { id: String(id) }
          }}
          style={styles.detailsText}
        >
          Ver detalhes
        </Link>
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
  title: {
    fontWeight: 'bold'
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
