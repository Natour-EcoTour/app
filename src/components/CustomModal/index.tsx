import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { useRouter, type RelativePathString } from 'expo-router';

// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Custom modal props
interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  route?: RelativePathString;
  imageSource?: ImageSourcePropType;
  imageUri?: string;
}

export default function CustomModal({
  isVisible,
  onClose,
  title,
  route,
  imageSource,
  imageUri,
}: CustomModalProps) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    if (route) {
      router.push(route);
    }
  };

  const source =
    imageSource ?? (imageUri ? { uri: imageUri } : undefined);

  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Image source={source} style={{ width: 150, height: 150 }} />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.cancelButton}
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
    backgroundColor: '#ffffffff',
    width: '80%',
    height: '45%',
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
    color: '#000000ff',
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
  cancelButton: {
    backgroundColor: '#4c5546ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
