import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { PropsWithChildren } from 'react';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  imageUri?: string;
}>;

export default function ImageModal({ isVisible, imageUri, onClose }: Props) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
  };

  return (
    <View>
      <Modal animationType="fade" visible={isVisible} transparent={true}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.imageContainer}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  resizeMode="contain"
                  style={styles.image}
                />
              ) : (
                <Text style={styles.errorText}>Imagem não encontrada!</Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleClose}
                accessibilityLabel="Fechar modal"
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    height: '50%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    backgroundColor: '#0000003c',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ffffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#000000ff',
    borderWidth: 2,
  },
  buttonText: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
