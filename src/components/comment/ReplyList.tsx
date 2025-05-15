'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CommentItem from './CommentItem';
import { getCommentReplies, updateReply, deleteReply } from '@/utils/threads';

interface Author {
  id: string;
  username: string;
  avatar?: string | null;
  role?: string;
}
interface ReplyType {
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
interface ReplyListProps {
  parentId: string;
  onReply: (commentId: string, authorUsername: string) => void;
}

const ReplyList = ({ parentId, onReply }: ReplyListProps) => {
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleReplies, setVisibleReplies] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateReply = async (data: { comment_id: string; content: string; imgs?: (string | undefined)[] }) => {
    try {
      const response = await updateReply({
        comment_id: data.comment_id,
        content: data.content
      });

      if (response.success) {
        // setReplies(replies.map(reply =>
        //   reply.id === replyId
        //     ? { ...reply, content: text  }
        //     : reply
        // ));
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
        setReplies(replies.filter(reply => reply.id !== replyId));
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

  const fetchReplies = async (parentId: string) => {
    try {
      console.log(parentId)
      if (parentId) {
        setLoading(true);
        const response = await getCommentReplies(parentId);
        if (response.success) {
          setReplies(response.data.replies || []);
        } else {
          setError(response.message || 'Failed to load replies');
        }
      }
    } catch (err) {
      console.error('Error fetching replies:', err);
      setError('Failed to load replies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies(parentId);
  }, [parentId]);

  if (loading) {
    return (
      <div className="ml-10 mt-2 text-gray-400 text-sm">
        Loading replies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-10 mt-2 text-red-400 text-sm">
        {error}
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
      {replies.slice(0, visibleReplies).map(reply => (
        <CommentItem
          key={reply.id}
          type="reply"
          comment={reply}
          onReply={(data: { comment_id: string, user_name: string }) => {
            fetchReplies(data.comment_id);
            onReply(data.comment_id, data.user_name);
          }}
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