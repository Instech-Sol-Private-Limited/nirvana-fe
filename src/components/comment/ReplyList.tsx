'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CommentItem from './CommentItem';
import { updateReply, deleteReply, applyReplyReaction } from '@/utils/threads';
import { Reply } from '@/types';
import { useAuth } from '@/context/AuthProvider';

interface ReplyListProps {
  parentId: string;
  fetchReplies: (parentId: string) => void;
  setReplies: React.Dispatch<React.SetStateAction<Record<string, Reply[]>>>;
  replies: Reply[];
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const ReplyList = ({ parentId, fetchReplies, setReplies, replies, loading, setLoading }: ReplyListProps) => {
  const [visibleReplies, setVisibleReplies] = useState(2);
  const { userId } = useAuth();

  const handleApplyReact = async (
    replyId: string,
    reply: Reply,
    type: 'like' | 'dislike'
  ) => {
    if (!userId) return;

    setReplies((prevReplies) => {
      const parentReplies = prevReplies[parentId] || [];
      const updatedReplies = parentReplies.map((t) => {
        if (t.id !== reply.id) return t;

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

        if (t.user_reaction) {
          const prevField = reactionFields[t.user_reaction as ReactionType];
          updatedCounts[prevField] = Math.max(0, updatedCounts[prevField] - 1);
        }

        if (newReaction) {
          const newField = reactionFields[newReaction as ReactionType];
          updatedCounts[newField]++;
        }

        return {
          ...t,
          user_reaction: newReaction,
          ...updatedCounts,
        };
      });

      return {
        ...prevReplies,
        [parentId]: updatedReplies,
      };
    });


    await applyReplyReaction(replyId, type);
  };

  const handleUpdateReply = async (data: { comment_id: string; content: string; imgs?: (string | undefined)[] }) => {
    try {
      const response = await updateReply({
        comment_id: data.comment_id,
        content: data.content
      });

      if (response.success) {
        fetchReplies(parentId)
      } else {
        console.error("Failed to update reply:", response.message);
      }
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      const response = await deleteReply(replyId);

      if (response.success) {
        fetchReplies(parentId)
      } else {
        console.error("Failed to delete reply:", response.message);
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const showMoreReplies = () => {
    setVisibleReplies(replies.length);
  };

  const showLessReplies = () => {
    setVisibleReplies(2);
  };

  useEffect(() => {
    if (parentId) {
      setLoading(true)
      fetchReplies(parentId);
    }

  }, [parentId]);

  if (loading) {
    return (
      <div className="ml-10 mt-2 text-gray-400 text-sm">
        Loading replies...
      </div>
    );
  }

  if (replies.length === 0) {
    return null;
  }

  const hasMoreRepliesToShow = replies.length > 2 && visibleReplies < replies.length;
  const hasRepliesToHide = replies.length > 2 && visibleReplies > 2;

  return (
    <div className="mt-4">
      {replies.slice(0, visibleReplies).reverse().map(reply => (
        <CommentItem
          key={reply.id}
          type="reply"
          reply_to={reply.user_name}
          comment={reply}
          handleApplyReact={(parentId, comment, type) =>
            handleApplyReact(parentId, comment as Reply, type)
          }
          parentId={parentId}
          fetchReplies={fetchReplies}
          onUpdate={handleUpdateReply}
          onDelete={handleDeleteReply}
        />
      ))}

      {hasMoreRepliesToShow && (
        <button
          onClick={showMoreReplies}
          className="mt-2 ml-6 flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors"
        >
          <ChevronDown className="h-4 w-4" />
          View {replies.length - visibleReplies} more {replies.length - visibleReplies === 1 ? 'reply' : 'replies'}
        </button>
      )}

      {hasRepliesToHide && (
        <button
          onClick={showLessReplies}
          className="mt-2 ml-6 flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors"
        >
          <ChevronUp className="h-4 w-4" />
          View less
        </button>
      )}
    </div>
  );
};

export default ReplyList;