import axios from "axios";

export const createApiClient = (baseUrl) => {
    const api = axios.create({
        baseURL: baseUrl,
        withCredentials: true
    });

    api.interceptors.response.use(function onFulFilled(response) {
        return response;
    }, async function onRejected(error) {
        const originalRequest = error.config;
        console.log(error.config);

        if (originalRequest.url.includes('/refresh-token')) {
            return Promise.reject(error);
        }
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Handle unauthorized access
            try {
                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/refresh-token`, {}, {
                    withCredentials: true
                });
                console.log("Token refreshed successfully:", res.data);
                return api(originalRequest);
            } catch (error) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                // location.reload();
                console.log("Failed to refresh token:", error);
            }
        }
        return Promise.reject(error);
    })
    return api;
}