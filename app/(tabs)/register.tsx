import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CpfInput from '../components/CpfInput';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import ConfirmPasswordPassword from '../components/ConfirmPasswordInput';

export default function RegisterScreen() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          placeholder='Digite seu nome'
          keyboardType='default'
          autoCapitalize='words'
          autoComplete='name'
          style={styles.input}
        />

        <EmailInput value={email} onChange={setEmail} />

        <CpfInput value={cpf} onChange={setCpf} />

        <PasswordInput value={password} onChange={setPassword}/>

        <ConfirmPasswordPassword
          password={password}
          confirmPassword={confirmPassword}
          onChange={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={() => console.log('Cadastrado!')}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    borderRadius: 4,
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
  }
});
