import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function Banana() {
  // https://docs.expo.dev/tutorial/image-picker/
  // teste
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImageAsync}>
        <Text style={styles.text}>PERFIL</Text>
      </TouchableOpacity>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  carouselContainer: {
    marginBottom: 30,
    width: '100%',
  },
});