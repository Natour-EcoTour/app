import apiClient from '@/services/apiClient';
import * as SecureStore from 'expo-secure-store';

export const deleteUser = async () => {
    try {
        const response = await apiClient.delete('users/me/delete/');

        // Limpar tokens do armazenamento após deleção bem-sucedida
        await SecureStore.deleteItemAsync('access');
        await SecureStore.deleteItemAsync('refresh');


        return response.data;
    } catch (error: any) {
        // Sempre limpar tokens em caso de erro (pode ser que o usuário foi deletado mas houve erro de conexão)
        try {
            await SecureStore.deleteItemAsync('access');
            await SecureStore.deleteItemAsync('refresh');
        } catch (storeError) {
            console.log('Error clearing tokens:', storeError);
        }

        // mark common cases for the UI
        error.isUnauthorized = error?.response?.status === 401;
        error.isNetworkError =
            error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error');

        throw error;
    }
}