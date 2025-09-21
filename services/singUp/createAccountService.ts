import axios from "axios";
import { handleApiError } from '@/src/utils/errorHandling';

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
        const apiError = handleApiError(error);
        console.error('Create account error:', apiError);
        throw apiError;
    }
}