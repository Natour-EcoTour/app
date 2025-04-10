import { Modal, View, Text, Image, StyleSheet, Button, Dimensions } from 'react-native';
import { PropsWithChildren } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
      <Modal
        animationType="fade"
        visible={isVisible}
        transparent={true}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.buttonContainer}>
              <Button
                title="Fechar"
                onPress={handleClose}
                color="#464C55"
                accessibilityLabel="Fechar modal"
              />
            </View>

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
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
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