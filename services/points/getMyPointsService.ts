import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';

// Get my points params interface
interface GetMyPointsParams {
    name?: string;
    status?: 'true' | 'false' | 'null' | 'none';
}

// Get my points service
export const getMyPoints = async (params?: GetMyPointsParams) => {
    try {
        const queryParams = new URLSearchParams();

        if (params?.name) {
            queryParams.append('name', params.name);
        }

        if (params?.status !== undefined) {
            queryParams.append('status', params.status);
        }

        const queryString = queryParams.toString();
        const url = `/users/me/points/${queryString ? `?${queryString}` : ''}`;

        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
