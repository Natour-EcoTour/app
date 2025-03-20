import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#00FF00',
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerShadowVisible: false,
          headerTintColor: '#fff',
          tabBarStyle: {
          backgroundColor: '#25292e',
          },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Pontos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} color={color} size={24}/>
          ),
        }}
      />

      <Tabs.Screen
        name="register"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'options' : 'options-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
