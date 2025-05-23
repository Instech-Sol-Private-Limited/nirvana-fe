'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
import ReplyList from './ReplyList';
import { getThreadComments, updateComment as updateCommentApi, deleteComment as deleteCommentApi, getCommentReplies, applyCommentReaction } from '@/utils/threads';
import CommentInput from './CommentInput';
import { Comment, Reply } from '@/types';
import { useAuth } from '@/context/AuthProvider';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface CommentsProps {
  threadId: string;
  threadsStats?: any;
  fetchThreadDetails?: () => void;
}

export default function Comments({ threadId, threadsStats, fetchThreadDetails }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Record<string, Reply[]>>({});
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(true);
  const { userId } = useAuth();
  const router = useRouter();

  const handleApplyReact = async (
    parentId: string,
    comment: Comment,
    type: 'like' | 'dislike'
  ) => {
    if (!userId) {
      toast.error('Account is not logged in!');
      router.push('/login');
      return;
    }

    setComments((prev: Comment[]) =>
      prev.map((t) => {
        if (t.id !== comment.id) return t;

        const newReaction = t.user_reaction === type ? null : type;

        const reactionFields = {
          like: 'total_likes',
          dislike: 'total_dislikes',
        } as const;

        type ReactionType = keyof typeof reactionFields;
        type FieldMap = Record<typeof reactionFields[ReactionType], number>;

        const updatedCounts: FieldMap = {
          total_likes: t.total_likes,
          total_dislikes: t.total_dislikes,
        };

        // Decrease previous reaction
        if (t.user_reaction) {
          const prevField = reactionFields[t.user_reaction as ReactionType];
          updatedCounts[prevField] = Math.max(0, updatedCounts[prevField] - 1);
        }

        // Increase new reaction
        if (newReaction) {
          const newField = reactionFields[newReaction as ReactionType];
          updatedCounts[newField]++;
        }

        return {
          ...t,
          user_reaction: newReaction,
          ...updatedCounts,
        };
      })
    );

    await applyCommentReaction(parentId, type);
  };

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
        fetchComments();
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
        setReplies(prev => ({
          ...prev,
          [parentId]: response.data.replies || []
        }));
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
                handleApplyReact={handleApplyReact}
                parentId={comment.id}
                fetchReplies={fetchReplies}
                onUpdate={handleUpdateComment}
                onDelete={handleDeleteComment}
              />

              {/* {comment.has_subcomment && ( */}
              <ReplyList
                parentId={comment.id}
                fetchReplies={fetchReplies}
                setReplies={setReplies}
                replies={replies[comment.id] || []}
                loading={replyLoading}
                setLoading={setReplyLoading}
              />

              {/* )} */}
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