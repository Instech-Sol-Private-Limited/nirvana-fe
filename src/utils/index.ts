import { Thread, Comment, User, Category } from '../types';
import { categories, threads, comments, users } from './data';


export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
}


export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}


export function getThreadsByCategory(categorySlug: string): Thread[] {
  const category = categories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  
  return threads.filter(thread => thread.category.id === category.id);
}

export function getThreadById(threadId: string): Thread | undefined {
  return threads.find(thread => thread.id === threadId);
}


export function getCommentsForThread(threadId: string): Comment[] {
  return comments.filter(comment => comment.threadId === threadId && !comment.parentId);
}


export function getRepliesForComment(commentId: string): Comment[] {
  return comments.filter(comment => comment.parentId === commentId);
}


export function createThread(threadData: Omit<Thread, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'replyCount' | 'likeCount' | 'isSticky' | 'isClosed' | 'isSolved' | 'images' |'lastActivity'>): Thread {
  const newThread: Thread = {
    id: `thread-${threads.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
    replyCount: 0,
    likeCount: 0,
    isSticky: false,
    isClosed: false,
    isSolved: false,
    images: [], 
    lastActivity: new Date().toISOString(),
    ...threadData
  };
  
  threads.push(newThread);
  return newThread;
}


export function createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'dislikeCount' | 'isAcceptedAnswer'>): Comment {
  const newComment: Comment = {
    id: `comment-${comments.length + 1}`,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    dislikeCount: 0,
    isAcceptedAnswer: false,
    ...commentData
  };
  
  comments.push(newComment);
  
  
  const thread = threads.find(t => t.id === commentData.threadId);
  if (thread) {
    thread.replyCount += 1;
    thread.lastActivity = new Date().toISOString();
  }
  
  return newComment;
}


export function toggleThreadLike(threadId: string, userId: string): boolean {
  const thread = threads.find(t => t.id === threadId);
  if (!thread) return false;
  
  
  thread.likeCount += 1;
  return true;
}


export function toggleCommentLike(commentId: string, userId: string): boolean {
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return false;
  
  
  comment.likeCount += 1;
  return true;
}


export function toggleCommentDislike(commentId: string, userId: string): boolean {
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return false;
  
  
  comment.dislikeCount += 1;
  return true;
}


export function markAsAcceptedAnswer(commentId: string, threadId: string): boolean {
 
  comments
    .filter(c => c.threadId === threadId && c.isAcceptedAnswer)
    .forEach(c => c.isAcceptedAnswer = false);
  
  
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return false;
  
  comment.isAcceptedAnswer = true;
  return true;
}


export function getTrendingThreads(limit = 5): Thread[] {
  return [...threads]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
}


export function searchThreads(query: string): Thread[] {
  const lowerCaseQuery = query.toLowerCase();
  return threads.filter(
    thread => 
      thread.title.toLowerCase().includes(lowerCaseQuery) || 
      thread.content.toLowerCase().includes(lowerCaseQuery)
  );
}


export function getUserById(userId: string): User | undefined {
  return users.find(user => user.id === userId);
}

// Get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(category => category.slug === slug);
}