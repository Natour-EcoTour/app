import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

export default function Rating() {

  return (
    <View style={styles.container}>
      <FontAwesome6 name="star" size={24} color="green" solid />
      <FontAwesome6 name="star" size={24} color="green" />
      <FontAwesome6 name="star" size={24} color="green" />
      <FontAwesome6 name="star" size={24} color="green" />
      <FontAwesome6 name="star" size={24} color="green" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  }
});