import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

interface LoginButtonProps {
    onPress: () => void;
}

export default function RegisterButton( { onPress }: LoginButtonProps) {

    return (
        <TouchableOpacity 
            style={styles.button} 
            onPress={onPress}
        >
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: '#04d361',
      padding: 15,
      width: 200,
      alignItems: 'center',
      borderRadius: 4,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });