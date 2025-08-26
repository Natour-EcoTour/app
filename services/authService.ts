import axios from 'axios';
import Toast from 'react-native-toast-message';

export const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const loginUser = async (email: string, password: string, rememberMe: boolean) => {
    try {
        const response = await axios.post(`${baseURL}users/login/`, {
            email,
            password,
            rememberMe,
        });
        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.error;
        // const apiError = error?.response?.data?.error || 'Ocorreu um erro. Tente novamente.';
        Toast.show({
            type: 'error',
            text1: apiError,
        });
        throw error;
    }
}