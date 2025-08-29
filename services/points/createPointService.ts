import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';
import { translateWeekdayToEnglish } from '@/src/utils/weekdayTranslation';

type week_days_types = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface PointDataInput {
    name: string,
    description: string,
    week_start: string, // Can be in Portuguese from the UI
    week_end: string,   // Can be in Portuguese from the UI
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

interface PointDataAPI {
    name: string,
    description: string,
    week_start: week_days_types, // Must be in English for API
    week_end: week_days_types,   // Must be in English for API
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

export const createPoint = async (pointData: PointDataInput) => {
    try {
        const apiData: PointDataAPI = {
            ...pointData,
            week_start: translateWeekdayToEnglish(pointData.week_start) as week_days_types,
            week_end: translateWeekdayToEnglish(pointData.week_end) as week_days_types,
        };

        const response = await apiClient.post('points/create/', apiData);
        return response.data;
    } catch (error) {
        console.error('Service error:', error);
        handleApiError(error);
        throw error;
    }
};
