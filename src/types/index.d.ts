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
}

export interface Comment {
  id: string;
  thread_id: string;
  content: string;
  total_likes: number;
  total_dislikes: number;
  user_name: string;
  user_id: string;
  profiles: {
    avatar_url: string;
  }
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  is_deleted?: boolean;
  is_solution: boolean;
  imgs?: string[];
  has_subcomment: boolean;
  user_reaction?: any;
}

export interface Reply {
  id: string;
  comment_id?: string;
  content: string;
  total_likes: number;
  total_dislikes: number;
  user_name: string;
  user_id: string;
  profiles: {
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  is_deleted?: boolean;
  user_reaction?: any;
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

// export interface User {
//     id: string;
//     username: string;
//     email: string;
//     avatar: string;
//     bio?: string;
//     joinedDate: string;
//     postCount: number;
//     reputation: number;
//     isAdmin: boolean;
//     role?: 'admin' | 'moderator' | 'member';
//   }