import { Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';

import EmailInput from './components/EmailInput';
import PasswordInput from './components/PasswordInput';
import LoginButton from './components/LoginButton';
import LogedInModal from './components/LogedInModal';

export default function Index() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContentContainer} 
      style={styles.scrollView}>
      <Image 
        source={require('../assets/images/icon.png')} 
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.title}>Login</Text>
      
      <EmailInput />
      <PasswordInput />
      <LoginButton onPress={() => setIsModalVisible(true)} />

      {isModalVisible && (
        <LogedInModal 
          isVisible={isModalVisible} 
          onClose={() => setIsModalVisible(false)} 
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#04d361',
    padding: 15,
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  text: {
    color: '#fff',
  },
});