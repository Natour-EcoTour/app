import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';

// Update user service
export const updateUser = async (username: string) => {
    try {
        const response = await apiClient.put('users/me/update/',
            {
                username
            }
        );
        return response.data;
    } catch (error: any) {
        const apiError = handleApiError(error);
        console.error('Update user error:', apiError);
        throw apiError;
    }
}