import { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';

interface DescriptionInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  editable: boolean;
  onChange: (text: string) => void;
}

export default function DescriptionInput({
  label,
  placeholder = 'Insira a descrição',
  value,
  editable,
  onChange,
}: DescriptionInputProps) {
  const [inputHeight, setInputHeight] = useState(40);

  const handleContentSizeChange = (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    setInputHeight(e.nativeEvent.contentSize.height);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        editable={editable}
        placeholder={placeholder}
        keyboardType="default"
        autoCapitalize="none"
        autoComplete="off"
        style={[styles.input, { height: Math.max(40, inputHeight) }]}
        value={value}
        onChangeText={onChange}
        multiline
        onContentSizeChange={handleContentSizeChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  label: {
    color: '#000',
    alignContent: 'flex-start',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0, 0, 0, 0.56)',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    borderRadius: 10,
    textAlignVertical: 'top',
  },
});
