import { Ionicons } from '@expo/vector-icons';
import { Dispatch, SetStateAction, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_IMAGES = 10;

interface AddPointMidiaProps {
  selectedImages: string[];
  setSelectedImages: Dispatch<SetStateAction<string[]>>;
}

export default function AddPointMidia({
  selectedImages,
  setSelectedImages,
}: AddPointMidiaProps) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isImageModalVisible, setIsImageModalVisible] =
    useState<boolean>(false);
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);

  const pickImageAsync = async () => {
    if (selectedImages.length >= MAX_IMAGES) {
      Toast.show({
        type: 'info',
        text1: 'Limite de fotos atingido',
        text2: `Você já selecionou o máximo de fotos permitidas (${MAX_IMAGES}).`,
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newUris = result.assets.map(asset => asset.uri);
      const remainingSlots = MAX_IMAGES - selectedImages.length;
      const filteredUris = newUris.slice(0, remainingSlots);
      setSelectedImages(prev => [...prev, ...filteredUris]);
    }
  };

  const handleClose = () => setIsModalVisible(false);

  return (
    <View style={{ width: '100%' }}>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View style={styles.infoContainer}>
          <Ionicons
            name="information-circle-sharp"
            size={20}
            color="darkgreen"
          />
          <Text style={styles.infoText}>Informações sobre as fotos</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImageAsync}>
        <View style={styles.imageContainer}>
          <Ionicons name="camera" size={50} color="darkgreen" />
          <Text>Adicionar fotos ao ponto</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.counterText}>
        {selectedImages.length} / {MAX_IMAGES} imagens selecionadas
      </Text>

      {selectedImages.length > 0 ? (
        <View style={styles.gridContainer}>
          {selectedImages.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <TouchableOpacity
                onPress={() => {
                  setIsImageModalVisible(true);
                  setPreviewImageUri(uri);
                }}
              >
                <Image source={{ uri }} style={styles.image} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() =>
                  setSelectedImages(prev => prev.filter((_, i) => i !== index))
                }
              >
                <Ionicons name="trash" size={25} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noImageText}>Nenhuma imagem selecionada</Text>
      )}

      {isModalVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={handleClose}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContent}>
              <View style={styles.titleContainer}>
                <Ionicons
                  name="images"
                  size={28}
                  color="#464C55"
                  style={{ marginBottom: 5 }}
                />
                <Text style={styles.title}>Regras para as fotos</Text>
              </View>
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.info}>
                  - Você pode selecionar até 10 fotos.
                </Text>
                <Text style={styles.info}>
                  - Imagens nos formatos JPG ou PNG são aceitas.
                </Text>
                <Text style={styles.info}>
                  - As fotos devem ser tiradas no local do ponto.
                </Text>
                <Text style={styles.info}>
                  - Evite fotos borradas, com baixa iluminação ou irrelevantes.
                </Text>
                <Text style={styles.info}>
                  - Fotos inadequadas podem causar a reprovação do cadastro.
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {isImageModalVisible && previewImageUri && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isImageModalVisible}
          onRequestClose={() => {
            setIsImageModalVisible(false);
            setPreviewImageUri(null);
          }}
        >
          <View style={styles.overlay}>
            <View
              style={[styles.modalContent, { width: '95%', height: '70%' }]}
            >
              <Image
                source={{ uri: previewImageUri }}
                resizeMode="contain"
                style={{ width: '100%', height: '100%', borderRadius: 10 }}
              />
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  { position: 'absolute', bottom: 20 },
                ]}
                onPress={() => {
                  setIsImageModalVisible(false);
                  setPreviewImageUri(null);
                }}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    textDecorationLine: 'underline',
    marginLeft: 5,
    color: 'darkgreen',
    fontSize: 14,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    borderStyle: 'dashed',
    padding: 15,
    backgroundColor: 'rgba(30, 255, 0, 0.08)',
    width: '100%',
  },
  counterText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  imageWrapper: {
    width: (SCREEN_WIDTH - 40) / 3,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.7)',
    borderStyle: 'dashed',
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  noImageText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
    marginVertical: 10,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    maxHeight: '70%',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#464C55',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  info: {
    color: '#333',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#464C55',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
