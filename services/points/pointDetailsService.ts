import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';

// Get point details service
export const pointDetails = async (id: number) => {
    try {
        const response = await apiClient.get(`/points/${id}/`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
