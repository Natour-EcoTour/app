import React from 'react';
import { TextInput, StyleSheet, View, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SearchPointInputProps {
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
}

export default function SearchPointInput({
  placeholder = 'Digite o nome do ponto...',
  value,
  onChange,
}: SearchPointInputProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder={placeholder}
        keyboardType="default"
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholderTextColor="rgba(56, 56, 56, 0.56)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    elevation: 15, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    borderColor: 'rgba(0, 0, 0, 0.31)',
    borderWidth: 2,
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 16,
    borderRadius: 15,
    width: SCREEN_WIDTH - 50,
    alignSelf: 'center',
  },
});
