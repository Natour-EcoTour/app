import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export const apiClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
    timeout: 10000,
});


apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync('access');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Set Content-Type only if you are actually sending a body
    if (config.data !== undefined && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('access');
            await SecureStore.deleteItemAsync('refresh');
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: error.response?.data?.message,
            });
        }

        return Promise.reject(error);
    }
);

export default apiClient;
