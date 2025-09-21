import apiClient from '@/services/apiClient';
import Toast from 'react-native-toast-message';
import { handleApiError } from '@/src/utils/errorHandling';

// Helper function to get MIME type from URI
const getMimeType = (uri: string): string => {
    const extension = uri.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'webp':
            return 'image/webp';
        default:
            return 'image/jpeg';
    }
};

// Helper function to create FormData for image upload
const createImageFormData = (imageUri: string): FormData => {
    
    if (!imageUri) {
        throw new Error('Image URI is required');
    }
    
    // Validate URI format
    if (!imageUri.startsWith('file://') && !imageUri.startsWith('content://') && !imageUri.startsWith('ph://')) {
        console.warn('Image URI may not be valid:', imageUri);
    }
    
    const formData = new FormData();
    const mimeType = getMimeType(imageUri);
    
    const imageFile = {
        uri: imageUri,
        type: mimeType,
        name: `image.${mimeType.split('/')[1]}`,
    } as any;
    
    
    formData.append('image', imageFile);
    return formData;
};

/**
 * Generic photo upload service that works for both users and points
 * @param entityType - 'users' or 'points'
 * @param entityId - The ID of the user or point
 * @param imageUri - The local URI of the image to upload
 * @returns Promise with the response data
 */
export const uploadPhoto = async (entityType: 'users' | 'points', entityId: number, imageUri: string) => {
    try {
        const formData = createImageFormData(imageUri);
        
        // Construct the endpoint based on entity type
        const endpoint = `${entityType}/${entityId}/photo/upload/`;


        const response = await apiClient.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000,
        });
        
        return response.data;
    } catch (error: any) {
        console.error('Upload photo error details:', error.response?.data);
        const apiError = handleApiError(error);
        throw apiError;
    }
};

/**
 * Update an existing photo
 * @param entityType - 'users' or 'points'
 * @param entityId - The ID of the user or point
 * @param photoId - The ID of the photo to update
 * @param imageUri - The local URI of the new image
 * @returns Promise with the response data
 */
export const updatePhoto = async (entityType: 'users' | 'points', entityId: number, photoId: number, imageUri: string) => {
    try {
        const formData = createImageFormData(imageUri);

        // Add trailing slash to match API requirements
        const endpoint = `${entityType}/${entityId}/photo/update/${photoId}/`;


        const response = await apiClient.put(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data;
    } catch (error: any) {
        console.error('Update photo error details:', error.response?.data);
        const apiError = handleApiError(error);
        throw apiError;
    }
};

/**
 * Delete a photo
 * @param entityType - 'users' or 'points'
 * @param entityId - The ID of the user or point
 * @param photoId - The ID of the photo to delete
 * @returns Promise with the response data
 */
export const deletePhoto = async (entityType: 'users' | 'points', entityId: number, photoId: number) => {
    try {
        const response = await apiClient.delete(`${entityType}/${entityId}/photo/delete/${photoId}/`);
        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.error || error?.message;
        Toast.show({
            type: 'error',
            text1: 'Erro ao deletar foto',
            text2: apiError,
        });
        throw error;
    }
};

/**
 * Delete multiple photos using the photos/delete endpoint
 * @param photoIds - Array of photo IDs to delete
 * @param publicIds - Array of public IDs corresponding to the photos
 * @returns Promise with the response data
 */
export const deleteMultiplePhotos = async (photoIds: number[], publicIds: string[]) => {
    try {
        const response = await apiClient.delete('photos/delete/', {
            data: {
                ids: photoIds,
                public_ids: publicIds
            },
        });
        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.error || error?.message;
        Toast.show({
            type: 'error',
            text1: 'Erro ao deletar fotos',
            text2: apiError,
        });
        throw error;
    }
};

/**
 * Get photos for a specific user
 * @param userId - The ID of the user
 * @returns Promise with the photos data
 */
export const getPhotosByUser = async (userId: number) => {
    try {
        const response = await apiClient.get(`photos/?user_id=${userId}`);
        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.error || error?.message;
        console.error('Error getting user photos:', error);
        Toast.show({
            type: 'error',
            text1: 'Erro ao buscar fotos',
            text2: apiError,
        });
        throw error;
    }
};

/**
 * Get photos for a specific point
 * @param pointId - The ID of the point
 * @returns Promise with the photos data
 */
export const getPhotosByPoint = async (pointId: number) => {
    try {
        const response = await apiClient.get(`photos/?point_id=${pointId}`);
        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.error || error?.message;
        console.error('Error getting point photos:', error);
        Toast.show({
            type: 'error',
            text1: 'Erro ao buscar fotos',
            text2: apiError,
        });
        throw error;
    }
};

// Convenience functions for backward compatibility and specific use cases

export const uploadUserPhoto = (userId: number, imageUri: string) => 
    uploadPhoto('users', userId, imageUri);

export const uploadPointPhoto = (pointId: number, imageUri: string) => 
    uploadPhoto('points', pointId, imageUri);

export const updateUserPhoto = (userId: number, photoId: number, imageUri: string) => 
    updatePhoto('users', userId, photoId, imageUri);

export const updatePointPhoto = (pointId: number, photoId: number, imageUri: string) => 
    updatePhoto('points', pointId, photoId, imageUri);

export const deleteUserPhoto = (userId: number, photoId: number) => 
    deletePhoto('users', userId, photoId);

export const deletePointPhoto = (pointId: number, photoId: number) => 
    deletePhoto('points', pointId, photoId);

// Legacy functions for compatibility with existing code
export const addPhoto = uploadPhoto;
export const addUserPhoto = uploadUserPhoto;
export const addPointPhoto = uploadPointPhoto;
export const getPhotoId = getPhotosByUser;