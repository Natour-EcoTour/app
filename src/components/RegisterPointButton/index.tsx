import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

interface LoginButtonProps {
  onPress: () => void;
  text: string;
}

export default function RegisterPointButton({
  onPress,
  text,
}: LoginButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00672e',
    padding: 15,
    width: 350,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
