import { refreshAccessToken } from "./auth";

export const protectedRequest = async (func) => {
    try {
        return await func();
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                const response = await refreshAccessToken();
                console.log(response);
                localStorage.setItem("accessToken", response?.data?.accessToken);
                return await func();
            }
            catch (err) {
                console.log("errr", err);
            }
            // .then((response) => {
            //     console.log("Retried request successful:", response);
            //     return response.data;
            // }).catch((err) => {
            //     console.log("Failed to retry request:", err);
            // });
        }
        console.log("error", error);

    }
}