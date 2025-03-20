import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CpfInput from '../components/CpfInput';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import ConfirmPasswordPassword from '../components/ConfirmPasswordInput';
import FullnameInput from '../components/NameInput';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContentContainer}
      style={styles.scrollView}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        <View style={styles.inputContainer}>
          <FullnameInput value={fullName} onChange={setFullName} />
          <EmailInput value={email} onChange={setEmail} />
          <CpfInput value={cpf} onChange={setCpf} />
          <PasswordInput value={password} onChange={setPassword} />
          <ConfirmPasswordPassword
            password={password}
            confirmPassword={confirmPassword}
            onChange={setConfirmPassword}
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => console.log('Cadastrado!')}
          >
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});
