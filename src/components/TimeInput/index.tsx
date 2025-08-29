import { useState } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const days = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

export default function TimeInput({
  value,
  onChange,
  errors = {},
}: {
  value: {
    weekStart: string;
    weekEnd: string;
    timeStart: string;
    timeEnd: string;
  };
  onChange: (val: any) => void;
  errors?: {
    weekStart?: string;
    weekEnd?: string;
    timeStart?: string;
    timeEnd?: string;
  };
}) {
  const createDateFromTimeString = (timeString: string): Date => {
    if (!timeString) return new Date();

    if (timeString.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    }

    return new Date(timeString);
  };

  const [selectedDayStart, setSelectedDayStart] = useState(
    value.weekStart || 'Segunda-feira'
  );
  const [selectedDayEnd, setSelectedDayEnd] = useState(
    value.weekEnd || 'Segunda-feira'
  );
  const [startTime, setStartTime] = useState(
    value.timeStart ? createDateFromTimeString(value.timeStart) : new Date()
  );
  const [endTime, setEndTime] = useState(
    value.timeEnd ? createDateFromTimeString(value.timeEnd) : new Date()
  );

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startTimeSelected, setStartTimeSelected] = useState(!!value.timeStart);
  const [endTimeSelected, setEndTimeSelected] = useState(!!value.timeEnd);

  const updateParent = (changes: Partial<typeof value>) => {
    onChange({ ...value, ...changes });
  };

  const onStartTimeChange = (event: any, date?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (date) {
      setStartTime(date);
      setStartTimeSelected(true);
      // Format time as HH:MM for the API
      const timeString = date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      updateParent({ timeStart: timeString });
    }
  };

  const onEndTimeChange = (event: any, date?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (date) {
      setEndTime(date);
      setEndTimeSelected(true);
      // Format time as HH:MM for the API
      const timeString = date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      updateParent({ timeEnd: timeString });
    }
  };

  const handleWeekStartChange = (val: string) => {
    setSelectedDayStart(val);
    updateParent({ weekStart: val });
  };

  const handleWeekEndChange = (val: string) => {
    setSelectedDayEnd(val);
    updateParent({ weekEnd: val });
  };

  return (
    <View style={styles.container}>
      <View style={styles.weekdayPicker}>
        {/* Week start */}
        <View style={styles.dayPickerContainer}>
          <Text>De:</Text>
          <Picker
            selectedValue={selectedDayStart}
            onValueChange={handleWeekStartChange}
          >
            {days.map(day => (
              <Picker.Item label={day} value={day} key={day} />
            ))}
          </Picker>
          {errors.weekStart && (
            <Text style={styles.error}>{errors.weekStart}</Text>
          )}
        </View>

        {/* Week end */}
        <View style={styles.dayPickerContainer}>
          <Text>Até:</Text>
          <Picker
            selectedValue={selectedDayEnd}
            onValueChange={handleWeekEndChange}
          >
            {days.map(day => (
              <Picker.Item label={day} value={day} key={day} />
            ))}
          </Picker>
          {errors.weekEnd && <Text style={styles.error}>{errors.weekEnd}</Text>}
        </View>
      </View>

      {/* Time start */}
      <Text>Abre às:</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowStartPicker(true)}
      >
        <Text style={styles.buttonText}>
          {startTimeSelected
            ? startTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            : 'Selecione um horário'}
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
      {errors.timeStart && <Text style={styles.error}>{errors.timeStart}</Text>}

      {/* Time end */}
      <Text>Fecha às:</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowEndPicker(true)}
      >
        <Text style={styles.buttonText}>
          {endTimeSelected
            ? endTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            : 'Selecione um horário'}
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
      {errors.timeEnd && <Text style={styles.error}>{errors.timeEnd}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    marginTop: -5,
  },
});
