import apiClient from '@/services/apiClient';
import Toast from 'react-native-toast-message';

export const getPhotoId = async (userId: number) => {
    try {
        const response = await apiClient.get(`photos/?user_id=${userId}`);
        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.error || error?.message;
        console.error('Error getting photo ID:', error);
        Toast.show({
            type: 'error',
            text1: 'Erro ao buscar foto',
            text2: apiError,
        });
        throw error;
    }
}