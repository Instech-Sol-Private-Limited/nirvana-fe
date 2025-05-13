import apiClient from './axiosClient';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}


// ===================== Threads Utils =============================

const getAllThreads = async (limit: number, offset: number): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(`/threads/get-all-threads?limit=${limit}&offset=${offset}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {

        return {
            success: false,
            // @ts-ignore
            message: error.message || 'An unexpected error occurred'
        };
    }
};

const getThreadDetails = async (thread_id: string): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(`/threads/get-thread-details/${thread_id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {

        return {
            success: false,
            // @ts-ignore
            message: error.message || 'An unexpected error occurred'
        };
    }
};

const addNewThread = async (data: any) => {
    try {
        const response = await apiClient.post(`/threads/create-thread`, data);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {

        return {
            success: false,
            // @ts-ignore
            message: error.message || 'An unexpected error occurred'
        };
    }
};



// ===================== Threads Comments Utils =============================
const getThreadComments = async (thread_id: string): Promise<any> => {
    try {
        const response = await apiClient.get(`/threads/get-comments/${thread_id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {

        return {
            success: false,
            // @ts-ignore
            message: error.message || 'An unexpected error occurred'
        };
    }
}


// ===================== Comment's Replies Utils =============================
const getCommentReplies = async (comment_id: string): Promise<any> => {
    try {
        const response = await apiClient.get(`/threads/get-subcomments/${comment_id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {

        return {
            success: false,
            // @ts-ignore
            message: error.message || 'An unexpected error occurred'
        };
    }
}

export { getAllThreads, getThreadDetails, addNewThread, getThreadComments, getCommentReplies };
