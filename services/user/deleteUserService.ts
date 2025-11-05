import apiClient from '@/services/apiClient';
import * as SecureStore from 'expo-secure-store';

// Delete user service
export const deleteUser = async () => {
    try {
        const response = await apiClient.delete('users/me/delete/',
            {
                data: {}
            }
        );

        await SecureStore.deleteItemAsync('access');
        await SecureStore.deleteItemAsync('refresh');


        return response.data;
    } catch (error: any) {
        try {
            await SecureStore.deleteItemAsync('access');
            await SecureStore.deleteItemAsync('refresh');
        } catch (storeError) {
        }

        error.isUnauthorized = error?.response?.status === 401;
        error.isNetworkError =
            error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error');

        throw error;
    }
}