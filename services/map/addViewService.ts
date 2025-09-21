import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';

export const addView = async (pointId: string) => {
    try {
        const response = await apiClient.put(`/points/${pointId}/add_view/`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}
