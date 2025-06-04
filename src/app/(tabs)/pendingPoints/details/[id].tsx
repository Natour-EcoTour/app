import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function PointDetail() {
    const { id } = useLocalSearchParams();

    const points = [
        {
            id: 1,
            pointName: 'Parque zdos Flamingos',
            pointStatus: false,
            starTime: '09:00',
            closeTime: '18:00',
            views: 350,
            review: 5,
        },
        {
            id: 2,
            pointName: 'Parque dos Fabianos',
            pointStatus: true,
            starTime: '10:00',
            closeTime: '11:00',
            views: 0,
            review: 0,
        },
        {
            id: 3,
            pointName: 'Lagoa do Coração',
            pointStatus: true,
            starTime: '07:30',
            closeTime: '17:45',
            views: 120,
            review: 4,
        },
    ];

    // Converta o id para número, pois vem como string
    const point = points.find(p => p.id === Number(id));

    if (!point) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Ponto não encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.analiseWrapper}>
                <TouchableOpacity style={styles.analiseContainer}>
                    <Ionicons name={'arrow-back'} size={20} color={'darkgreen'} />
                    <Text style={styles.analise} onPress={() => router.back()}>Voltar</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>{point.pointName}</Text>
            <Text style={styles.text}>
                Status: {point.pointStatus ? 'Ativo' : 'Desativado'}
            </Text>
            <Text style={styles.text}>
                Horário: {point.starTime} - {point.closeTime}
            </Text>
            <Text style={styles.text}>Visualizações: {point.views}</Text>
            <Text style={styles.text}>Avaliação: {point.review} ⭐</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        color: '#00672e',
        fontSize: 22,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    analiseWrapper: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    analiseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'right'
    },
    analise: {
        fontSize: 20,
        color: '#00672e',
        fontWeight: 'bold',
    },
});
