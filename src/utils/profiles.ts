import  apiClient  from './axiosClient';


interface UpdateProfilePayload {
  first_name: string;
  last_name?: string;
  avatar_url?: string;
}

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

const updateUserProfile = async (payload: UpdateProfilePayload): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.put('/profiles', payload);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An unexpected error occurred'
    };
  }
};
export {updateUserProfile};