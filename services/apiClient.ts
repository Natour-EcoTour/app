import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

// Create API client with base configuration
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
});


// Request interceptor to add authorization token
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync('access');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.data !== undefined && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('access');
      await SecureStore.deleteItemAsync('refresh');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
