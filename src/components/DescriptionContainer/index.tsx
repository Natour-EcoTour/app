import { StyleSheet, Text, View } from 'react-native';

// Description props
interface DescriptionProps {
  description: string;
}

export default function DescriptionContainer({
  description,
}: DescriptionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'darkgreen',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    backgroundColor: 'lightgray',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});
