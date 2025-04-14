import { Modal, View, Text, Image, StyleSheet, Button, Dimensions } from 'react-native';
import { PropsWithChildren } from 'react';
import { useRouter, type RelativePathString } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const imageMap: Record<string, any> = {
  icon: require('../../../assets/images/icon.png'),
  check: require('../../../assets/images/icon.png'),
  warning: require('../../../assets/images/icon.png'),
};

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  imagePath?: string;
  title?: string;
  route: RelativePathString;
}>;

export default function CustomModal({ isVisible, onClose, imagePath = 'icon', title, route }: Props) {
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
              <Image source={imageMap[imagePath]} style={{ width: 200, height: 200 }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Fechar" onPress={handleClose} color="#464C55" />
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
});
