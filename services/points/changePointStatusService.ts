import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';

// Change point status service
export const changePointStatus = async (pointId: number) => {
    try {

        await new Promise(resolve => setTimeout(resolve, 100));

        const response = await apiClient.put(`points/${pointId}/status/`);
        return response.data;
    } catch (error) {
        console.error('Error changing point status:', error);
        handleApiError(error);
    }
};
