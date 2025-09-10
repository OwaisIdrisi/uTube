import { createApiClient } from "./apiClient";

const api = createApiClient(`${import.meta.env.VITE_BASE_URL}/comments`);

export const createComment = async (id, type, content) => {
    // let template = type === "tweet" ? `/t/${id}` : `/${id}`;
    //  type parameter will decide whether it's tweet or video comment
    let template;
    if (type === "tweet") {
        template = `/t/${id}`;
    } else if (type === "video") {
        template = `/${id}`;
    }
    const response = await api.post(template, { content });
    console.log(response);
    return response.data;
    // For video comments
    // const response = await api.post(`/${videoId}`, { content });
    // console.log(response);
    // return response.data;
}

export const editComment = async (commentId, content) => {
    const response = await api.patch(`/c/${commentId}`, { content });
    console.log(response);
    return response.data;
}

export const deleteComment = async (commentId) => {
    const response = await api.delete(`/c/${commentId}`);
    console.log(response);
    return response.data;
}

export const getComments = async (id, type) => {
    let template = type === "tweet" ? `/t/${id}` : `/${id}`;
    const response = await api.get(template);
    return response.data;
}

export const createTweetComment = async (tweetId) => {
    const response = await api.post(`/t/${tweetId}`)
    console.log(response);
    return response.data
}
