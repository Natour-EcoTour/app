import apiClient from '@/services/apiClient';
import Toast from 'react-native-toast-message';

export const deletePhoto = async (photoId: number, publicId: string) => {
    try {
        const response = await apiClient.delete(`photos/delete/`, {
            data: {
                ids: [photoId],
                public_ids: [publicId]
            },
        });
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