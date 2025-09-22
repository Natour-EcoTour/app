import { TextInput, StyleSheet, View } from 'react-native';

interface PasswordFormProps {
  password: string;
  placeholder?: string;
  onChangePassword: (text: string) => void;
}

export default function PasswordForm({
  password,
  placeholder,
  onChangePassword,
}: PasswordFormProps) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="#6B7280"
        placeholder={placeholder}
        keyboardType="default"
        autoCapitalize="none"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={onChangePassword}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0, 0, 0, 0.56)',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
});
