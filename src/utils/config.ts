import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const controller = new AbortController();
const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (!config.headers) config.headers = {};

    config.headers.Authorization = token ? `Bearer ${token}` : '';

    // Set signal only if AbortController exists and signal is not already set
    if (!config.signal) {
        config.signal = controller.signal;
    }

    return config;
});

axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (axios.isCancel(error)) {
            return Promise.reject({ isCancel: true, message: "Request cancelled" });
        } else {
            return Promise.reject(error);
        }
    }
);

export default axios;