import axios from 'axios';
import Toast from 'react-native-toast-message';

export const baseURL = 'https://api.natour.com.br/';

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${baseURL}users/login/`, {
            email,
            password,
        });
        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.error || 'Ocorreu um erro. Tente novamente.';
        Toast.show({
            type: 'error',
            text1: apiError,
        });
        throw error;
    }
}