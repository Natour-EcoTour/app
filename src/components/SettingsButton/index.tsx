import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { useRouter, type RelativePathString } from 'expo-router';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface LoginButtonProps {
  text: string;
  icon_type: IoniconName;
  route?: RelativePathString;
  onPress?: () => void | Promise<void>;
}

export default function SettingsButton({
  text,
  icon_type,
  route,
  onPress,
}: LoginButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (route) {
      router.push(route);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Ionicons
        name={icon_type} size={24}
        color="white"
        style={styles.icon}
      />

      <Text
        style={styles.buttonText}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00672e',
    padding: 15,
    width: 350,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  icon: {
    position: 'absolute',
    left: 20,
    top: 15,
    color: '#fff',
  },
});
