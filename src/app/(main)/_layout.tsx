import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveBackgroundColor: 'rgba(38, 255, 0, 0.13)',
          tabBarInactiveTintColor: 'green',
          tabBarActiveTintColor: 'darkgreen',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerShadowVisible: true,
          headerTintColor: 'darkgreen',
          tabBarStyle: {
          backgroundColor: 'white',
          },
          
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
            <Ionicons name={focused ? 'map' : 'map-outline'} color={color} size={24}/>
          ),
        }}
      />

      <Tabs.Screen
        name="settings/index"
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