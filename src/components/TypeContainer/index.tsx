import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TypeProps {
  type: string;
}

export default function TypeContainer( { type }: TypeProps ) {

  return (
    <View style={styles.container}>
      <Text style={styles.type}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'darkgreen',
    borderRadius: 10,
    borderWidth: 2,
    padding: 5,
    width: '35%',
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  }
});