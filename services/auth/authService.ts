import axios from 'axios';
import Toast from 'react-native-toast-message';

export const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const loginUser = async (email: string, password: string, remember_me: boolean) => {
    try {
        const response = await axios.post(`${baseURL}users/login/`, {
            email,
            password,
            remember_me,
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
