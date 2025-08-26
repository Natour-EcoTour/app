import axios from "axios";
import Toast from "react-native-toast-message";

export const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const sendVerificationCode = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${baseURL}code/send/`, {
            username: name,
            email,
            password,
        });

        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.detail;
        console.log('API Error:', apiError);
        Toast.show({
            type: 'error',
            text1: 'Erro ao enviar código de verificação',
            text1Style: {
                fontSize: 14,
                flexWrap: 'wrap',
                width: '100%'
            },
            text2: apiError
        });
        throw error;
    }
}
