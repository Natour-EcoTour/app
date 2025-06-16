import React from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

export default function NoPermission() {
  const router = useRouter()

  const handlePermissionRequest = async () => {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      router.push('./(main)/map');
    } else if (!canAskAgain) {
      Linking.openSettings();
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Permissão de localização</Text>
        <Text style={{ textAlign: 'center', fontSize: 16, color: '#333' }}>
          O <Text style={{ fontWeight: 'bold' }}>Natour</Text> precisa que você permita o acesso à sua localização para que possamos exibir a tela de mapas.
          Assim, você poderá encontrar novos pontos turísticos ecológicos próximos a você ou até mesmo cadastrar os seus próprios!
        </Text>

        <Image
          style={{ width: 310, height: 310 }}
          resizeMode='contain'
          source={require('../../../assets/images/noPermission.png')}
        />

        <View style={styles.permissionsContainer}>
          <TouchableOpacity style={styles.permissionsButton1} onPress={handlePermissionRequest}>
            <Text style={styles.permissionText1}>Permitir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.permissionsButton2}
            onPress={() => router.push('./')}
          >
            <Text style={styles.permissionText2}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '90%',
    height: '80%',
    alignItems: 'center',
  },
  title: {
    color: '#00672e',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  permissionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 20,
  },
  permissionsButton1: {
    backgroundColor: 'darkgreen',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  permissionsButton2: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    borderColor: 'darkgreen',
    borderWidth: 2,
  },
  permissionText1: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionText2: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  }
});