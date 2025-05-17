'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CommentItem from './CommentItem';
import { updateReply, deleteReply } from '@/utils/threads';
import { Reply } from '@/types';

interface ReplyListProps {
  parentId: string;
  fetchReplies: (parentId: string) => void;
  replies: Reply[];
  loading: boolean;
  setLoading: (value: boolean) => void
}

const ReplyList = ({ parentId, fetchReplies, replies, loading, setLoading }: ReplyListProps) => {
  const [visibleReplies, setVisibleReplies] = useState(2);

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
      {replies.reverse().slice(0, visibleReplies).map(reply => (
        <CommentItem
          key={reply.id}
          type="reply"
          reply_to={reply.user_name}
          comment={reply}
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