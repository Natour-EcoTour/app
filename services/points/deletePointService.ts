import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';

// Delete point service
export const deletePoint = async (pointId: number) => {
    try {
        const response = await apiClient.delete(`points/me/${pointId}/delete/`,
            {
                data: {}
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};