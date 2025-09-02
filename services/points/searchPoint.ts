import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';

interface SearchPointParams {
    name: string;
}

export const searchPoints = async (params: SearchPointParams) => {
    try {
        const response = await apiClient.get(`/points/search/`, {
            params,
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
