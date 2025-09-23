import { useState } from 'react';
import { TextInput, StyleSheet, View, Text, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
}

export default function PasswordInput({
  label = 'Senha',
  placeholder = 'Insira sua senha',
  value,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.fieldContainer}>
        <TextInput
          placeholderTextColor="#6B7280"
          placeholder={placeholder}
          keyboardType="default"
          autoCapitalize="none"
          secureTextEntry={!showPassword}
          autoComplete="password"
          textContentType="password"
          style={styles.input}
          value={value ?? ''}
          onChangeText={onChange}
        />

        <Pressable
          onPress={() => setShowPassword((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          style={styles.iconButton}
        >
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} />
        </Pressable>
      </View>
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
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0, 0, 0, 0.56)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
  iconButton: {
    paddingLeft: 8,
    paddingVertical: 8,
  },
});
