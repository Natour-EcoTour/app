import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { images } from '@/src/utils/assets';
import { getTerms } from '@/services/terms/termsService';

export default function UserTerms() {
  const [terms, setTerms] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        setError(null);
        const termsData = await getTerms(1);
        setTerms(termsData.content || '');
      } catch (err) {
        setError('Erro ao carregar os termos de uso');
        console.error('Error fetching terms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    <ImageBackground
      source={images.background}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Termos de Uso</Text>

        <View style={styles.textBox}>
          <ScrollView showsVerticalScrollIndicator={true}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00672e" />
                <Text style={styles.loadingText}>Carregando termos...</Text>
              </View>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.text}>
                {terms || 'Termos de uso não disponíveis no momento.'}
              </Text>
            )}
          </ScrollView>
        </View>
        <Text style={styles.link} onPress={() => router.back()}>
          Voltar
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '90%',
    height: '80%',
    alignItems: 'center',
  },
  title: {
    color: '#00672e',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  textBox: {
    width: '100%',
    height: '90%',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.31)',
    borderWidth: 2,
  },
  text: {
    color: '#000',
    fontSize: 14,
    textAlign: 'justify',
  },
  link: {
    color: '#00672e',
    marginTop: 10,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#00672e',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
