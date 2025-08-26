import axios from 'axios';
import Toast from 'react-native-toast-message';

export const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const verifyCodeAndRegister = async (email: string, code: string) => {
    try {
        const response = await axios.post(`${baseURL}code/verify/`, {
            email,
            code: code,
        });

        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.detail;
        Toast.show({
            type: 'error',
            text1: apiError,
            text1Style: {
                fontSize: 14,
                flexWrap: 'wrap',
                width: '100%',
            }
        });
        throw error;
    }
}