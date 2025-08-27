import apiClient from '@/services/apiClient';
import Toast from 'react-native-toast-message';

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

export const updatePhoto = async (entityType: string, entityId: number, photoId: number, imageUri: string) => {
    try {
        const formData = new FormData();
        
        // Create file object for React Native
        const mimeType = getMimeType(imageUri);
        const imageFile = {
            uri: imageUri,
            type: mimeType,
            name: `image.${mimeType.split('/')[1]}`,
        } as any;
        
        formData.append('image', imageFile);

        // users or points
        const response = await apiClient.put(`${entityType}/${entityId}/photo/update/${photoId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data;
    } catch (error: any) {
        const apiError = error?.response?.data?.error || error?.message;
        Toast.show({
            type: 'error',
            text1: 'Erro ao atualizar foto',
            text2: apiError,
        });
        throw error;
    }
}
