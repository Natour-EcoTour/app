import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { PropsWithChildren } from 'react';
import { useRouter, type RelativePathString } from 'expo-router';
import { images } from '@/src/utils/assets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const imageMap: Record<string, any> = {
  icon: images.icon,
  check: images.icon,
  warning: images.icon,
};

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  imagePath?: string;
  title?: string;
  route: RelativePathString;
}>;

export default function CustomModal({
  isVisible,
  onClose,
  imagePath = 'icon',
  title,
  route,
}: Props) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push(route);
  };

  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Image
                source={imageMap[imagePath]}
                style={{ width: 200, height: 200 }}
              />
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
  cancelButton: {
    backgroundColor: '#464C55',
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
