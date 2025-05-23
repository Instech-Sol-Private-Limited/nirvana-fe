import apiClient from './axiosClient';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

interface AddCommentParams {
    thread_id: string;
    content: string;
    imgs?: string[];
}

interface UpdateCommentParams {
    comment_id: string;
    content: string;
    imgs?: (string | undefined)[]
}

interface AddReplyParams {
    comment_id: string;
    content: string;
    imgs?: string[];
}

interface UpdateReplyParams {
    comment_id: string;
    content: string;
}


// ===================== Threads Utils =============================

const getAllThreads = async (limit: number, offset: number): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(`/threads/get-all-threads?limit=${limit}&offset=${offset}`);
        console.log(response.data);
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

const updateThread = async (data: any, thread_id: string) => {
    try {
        const response = await apiClient.put(`/threads/update-thread/${thread_id}`, data);
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

const deleteThread = async (thread_id: string) => {
    try {
        const response = await apiClient.delete(`/threads/delete-thread/${thread_id}`);
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

const applyThreadReaction = async (thread_id: string, reactionType: 'like' | 'dislike' | 'heart' | 'hug' | 'insightful' | null) => {
    try {
        const response = await apiClient.patch(`/threads/apply-react/${thread_id}`, { type: reactionType });
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

const getThreadReaction = async (thread_id: string) => {
    try {
        const response = await apiClient.get(`/threads/get-user-reaction/${thread_id}`);
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

const getAllReactionsByUser = async () => {
    try {
        const response = await apiClient.get(`/threads/get-all-user-reactions`);
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

const getThreadComments = async (thread_id: string): Promise<ApiResponse<any>> => {
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
};

const addComment = async (params: AddCommentParams): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.post(`/threads/add-comment`, params);
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

const updateComment = async (params: UpdateCommentParams): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.put(`/threads/update-comment/${params.comment_id}`, {
            content: params.content,
            imgs: params.imgs
        });
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

const deleteComment = async (comment_id: string): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.delete(`/threads/delete-comment/${comment_id}`);
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

const applyCommentReaction = async (comment_id: string, reactionType: 'like' | 'dislike' | null) => {
    try {
        const response = await apiClient.patch(`/threads/apply-comment-react/${comment_id}`, { type: reactionType });
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

const getCommentReactionsByThread = async (thread_id: string): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(`/threads/get-all-comment-reaction/${thread_id}`);
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




// ===================== Comment's Replies Utils =============================

const getCommentReplies = async (comment_id: string): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(`/threads/get-replies/${comment_id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Error fetching replies:', error);
        return {
            success: false,
            // @ts-ignore
            message: error.message || 'An unexpected error occurred'
        };
    }
};


const addReply = async (params: AddReplyParams): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.post(`/threads/add-reply`, {
            content: params.content,
            comment_id: params.comment_id,
        });
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

const updateReply = async (params: UpdateReplyParams): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.put(`/threads/update-reply/${params.comment_id}`, {
            content: params.content,
        });

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

const deleteReply = async (comment_id: string): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.delete(`/threads/delete-reply/${comment_id}`);
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

const updateReplyReaction = async (comment_id: string, reactionType: 'like' | 'dislike' | 'none'): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.patch(`/threads/apply-reply-react/${comment_id}`, {
            reaction_type: reactionType
        });
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

const getReplyReactions = async (comment_id: string): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(`/threads/get-reply-reaction/${comment_id}`);
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

const getThreadsByUserId = async (userId: string, limit: number = 20, offset: number = 0): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(`/threads/get-threads-by-user/${userId}?limit=${limit}&offset=${offset}`);
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


export {
    // Thread operations
    getThreadsByUserId,
    getAllThreads,
    getThreadDetails,
    addNewThread,
    deleteThread,
    updateThread,
    applyThreadReaction,
    getThreadReaction,
    getAllReactionsByUser,

    // Comment operations
    getThreadComments,
    addComment,
    updateComment,
    deleteComment,
    applyCommentReaction,
    getCommentReactionsByThread,


    getCommentReplies,
    addReply,
    updateReply,
    deleteReply,
    updateReplyReaction,
    getReplyReactions
};