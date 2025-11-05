import apiClient from '@/services/apiClient';
import Toast from 'react-native-toast-message';
import { handleApiError } from '@/src/utils/errorHandling';

// Get MIME type from URI
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

// Create FormData for image upload
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

// Generic photo upload service for users and points
export const uploadPhoto = async (entityType: 'users' | 'points', entityId: number, imageUri: string) => {
    try {
        const formData = createImageFormData(imageUri);
        
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

export const updatePhoto = async (entityType: 'users' | 'points', entityId: number, photoId: number, imageUri: string) => {
    try {
        const formData = createImageFormData(imageUri);

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

export const addPhoto = uploadPhoto;
export const addUserPhoto = uploadUserPhoto;
export const addPointPhoto = uploadPointPhoto;
export const getPhotoId = getPhotosByUser;