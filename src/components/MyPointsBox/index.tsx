import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import StarRating from '@/components/StarRating';
import { deletePoint } from '@/services/points/deletePointService';
import { ActivityIndicator } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MyPointsBoxProps {
  id: number;
  pointName: string;
  pointStatus: 'true' | 'false' | 'null' | 'none';
  starTime: string;
  closeTime: string;
  views: number;
  rating: number;
  screen: 'myPoints' | 'pendingPoints';
  onDeleteSuccess?: () => void;
}

export default function MyPointsBox({
  id,
  pointName,
  pointStatus,
  starTime,
  closeTime,
  views,
  rating,
  screen,
  onDeleteSuccess,
}: MyPointsBoxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deletePoint(id);
      setIsLoading(false);
      setModalVisible(false);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Error deleting point:', error);
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.box}>
      <View style={styles.teste}>
        <Text style={styles.title}>{pointName}</Text>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBall,
              {
                backgroundColor:
                  pointStatus === 'true'
                    ? 'green'
                    : pointStatus === 'false'
                      ? 'red'
                      : 'yellow',
              },
            ]}
          />
          <Text style={styles.statusText}>
            {pointStatus === 'true'
              ? 'Ativo'
              : pointStatus === 'false'
                ? 'Desativado'
                : 'Em análise'}
          </Text>
        </View>
      </View>

      <View style={styles.viewsText}>
        <Text>
          Horário de funcionamento: {starTime} - {closeTime}
        </Text>
        <Text>Visualizações: {views}</Text>
      </View>

      {pointStatus !== 'null' && (
        <>
          <StarRating rating={rating} />
        </>
      )}

      <View style={styles.rowActions}>
        <TouchableOpacity
          onPress={() => router.push(`/${screen}/details/${id}`)}
        >
          <Text style={styles.detailsText}>Ver detalhes</Text>
        </TouchableOpacity>

        {pointStatus !== 'null' && (
          <>
            <View style={styles.iconsContainer}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/myPoints/edit/[id]',
                    params: { id: String(id) },
                  })
                }
              >
                <Ionicons name={'pencil'} size={25} color={'blue'} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ marginLeft: 12 }}
              >
                <Ionicons name={'trash-bin'} size={25} color={'red'} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Ionicons name="trash-bin-sharp" size={60} color="red" />
            <Text style={styles.modalTitle}>Deseja apagar "{pointName}"?</Text>
            <Text style={styles.modalMessage}>
              Este ponto será removido do mapa e não poderá mais ser acessado —
              nem mesmo por você.
            </Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja continuar?
            </Text>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Apagar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    elevation: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  statusBall: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  teste: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    color: '#00672e',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  viewsText: {
    marginBottom: 10,
    padding: 10,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#464C55',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
