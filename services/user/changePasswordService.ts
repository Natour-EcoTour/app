import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';

// Change user password service
export const changeUserPassword = async (old_password: string,
    new_password: string,
    confirm_password: string) => {
    try {
        const response = await apiClient.put('users/me/update/password/', {
            old_password,
            new_password,
            confirm_password
        });
        return response.data;
    } catch (error) {
        const apiError = handleApiError(error);
        throw apiError;
    }
}