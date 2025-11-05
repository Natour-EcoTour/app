import axios from 'axios';
import Toast from 'react-native-toast-message';

// Base URL from environment
export const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Send forgot password code service
export const sendForgotPasswordCode = async (email: string) => {
    try {
        const response = await axios.post(`${baseURL}code/reset_password/`, {
            email,
        });
        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.error;
        Toast.show({
            type: 'error',
            text1: apiError,
        });
        throw error;
    }
}
