import { useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ARROW_BUTTON_WIDTH = 40;
const CAROUSEL_WIDTH = SCREEN_WIDTH - ARROW_BUTTON_WIDTH * 2 - 32;

// Convert HTTP to HTTPS
function toHttps(u?: string | null) {
  if (!u) return undefined as unknown as string;
  return u.replace(/^http:\/\//, 'https://');
}

// Image item props
type ImageItem = {
  id: string;
  image: {
    id: number;
    public_id: string;
    url: string;
  }
};

// Image carousel props
type ImageCarouselProps = {
  images: ImageItem[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onImagePress?: (image: ImageItem) => void;
};

export default function ImageCarousel({
  images,
  currentIndex,
  setCurrentIndex,
  onImagePress,
}: ImageCarouselProps) {
  const flatListRef = useRef<FlatList>(null);

  const safeImages = useMemo(
    () =>
      (images || []).map(img => ({
        ...img,
        image: {
          ...img.image,
          url: toHttps(img.image?.url),
        },
      })),
    [images]
  );

  useEffect(() => {
    if (safeImages.length > 0 && currentIndex < safeImages.length) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex,
        animated: false,
      });
    }
  }, [currentIndex, safeImages.length]);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < safeImages.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  }, [currentIndex, safeImages.length]);

  const renderItem = ({ item }: { item: ImageItem }) => (
    <TouchableOpacity onPress={() => onImagePress && onImagePress(item)}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image.url }}
          style={styles.image}
          resizeMode="center"
        />
      </View>
    </TouchableOpacity>
  );

  if (safeImages.length === 0) {
    return (
      <View style={styles.noImagesContainer}>
        <Text style={styles.noImagesText}>Nenhuma imagem disponível</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.carouselContainer}>
        <TouchableOpacity
          style={[styles.arrowButton, { width: ARROW_BUTTON_WIDTH }]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>

        <View style={[styles.flatListContainer, { width: CAROUSEL_WIDTH }]}>
          <FlatList
            ref={flatListRef}
            data={safeImages}
            horizontal
            pagingEnabled
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.arrowButton, { width: ARROW_BUTTON_WIDTH }]}
          onPress={handleNext}
          disabled={currentIndex === safeImages.length - 1}
        >
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.indexContainer}>
        <Text style={styles.indexText}>
          {currentIndex + 1}/{safeImages.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  arrowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  arrowText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  flatListContainer: {
    overflow: 'hidden',
  },
  imageContainer: {
    width: CAROUSEL_WIDTH,
    height: 200,
    overflow: 'hidden',
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: 'lightgreen',
  },
  image: {
    width: CAROUSEL_WIDTH,
    height: 200,
  },
  indexContainer: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
  },
  indexText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noImagesContainer: {
    width: CAROUSEL_WIDTH,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor: 'lightgray',
    marginTop: 10,
    alignSelf: 'center',
  },
  noImagesText: {
    fontSize: 16,
    color: 'gray',
    fontWeight: 'bold',
  },
});
