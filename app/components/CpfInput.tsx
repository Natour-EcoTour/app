import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface CpfInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const formatCpf = (cpf: string) => {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length > 3) {
    cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
  }
  if (cpf.length > 6) {
    cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  }
  if (cpf.length > 9) {
    cpf = cpf.replace(/\.(\d{3})(\d)/, '.$1-$2');
  }
  return cpf;
};

const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se possui 11 dígitos ou se todos os dígitos são iguais
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let remainder: number;

  // Validação do primeiro dígito verificador
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(cpf.charAt(9)) !== digit1) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(cpf.charAt(10)) !== digit2) return false;

  return true;
};

const CpfInput: React.FC<CpfInputProps> = ({
  value = '',
  onChange,
  placeholder = 'Insira seu CPF',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [touched, setTouched] = useState(false);
  const validCpf = isValidCPF(inputValue);

  const handleChange = (text: string) => {
    const formatted = formatCpf(text);
    setInputValue(formatted);
    if (onChange) {
      onChange(formatted);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        value={inputValue}
        placeholder={placeholder}
        keyboardType="numeric"
        onChangeText={handleChange}
        onBlur={() => setTouched(true)}
        maxLength={14} // 11 dígitos + 3 caracteres de formatação (pontos e hífen)
      />
      {touched && !validCpf && (
        <Text style={styles.error}>CPF inválido</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    borderRadius: 4,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
});

export default CpfInput;
