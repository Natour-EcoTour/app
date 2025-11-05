import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';
import { translateWeekdayToEnglish } from '@/src/utils/weekdayTranslation';

// Week days types
type week_days_types = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Form values interface
export interface FormValues  {
  name: string;
  description: string;
  link?: string;
  address: {
    cep?: string;
    city?: string;
    neighborhood?: string;
    uf?: string;
    street?: string;
    number?: string;
    latitude: string;
    longitude: string;
  };
  time: {
    weekStart: string;
    weekEnd: string;
    timeStart: string;
    timeEnd: string;
  };
  type: string;
  images: any[];
};

// Update point service
export const updatePoint = async (pointData: FormValues, pointId: string) => {
    try {
        const apiData: FormValues = {
            ...pointData,
            time: {
                weekStart: translateWeekdayToEnglish(pointData.time.weekStart) as week_days_types,
                weekEnd: translateWeekdayToEnglish(pointData.time.weekEnd) as week_days_types,
                timeStart: pointData.time.timeStart,
                timeEnd: pointData.time.timeEnd,
            },
        };

        const response = await apiClient.put(`points/${pointId}/edit/`, apiData);
        return response.data;
    } catch (error) {
        console.error('Service error:', error);
        handleApiError(error);
        throw error;
    }
};
