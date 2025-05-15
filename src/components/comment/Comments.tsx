'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
import ReplyList from './ReplyList';
import { getThreadComments, updateComment as updateCommentApi, deleteComment as deleteCommentApi } from '@/utils/threads';
import CommentForm from './CommentForm';
import CommentInput from './CommentInput';
interface CommentType {
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

interface CommentsProps {
  threadId: string;
  threadsStats: any;
  setThreadsStats: any;
}

export default function Comments({ threadId, threadsStats, setThreadsStats }: CommentsProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyToUsername, setReplyToUsername] = useState<string | null>(null);

  const handleReplyToComment = (commentId: string, authorUsername: string) => {
    setActiveReplyId(commentId);
    setReplyToUsername(authorUsername);
  };

  const handleUpdateComment = async (
    data: {
      comment_id: string; content: string; imgs?: string[]
    }): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log(data)
      const response = await updateCommentApi(data);

      if (response.success) {
        fetchComments();

        return { success: true };
      } else {
        console.error("Failed to update comment:", response.message);
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error("Error updating comment:", error);
      return { success: false, message: error.message || "Unknown error" };
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await deleteCommentApi(commentId);

      if (response.success) {
        const newComments = comments.filter(comment =>
          comment.id !== commentId
        );
        setComments(newComments);
        console.log(`Deleted comment ${commentId}`);
      } else {
        console.error("Failed to delete comment:", response.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const fetchComments = async () => {
    try {
      if (!threadId) return;
      const response = await getThreadComments(threadId);

      if (response.success) {
        setComments(response.data.comments || []);
        setThreadsStats((prev: any) => ({
          ...prev,
          comments: response.data?.comments.length
        }))
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [threadId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="bg-gray-700 rounded-full p-3 animate-pulse">
          <MessageCircle className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-400 mt-3">Loading comments...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-gray-800 rounded-xl border border-gray-700">
        <div className="bg-gray-700 rounded-full p-3 mb-4">
          <MessageCircle className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-400 text-center">No comments yet.</p>
        <p className="text-gray-500 text-sm text-center mt-1">Be the first to start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Comments ({threadsStats.comments})
        </h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 mb-8 border border-gray-700">
        <CommentInput threadId={threadId} fetchComments={fetchComments} />
      </div>

      <div className="space-y-8">
        {comments.map(comment => (
          <div key={comment.id}>
            <CommentItem
              comment={comment}
              onReply={handleReplyToComment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
            <ReplyList
              parentId={comment.id}
              onReply={handleReplyToComment}
            />
          </div>
        ))}
      </div>
    </div>
  );
}