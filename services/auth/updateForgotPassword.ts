import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling'

// Update forgot password service
export const updateForgotPassword = async (email: string, code: string, newPassword: string) => {
    try {
        const response = await apiClient.post('code/verify_password_reset/', {
            email,
            code,
            password: newPassword,
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
