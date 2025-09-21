import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

export default function AddReview() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rating, setRating] = useState(0);

  const handleRating = (value: number) => {
    setRating(value);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={styles.text}>Deseja avaliar esse ponto?</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Aqui você pode deixar sua avaliação
            </Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map(value => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleRating(value)}
                >
                  <FontAwesome6
                    name="star"
                    size={30}
                    color={value <= rating ? 'green' : 'lightgray'}
                    solid={value <= rating}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.container}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Enviar Avaliação</Text>
              </Pressable>

              <Pressable
                style={styles.button}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  text: {
    textDecorationLine: 'underline',
    color: 'darkgreen',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'darkgreen',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
