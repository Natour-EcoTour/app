import { StyleSheet, Text, View } from 'react-native';

interface TimeProps {
  startWeekday?: string;
  startTime?: string;
  endWeekday?: string;
  endTime?: string;
}

export default function TimeContainer({
  startWeekday,
  endWeekday,
  startTime,
  endTime,
}: TimeProps) {
  return (
    <View style={styles.container}>
      <Text>
        {startWeekday} - {endWeekday}
      </Text>
      <Text>
        {startTime?.slice(0, 5) || ''} - {endTime?.slice(0, 5) || ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    width: '50%',
    marginBottom: 10,
    alignItems: 'center',
  },
});
