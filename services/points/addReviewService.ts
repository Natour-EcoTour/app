import apiClient from '@/services/apiClient';

// Add review service
export const addReview = async (pointId: number, rating: number) => {
    const { data } = await apiClient.post(`/points/${pointId}/review/`, { rating });
    return data;
};
