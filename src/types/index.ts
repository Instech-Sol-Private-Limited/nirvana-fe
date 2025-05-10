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
    content: string;
    author: User;
    category: Category;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    replyCount: number;
    likeCount: number;
    isSticky: boolean;
    isClosed: boolean;
    isSolved: boolean;
    images: string[]; // Assuming image URLs or paths as strings
    lastActivity: string;
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
    name: string;
    slug: string;
    description: string;
    threadCount: number;
    iconType: 'cube' | 'stripes' | 'dots' | 'document';
    color: string;
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