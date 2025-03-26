import { Modal, View, Text, Image, StyleSheet, Button } from 'react-native';
import { PropsWithChildren } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';


type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function LogedInModal({ isVisible, children, onClose }: Props) {
    const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push('/(main)/map');
  };

  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Login feito com sucesso!</Text>
          </View>
          <View style={styles.iconContainer}>
            <Image source={require('../../assets/images/icon.png')} style={{ width: 200, height: 200 }} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Fechar" onPress={handleClose} color="#464C55" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    height: '50%',
    position: 'absolute',
    top: '25%',
    left: '10%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    color: '#464C55',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});