import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';

export default function AddressInput() {
    const [isChecked, setIsChecked] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handlePress = () => {
        setIsChecked(!isChecked);
    };

    const handleCoordinateChange = (text: string, setter: (val: string) => void) => {
        // Allow only numbers, dots, minus sign
        const cleaned = text.replace(/[^0-9\.\-]/g, '');
        setter(cleaned);
    };

    return (
        <View style={styles.container}>
            <Checkbox.Item
                label="Cadastrar por coordenadas?"
                status={isChecked ? 'checked' : 'unchecked'}
                onPress={handlePress}
                color="#00672e"
                labelStyle={{ fontSize: 16 }}
            />

            {isChecked && (
                <View>
                    <TextInput
                        label="Latitude"
                        mode="outlined"
                        style={styles.input}
                        value={latitude}
                        onChangeText={(text) => handleCoordinateChange(text, setLatitude)}
                        keyboardType="numbers-and-punctuation"
                    />
                    <TextInput
                        label="Longitude"
                        mode="outlined"
                        style={styles.input}
                        value={longitude}
                        onChangeText={(text) => handleCoordinateChange(text, setLongitude)}
                        keyboardType="numbers-and-punctuation"
                    />
                </View>
            )}

            <TextInput label="CEP" mode="outlined" style={styles.input} />
            <TextInput label="Cidade" mode="outlined" style={styles.input} />
            <TextInput label="Bairro" mode="outlined" style={styles.input} />
            <TextInput label="UF" mode="outlined" style={styles.input} />
            <TextInput label="Complemento" mode="outlined" style={styles.input} />
            <TextInput label="Número" mode="outlined" style={styles.input} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: '100%',
    },
    input: {
        marginBottom: 10,
        width: '100%',
    },
});
