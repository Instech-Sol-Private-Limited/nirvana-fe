import apiClient from './axiosClient';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

const getAllCategories = async (): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get('/categories/get-all-categories');
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

export { getAllCategories };
