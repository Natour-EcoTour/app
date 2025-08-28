import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';

export const mapPoints = async () => {
    try {
        const response = await apiClient.get('points/map/');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
