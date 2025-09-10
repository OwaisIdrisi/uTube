import { createApiClient } from "./apiClient";

const api = createApiClient(`${import.meta.env.VITE_BASE_URL}`)


export const getUserChannelProfile = async (username) => {
    const response = await api.get(`/users/channel/${username}`);
    return response.data;
}

export const getUserVideos = async () => {
    const response = await api.get(`/dashboard/videos`);
    return response.data;
}

export const getChannelVideos = async (userId) => {
    const response = await api.get(`/videos/channel/${userId}`);
    return response.data;
}

export const getTweetDetails = async (tweetId) => {

}