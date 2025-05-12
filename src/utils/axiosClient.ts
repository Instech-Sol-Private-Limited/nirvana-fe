import config from "@/config/config";
import axios from "axios";

const apiClient = axios.create({
    baseURL: config.baseURL,
    timeout: 10000,
});

apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("authToken");

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // @ts-ignore
        if (axios.isCancel(error)) {
            return Promise.reject({
                isCanceled: true,
                message: 'Request cancelled',
            });
        }
        if (error.response?.status === 401) {
            console.error("Unauthorized access - please login again");
        }

        return Promise.reject(error);
    }
);

export default apiClient;