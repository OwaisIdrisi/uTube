import { createApiClient } from "./apiClient";

const api = createApiClient(`${import.meta.env.VITE_BASE_URL}/likes`);


export const toggleVideoLike = async (videoId) => {
    const response = await api.post(`/toggle/v/${videoId}`);
    console.log(response);
    return response.data;
}

export const toggleCommentLike = async (commentId) => {
    const response = await api.post(`/toggle/c/${commentId}`);
    console.log(response);
    return response.data;
}

export const toggleTweetLike = async (tweetId) => {
    const response = await api.post(`/toggle/t/${tweetId}`);
    return response.data;
}

export const getLikedVideos = async () => {
    const response = await api.get(`/videos`);
    return response.data;
}


export const getVideoLikes = async (videoId) => {
    const response = await api.get(`/v/${videoId}`);
    return response.data;
}

export const getCommentLikes = async (commentId) => {
    const response = await api.get(`/c/${commentId}`);
    return response.data;
}

export const getTweetLikes = async (tweetId) => {
    const response = await api.get(`/t/${tweetId}`);
    return response.data;
}