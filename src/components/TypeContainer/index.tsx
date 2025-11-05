import { StyleSheet, Text, View } from 'react-native';

// Type props
interface TypeProps {
  type: string;
}

// Get translated type
const getTranslatedType = (type: string): string => {
  const typeTranslations: { [key: string]: string } = {
    'trail': 'Trilha',
    'water_fall': 'Cachoeira',
    'park': 'Parque',
    'farm': 'Fazenda',
    'other': 'Outro',
    'house': 'Casa',
    'shop': 'Loja',
  };
  
  return typeTranslations[type] || type;
};

export default function TypeContainer({ type }: TypeProps) {
  const translatedType = getTranslatedType(type);
  
  return (
    <View style={styles.container}>
      <Text style={styles.type}>{translatedType}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'darkgreen',
    borderRadius: 10,
    borderWidth: 2,
    padding: 5,
    width: '35%',
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});
