import React, { useState } from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function TimeInput() {
    const [selectedDayStart, setSelectedDayStart] = useState('Segunda-feira');
    const [selectedDayEnd, setSelectedDayEnd] = useState('Segunda-feira');
    const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [startTimeSelected, setStartTimeSelected] = useState(false);
    const [endTimeSelected, setEndTimeSelected] = useState(false);

    const onStartTimeChange = (event: any, date?: Date) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (date) {
            setStartTime(date);
            setStartTimeSelected(true);
        }
    };

    const onEndTimeChange = (event: any, date?: Date) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (date) {
            setEndTime(date);
            setEndTimeSelected(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.weekdayPicker}>

                {/* horario 1 */}
                <View style={styles.dayPickerContainer}>
                    <Text>De:</Text>
                    <Picker
                        selectedValue={selectedDayStart}
                        onValueChange={(itemValue) => setSelectedDayStart(itemValue)}
                    >
                        {days.map((day) => (
                            <Picker.Item label={day} value={day} key={day} />
                        ))}
                    </Picker>
                </View>

                {/* horario 2 */}
                <View style={styles.dayPickerContainer}>
                    <Text>Até:</Text>
                    <Picker
                        selectedValue={selectedDayEnd}
                        onValueChange={(itemValue) => setSelectedDayEnd(itemValue)}
                    >
                        {days.map((day) => (
                            <Picker.Item label={day} value={day} key={day} />
                        ))}
                    </Picker>
                </View>
            </View>
            
            {/* Abre  */}
            <Text>Abre às:</Text>
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowStartPicker(true)}>
                <Text style={styles.buttonText}>
                    {startTimeSelected ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Selecione um horário'}
                </Text>
            </TouchableOpacity>
            {showStartPicker && (
                <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={onStartTimeChange}
                />
            )}

            {/* Fecha */}
            <Text>Fecha às:</Text>
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowEndPicker(true)}>
                <Text style={styles.buttonText}>
                    {endTimeSelected ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Selecione um horário'}
                </Text>
            </TouchableOpacity>
            {showEndPicker && (
                <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={onEndTimeChange}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        width: '100%',
    },
    weekdayPicker: {
        flexDirection: 'column',
        marginBottom: 20,
    },
    dayPickerContainer: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 5,
        backgroundColor: '#f8f8f8',
    },
    timeButton: {
        backgroundColor: '#00672e',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    }
});
