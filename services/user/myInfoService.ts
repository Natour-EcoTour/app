import Toast from 'react-native-toast-message';
import apiClient from '@/services/apiClient';

// Get my info service
export const myInfo = async () => {
    try {
        const response = await apiClient.get('users/me/');
        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.error || error?.message;
        Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: apiError,
        });
        throw error;
    }
}
