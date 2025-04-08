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
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    paddingTop: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 2,
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 16,
    borderRadius: 25,
    width: SCREEN_WIDTH - 20,
    alignSelf: 'center',
  },
});
