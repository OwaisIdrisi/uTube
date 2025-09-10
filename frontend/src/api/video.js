import { createApiClient } from "./apiClient";
const api = createApiClient(`${import.meta.env.VITE_BASE_URL}/videos`);

export const getAllVideos = async () => {
    const response = await api.get('/', {
        params: {
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            sortType: 'desc'
        }
    });
    return response.data;
}

export const togglePublish = async (videoId) => {
    const response = await api.patch(`/toggle/publish/${videoId}`);
    console.log(response);
    return response.data;
}

export const uploadVideo = async (formData) => {
    const response = await api.post('/', formData);
    console.log(response);
    return response.data;
}

export const getVideoById = async (videoId) => {
    const response = await api.get(`/${videoId}`);
    return response.data;
}

export const updateVideo = async (videoId, data) => {
    const response = await api.patch(`/${videoId}`, data);
    console.log(response);
    return response.data;
}

export const deleteVideo = async (videoId) => {
    const response = await api.delete(`/${videoId}`);
    console.log(response);
    return response.data;
}