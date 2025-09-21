import { TextInput, StyleSheet, View, Text } from 'react-native';

interface EmailInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  editable: boolean;
  onChange: (text: string) => void;
}

export default function EmailInput({
  label = 'E-mail',
  placeholder = 'Insira seu e-mail',
  value,
  editable,
  onChange,
}: EmailInputProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        editable={editable}
        placeholder={placeholder}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={styles.input}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  label: {
    color: '#000',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0, 0, 0, 0.56)',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    borderRadius: 10,
  },
});
