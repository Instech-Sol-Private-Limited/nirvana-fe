import { Comment, User } from '@/types';
import { comments, users } from '@/constants';


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

export function getCommentsForThread(threadId: string): Comment[] {
  return comments.filter(comment => comment.threadId === threadId && !comment.parentId);
}

export function getRepliesForComment(commentId: string): Comment[] {
  return comments.filter(comment => comment.parentId === commentId);
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

export function getUserById(userId: string): User | undefined {
  return users.find(user => user.id === userId);
}
