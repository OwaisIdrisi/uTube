import { createApiClient } from "./apiClient";
const api = createApiClient(`${import.meta.env.VITE_BASE_URL}/tweets`);

export const getAllTweets = async () => {
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

export const createTweet = async (content) => {
    const response = await api.post('/', { content });
    console.log(response);
    return response.data;
}

export const getUserTweets = async (userId) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
}

export const updateTweet = async (tweetId, data) => {
    const response = await api.patch(`/${tweetId}`, data);
    console.log(response);
    return response.data;
}

export const deleteTweet = async (tweetId) => {
    const response = await api.delete(`/${tweetId}`);
    console.log(response);
    return response.data;
}

export const getTweetDetails = async (tweetId) => {
    const response = await api.get(`/${tweetId}`);
    console.log(response);
    return response.data
}

