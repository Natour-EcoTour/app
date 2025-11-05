import { useState } from 'react';
import {
  Modal, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Image data props
interface ImageData { id?: number; public_id?: string; url: string }
interface ImageItem { id: string; image: string | ImageData }

// Image modal props
interface Props {
  isVisible: boolean;
  onClose: () => void;
  imageItem?: ImageItem | null;
}

export default function ImageModal({ isVisible, onClose, imageItem }: Props) {
  // Use states
  const [failed, setFailed] = useState(false);

  const raw =
    typeof imageItem?.image === 'string'
      ? imageItem?.image
      : imageItem?.image?.url;

  const url = raw ? raw.replace(/^http:\/\//, 'https://') : null;
  const shouldShowImage = !!url && !failed;

  return (
    <Modal animationType="fade" visible={isVisible} transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.imageContainer}>
            {shouldShowImage ? (
              <Image
                source={{ uri: url! }}
                resizeMode="contain"
                style={styles.image}
                onError={() => setFailed(true)}
              />
            ) : (
              <Text style={styles.errorText}>Imagem não encontrada!</Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
  buttonContainer: { width: '100%', paddingHorizontal: 20, marginTop: 10, marginBottom: 10 },
  button: {
    backgroundColor: '#ffffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#000000ff',
    borderWidth: 2,
  },
  buttonText: { color: '#000000ff', fontSize: 16, fontWeight: '600' },
  imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: SCREEN_WIDTH * 0.8, height: '100%' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});
