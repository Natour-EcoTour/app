import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (

    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: 'green',
        tabBarActiveTintColor: 'darkgreen',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          height: 60 + insets.bottom, // height + safe area!
          paddingBottom: insets.bottom, // safe area!
        }
      }}
    >
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="map/index"
        options={{
          title: 'Pontos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'options' : 'options-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}