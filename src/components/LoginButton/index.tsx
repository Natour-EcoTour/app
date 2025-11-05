import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

// Login button props
interface LoginButtonProps {
  onPress: () => void;
  text: string;
  isLoading?: boolean;
}

export default function RegisterButton({ onPress, text, isLoading }: LoginButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading &&
        <ActivityIndicator
          size="small"
          color="#ffffffff"
          style={{ marginRight: 8 }}
        />
      }
      <Text
        style={styles.buttonText}>
        {isLoading ? 'Carregando...' : text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#00672e',
    padding: 15,
    width: 350,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
