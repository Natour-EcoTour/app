import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';

interface PointData {
    name: string,
    description: string,
    week_start: |,
    week_end: |,
    open_time: string,
    close_time: string,
    point_type: string,
    link: string,
    latitude?: number,
    longitude?: number,
    zip_code: string,
    city: string,
    neighborhood: string,
    state: string,
    street: string,
    number: number
}

export const createPoint = async (pointData: PointData) => {
    try {
        const response = await apiClient.post('points/create/', pointData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
