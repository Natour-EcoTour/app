import { StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number;
}

export default function StarRating({ rating }: StarRatingProps) {
  const clampedRating = Math.max(0, Math.min(5, rating));

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <FontAwesome6
          key={starNumber}
          name="star"
          size={24}
          color="green"
          solid={starNumber <= clampedRating}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
});
