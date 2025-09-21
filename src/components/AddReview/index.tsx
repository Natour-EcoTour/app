import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  Platform,
  StatusBar,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { addReview } from '@/services/points/addReviewService';

type AddReviewProps = { pointId: number };

export default function AddReview({ pointId }: AddReviewProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const topOffset =
    Platform.OS === 'ios' ? 70 : (StatusBar.currentHeight ?? 0) + 12;

  const selectRating = (value: number) => setRating(value);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', text1: string, text2?: string) => {
    Toast.show({ type, position: 'top', topOffset, text1, text2 });
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      showToast('warning', 'Atenção', 'Selecione uma nota antes de enviar.');
      return;
    }
    try {
      setSubmitting(true);
      await addReview(pointId, rating);
      showToast('success', 'Avaliação enviada com sucesso!', 'Obrigado por sua contribuição.');
      setIsModalVisible(false);
      setRating(0);
    } catch (e: any) {
      const status = e?.response?.status;
      const detail = e?.response?.data?.detail;

      if (status === 400 && typeof detail === 'string' && /já avaliou/i.test(detail)) {
        showToast('error', 'Atenção', 'Você já avaliou este ponto.');
      } else {
        showToast('error', 'Erro', 'Não foi possível enviar a avaliação.');
      }
    } finally {
      setSubmitting(false);
    }
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
        transparent
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        statusBarTranslucent
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Aqui você pode deixar sua avaliação</Text>

            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map(value => (
                <TouchableOpacity
                  key={value}
                  onPress={() => selectRating(value)}
                  disabled={submitting}
                >
                  <FontAwesome6
                    name="star"
                    size={30}
                    color={value <= rating ? 'green' : 'lightgray'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                style={[styles.button, (rating === 0 || submitting) && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={rating === 0 || submitting}
              >
                <Text style={styles.buttonText}>
                  {submitting ? 'Enviando...' : 'Enviar Avaliação'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.buttonOutline}
                onPress={() => setIsModalVisible(false)}
                disabled={submitting}
              >
                <Text style={styles.buttonOutlineText}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Toast position="top" topOffset={topOffset} />
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
    gap: 5
  },
  text: {
    textDecorationLine: 'underline',
    color: 'darkgreen',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%'
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center'
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  actionsRow:
  {
    flexDirection: 'row',
    gap: 12
  },
  button: {
    backgroundColor: 'darkgreen',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  buttonDisabled:
  {
    opacity: 0.6
  },
  buttonText:
  {
    color: 'white',
    fontWeight: 'bold'
  },
  buttonOutline:
  {
    borderWidth: 1,
    borderColor: 'darkgreen',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  buttonOutlineText:
  {
    color: 'darkgreen',
    fontWeight: 'bold'
  },
});
