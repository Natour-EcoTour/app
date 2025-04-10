import React from 'react';
import { Text, View, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function UserTerms() {
  return (
    <ImageBackground 
      source={require('../../../../assets/images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Termos de Uso</Text>

        <View style={styles.textBox}>
          <ScrollView showsVerticalScrollIndicator={true}>
            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, nunc vel malesuada placerat, 
              neque velit tincidunt justo, vitae varius nulla lorem eget neque. Ut eget purus a justo gravida scelerisque. 
              Mauris malesuada, libero vel varius tincidunt, magna augue faucibus turpis, ut cursus velit felis in arcu. 
              Integer dictum nisl et magna porttitor, a interdum lorem interdum. Aenean vel orci eu velit tristique malesuada.
              {"\n\n"}
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
              Donec quis nibh sed libero volutpat eleifend. Morbi non mauris eget purus vulputate consequat. 
              Suspendisse potenti. Proin sit amet sem nec justo pharetra vehicula vel eu dolor.
              {"\n\n"}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, nunc vel malesuada placerat, 
              neque velit tincidunt justo, vitae varius nulla lorem eget neque. Ut eget purus a justo gravida scelerisque. 
              Mauris malesuada, libero vel varius tincidunt, magna augue faucibus turpis, ut cursus velit felis in arcu. 
              Integer dictum nisl et magna porttitor, a interdum lorem interdum. Aenean vel orci eu velit tristique malesuada.
              {"\n\n"}
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
              Donec quis nibh sed libero volutpat eleifend. Morbi non mauris eget purus vulputate consequat. 
              Suspendisse potenti. Proin sit amet sem nec justo pharetra vehicula vel eu dolor.
            </Text>
          </ScrollView>
        </View>
        <Text style={styles.link} onPress={() => router.push('/(auth)/register')}>Voltar</Text>
      </View>
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
  textBox: {
    width: '100%', 
    height: '90%',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.31)',
    borderWidth: 2,
  },
  text: {
    color: '#000',
    fontSize: 14,
    textAlign: 'justify',
  },
  link: {
    color: '#00672e',
    marginTop: 10,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  }
});
