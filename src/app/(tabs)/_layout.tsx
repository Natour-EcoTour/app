import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTitleStyle: {
          color: 'darkgreen',
        },
        tabBarInactiveTintColor: 'green',
        tabBarActiveTintColor: 'darkgreen',
        headerStyle: {
          backgroundColor: 'white',
        },
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="addPoint/index"
        options={{
          title: 'Cadastrar Ponto',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="myPoints"
        options={{
          title: 'Meus Pontos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'pin' : 'pin-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pendingPoints"
        options={{
          title: 'Pontos Pendentes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'time' : 'time-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
