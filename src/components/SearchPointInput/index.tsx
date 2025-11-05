import { TextInput, StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { searchPoints } from '@/services/points/searchPoint';
import { useState, useEffect, useRef } from 'react';

// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Search result props
interface SearchResult {
  id: number;
  name: string;
}

// Search point input props
interface SearchPointInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelectResult?: (resultId: number, resultName: string) => void;
}

export default function SearchPointInput({
  placeholder = 'Digite o nome do ponto...',
  value,
  onChangeText,
  onSelectResult,
}: SearchPointInputProps) {
  // Use states
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  // Use refs
  const debounceTimeoutRef = useRef<number | null>(null);

  const performSearch = async (searchTerm: string) => {
    if (searchTerm.trim().length >= 2) {
      try {
        const results = await searchPoints({ name: searchTerm });
        setSearchResults(results || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleTextChange = (text: string) => {
    onChangeText(text);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(text);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder={placeholder}
        keyboardType="default"
        style={styles.input}
        value={value}
        onChangeText={handleTextChange}
        placeholderTextColor="rgba(56, 56, 56, 0.56)"
      />
      {searchResults.length > 0 && (
        <View style={styles.searchContainer}>
          {searchResults.map((result) => (
            <TouchableOpacity
              key={result.id}
              style={styles.searchResultItem}
              onPress={() => {
                if (onSelectResult) {
                  onSelectResult(result.id, result.name);
                } else {
                  onChangeText(result.name);
                }
                setSearchResults([]);
              }}
            >
              <Text style={styles.searchResult}>{result.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    borderColor: 'rgba(0, 0, 0, 0.31)',
    borderWidth: 2,
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 16,
    borderRadius: 15,
    width: SCREEN_WIDTH - 50,
    alignSelf: 'center',
  },
  searchContainer: {
    backgroundColor: 'white',
    maxHeight: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  searchResult: {
    color: 'black',
    fontSize: 16,
  }
});
