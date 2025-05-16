import React from 'react';
import { View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AddPointLayout() {
    const router = useRouter();

    return (
        <Stack
            screenOptions={{
                headerTintColor: 'darkgreen',
                headerStyle: { backgroundColor: 'white' },

                headerLeft: () => (
                    <View style={{ paddingLeft: 10 }}>
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="darkgreen"
                            onPress={() => router.back()}
                        />
                    </View>
                ),
            }}
        >
            <Stack.Screen
                name="index"
                options={{ title: 'Cadastrar Ponto', headerShown: true }}
            />
        </Stack>
    );
}
