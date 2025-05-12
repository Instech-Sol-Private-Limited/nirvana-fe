export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
    bio?: string;
    joinedDate: string;
    postCount: number;
    reputation: number;
    isAdmin: boolean;
    role?: 'admin' | 'moderator' | 'member';
  }
  
export interface Thread {
  id: string;
  title: string;
  description: string;
  imgs: string[];
  category_name: string;
  category_id: string;
  author_name: string;
  author_id: string;
  publish_date: string;
  updated_at: string;
  total_likes: number;
  total_dislikes: number;
  keywords: string[];
  is_active: boolean;
  profiles: {
    avatar_url: string;
  };
  replyCount?: number;
}
  
  export interface Comment {
    id: string;
    threadId: string;
    content: string;
    author: User;
    createdAt: string;
    updatedAt?: string;
    likeCount: number;
    dislikeCount: number;
    isAcceptedAnswer: boolean;
    parentId?: string; // For nested replies
    replies?: Comment[];
  }

  export interface Reply {
    id: string;
    threadId: string;
    content: string;
    author: User; // You should already have a `User` type or interface
    createdAt: string;
    likeCount: number;
    dislikeCount: number;
    likedByCurrentUser: boolean;
    isEdited: boolean;
    isSolution: boolean;
    images: string[]; // Assuming image URLs or paths as strings
  }

  export interface Category {
    id: string;
    category_name: string;
    category_slug: string;
    description?: string;
  }
  
  export interface Notification {
    id: string;
    userId: string;
    type: 'reply' | 'mention' | 'like' | 'follow' | 'announcement';
    content: string;
    isRead: boolean;
    createdAt: string;
    relatedThreadId?: string;
    relatedCommentId?: string;
    relatedUserId?: string;
  }
  
  export interface ThreadFilter {
    categories?: string[];
    tags?: string[];
    timeRange?: 'today' | 'week' | 'month' | 'year' | 'all';
    sortBy?: 'recent' | 'popular' | 'unanswered' | 'solved';
  }
  
  export interface UserStats {
    threadsCreated: number;
    commentsPosted: number;
    solutionsProvided: number;
    likesReceived: number;
    reputation: number;
  }