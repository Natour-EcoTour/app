import { Modal, View, Text, Image, StyleSheet, Button, Dimensions } from 'react-native';
import { PropsWithChildren } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const imageMap: Record<string, any> = {
  icon: require('../../../assets/images/icon.png'),
  check: require('../../../assets/images/icon.png'),
  warning: require('../../../assets/images/icon.png'),
};

type Props = PropsWithChildren<{
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  imagePath?: string;
  title?: string;
}>;

export default function CustomConfirmationModal({
  isVisible,
  onCancel,
  onConfirm,
  imagePath = 'warning',
  title = 'Tem certeza?',
}: Props) {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Image source={imageMap[imagePath]} style={{ width: 150, height: 150 }} />
          </View>
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button title="Cancelar" onPress={onCancel} color="#888" />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Confirmar" onPress={onConfirm} color="#fc0303" />
            </View>
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
    backgroundColor: '#fff',
    width: '80%',
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
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});
