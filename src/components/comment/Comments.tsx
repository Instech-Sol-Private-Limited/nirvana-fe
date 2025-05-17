'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
import ReplyList from './ReplyList';
import { getThreadComments, updateComment as updateCommentApi, deleteComment as deleteCommentApi, getCommentReplies } from '@/utils/threads';
import CommentInput from './CommentInput';
import { Comment, Reply } from '@/types';

interface CommentsProps {
  threadId: string;
  threadsStats?: any;
  setThreadsStats?: any;
}

export default function Comments({ threadId, threadsStats, setThreadsStats }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(true);

  const handleUpdateComment = async (
    data: {
      comment_id: string; content: string; imgs?: (string | undefined)[]
    }): Promise<{ success: boolean; message?: string }> => {
    try {
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
        if (response.data.comments.has_subcomment) {

        }
        setThreadsStats((prev: any) => ({
          ...prev,
          comments: response.data?.comments.length
        }))
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (parentId: string) => {
    try {
      const response = await getCommentReplies(parentId);
      if (response.success) {
        setReplies(response.data.replies || []);
      } else {
      }
    } catch (err) {
      console.error('Error fetching replies:', err);
    } finally {
      setReplyLoading(false);
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

  return (
    <>
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
                type="comment"
                parentId={comment.id}
                fetchReplies={fetchReplies}
                onUpdate={handleUpdateComment}
                onDelete={handleDeleteComment}
              />
              <ReplyList
                parentId={comment.id}
                fetchReplies={fetchReplies}
                replies={replies}
                loading={replyLoading}
                setLoading={setReplyLoading}
              />
            </div>
          ))}
        </div>
      </div>

      {comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 bg-gray-800 rounded-xl border border-gray-700">
          <div className="bg-gray-700 rounded-full p-3 mb-4">
            <MessageCircle className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-400 text-center">No comments yet.</p>
          <p className="text-gray-500 text-sm text-center mt-1">Be the first to start the conversation!</p>
        </div>
      )}
    </>
  );
}