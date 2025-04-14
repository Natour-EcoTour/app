import { router, Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
        name="addPoint/index"
        options={{
          title: 'Cadastrar Ponto',
          headerShown: true,
          headerLeft: ({ tintColor }) => (
            <Ionicons
              name="arrow-back"
              size={24}
              color={tintColor}
              onPress={() => router.push('../(main)/settings')}
              style={{ marginLeft: 10 }}
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="myPoints/index"
        options={{
          title: 'Meus Pontos',
          headerShown: true,
          headerLeft: ({ tintColor }) => (
            <Ionicons
              name="arrow-back"
              size={24}
              color={tintColor}
              onPress={() => router.push('../(main)/settings')}
              style={{ marginLeft: 10 }}
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}