import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';

// Search point params interface
interface SearchPointParams {
    name: string;
}

// Search points service
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
