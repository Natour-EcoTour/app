import { loginUser } from '@/services/auth/authService';
import { Router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import apiClient from '@/services/apiClient';

export const login = async (data: { email: string; password: string; rememberMe: boolean }) => {
    try {
        const { access, refresh } = await loginUser(data.email, data.password, data.rememberMe);

        await SecureStore.setItemAsync('access', access);
        await SecureStore.setItemAsync('refresh', refresh);

        return { access, refresh };
    } catch (error) {
        console.error('Error during login:', error);
    }
};

export const logout = async (router: Router) => {
    try {
        await SecureStore.deleteItemAsync('access');
        await SecureStore.deleteItemAsync('refresh');

        router.replace('/');
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

export const validateTokenAndRedirect = async (router: Router): Promise<boolean> => {
    try {
        const accessToken = await SecureStore.getItemAsync('access');

        if (!accessToken) {
            return false;
        }

        const response = await apiClient.get('users/me/');

        if (response.status === 200) {
            router.replace('/(main)/map');
            return true;
        }

        return false;
    } catch (error) {
        console.error('Token validation failed:', error);

        try {
            await SecureStore.deleteItemAsync('access');
            await SecureStore.deleteItemAsync('refresh');
        } catch (clearError) {
            console.error('Error clearing invalid tokens:', clearError);
        }

        return false;
    }
};