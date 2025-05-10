// api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const categoryApi = {
    getAllCategories: async () => {
        try {
          const response = await api.get('/categories/get-all-categories');
          console.log('📦 Categories response:', response.data);
          return response.data;
        } catch (error) {
          console.error(' Error fetching categories:', error);
          throw error;
        }
      },
  createCategory: async (categoryData: { category_name: string; category_slug: string }) => {
    const response = await api.post('/categories/create-category', categoryData);
    return response.data;
  },
  
  updateCategory: async (id: string, categoryData: { category_name: string; category_slug: string }) => {
    const response = await api.put(`/categories/update-category/${id}`, categoryData);
    return response.data;
  },
  
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/delete-category/${id}`);
    return response.data;
  },

  toggleCategoryStatus: async (id: string, is_active: boolean) => {
    const response = await api.patch(`/categories/toggle-category-status/${id}`, { is_active });
    return response.data;
  }
};


export const threadApi = {
  getAllThreads: async (limit = 10, offset = 0) => {
    const response = await api.get(`/threads/get-all-threads?limit=${limit}&offset=${offset}`);
    return response.data;
  },
  
  getThreadDetails: async (threadId: string) => {
    const response = await api.get(`/threads/get-thread-details/${threadId}`);
    return response.data;
  },
  
  createThread: async (threadData: {
    title: string;
    description: string;
    imgs?: string[];
    category_id: string;
    keywords?: string[];
  }) => {
    const response = await api.post('/threads/create-thread', threadData);
    return response.data;
  },
  
  updateThread: async (
    threadId: string,
    threadData: {
      title: string;
      description: string;
      imgs?: string[];
      category_id: string;
      keywords?: string[];
    }
  ) => {
    const response = await api.put(`/threads/update-thread/${threadId}`, threadData);
    return response.data;
  },
  
  deleteThread: async (threadId: string) => {
    const response = await api.delete(`/threads/delete-thread/${threadId}`);
    return response.data;
  },
  
  applyReaction: async (threadId: string, type: 'like' | 'dislike') => {
    const response = await api.patch(`/threads/apply-react/${threadId}`, { type });
    return response.data;
  },
  
  getUserReaction: async (threadId: string) => {
    const response = await api.get(`/threads/get-user-reaction/${threadId}`);
    return response.data;
  },
  
  getAllUserReactions: async (limit = 10, offset = 0) => {
    const response = await api.get(`/threads/get-all-user-reactions?limit=${limit}&offset=${offset}`);
    return response.data;
  }
};

export default api;