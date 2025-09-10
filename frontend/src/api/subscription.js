import { createApiClient } from "./apiClient";

const api = createApiClient(`${import.meta.env.VITE_BASE_URL}/subscriptions`);


export const getChannelSubscribers = async (channelId) => {
    const response = await api.get(`/u/${channelId}/subscribers`);
    console.log(response);
    return response.data;
}

export const getSubscribedChannels = async () => {
    const response = await api.get(`/u/subscribedChannels`);
    return response.data;
}

export const toggleSubscription = async (channelId) => {
    const response = await api.post(`/c/${channelId}`);
    console.log(response);
    return response.data;
}

export const isSubscribedToChannel = async (channelId) => {
    const response = await api.get(`/u/is-subscribed/${channelId}`);
    console.log(response);
    return response.data;
}