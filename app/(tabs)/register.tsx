import { Text, View, StyleSheet, TextInput } from 'react-native';

export default function RegisterScreen() {
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

        <Text style={styles.label}>E-mail</Text>
        <TextInput 
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          style={styles.input}
        />

      <Text style={styles.label}>Senha</Text>
      <TextInput 
        placeholder="Digite a sua senha"
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        style={styles.input}
      />

      <Text style={styles.label}>Confirma a sua senha</Text>
      <TextInput 
        placeholder="Digite a sua senha"
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        style={styles.input}
      />

        
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
  },
  text: {
    color: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: 20
  },
  inputContainer: {
    marginBottom: 16,
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
  },
});