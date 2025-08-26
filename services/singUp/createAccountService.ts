import axios from "axios";
import Toast from "react-native-toast-message";

export const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const createAccount = async (username: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${baseURL}users/create/`, {
            username,
            email,
            password
        });
        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.error;
        console.error('Create account error:', error);
        Toast.show({
            type: "error",
            text1: apiError,
        });
        throw error;
    }
}