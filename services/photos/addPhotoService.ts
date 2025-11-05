import apiClient from '@/services/apiClient';
import Toast from 'react-native-toast-message';

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

// Add photo service
export const addPhoto = async (entityType: string, entityId: number, imageUri: string) => {
    try {

        const formData = new FormData();

        const mimeType = getMimeType(imageUri);
        const imageFile = {
            uri: imageUri,
            type: mimeType,
            name: `image.${mimeType.split('/')[1]}`,
        } as any;

        formData.append('image', imageFile);

        const endpoint = entityType === 'users'
            ? `users/${entityId}/photo/upload/`
            : `points/${entityId}/photo/upload/`;

        const response = await apiClient.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000,
        });

        return response.data;
    } catch (error: any) {
        console.error('Image upload error:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);

        const apiError = error?.response?.data?.error || error?.message;
        Toast.show({
            type: 'error',
            text1: 'Erro ao adicionar foto',
            text2: apiError,
        });
        throw error;
    }
}

export const addUserPhoto = async (userId: number, imageUri: string) => {
    return addPhoto('users', userId, imageUri);
}

export const addPointPhoto = async (pointId: number, imageUri: string) => {
    return addPhoto('points', pointId, imageUri);
}
