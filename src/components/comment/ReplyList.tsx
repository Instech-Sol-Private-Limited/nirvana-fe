'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CommentItem from './CommentItem';
import { Comment } from '@/constants/mockData';

interface ReplyListProps {
  parentId: string;
  comments: Comment[];
  onReply: (commentId: string, authorUsername: string) => void;
}

const ReplyList = ({ parentId, comments, onReply }: ReplyListProps) => {
  const [visibleReplies, setVisibleReplies] = useState(2);

  const replies = comments.filter(c => c.parentId === parentId);
  
  if (replies.length === 0) {
    return null;
  }

  const showMoreReplies = () => {
    setVisibleReplies(replies.length);
  };

  const showLessReplies = () => {
    setVisibleReplies(2);
  };

  const hasMoreRepliesToShow = replies.length > 2 && visibleReplies < replies.length;
  const hasRepliesToHide = replies.length > 2 && visibleReplies > 2;

  return (
    <div className="mt-4">
      {replies.slice(0, visibleReplies).map(reply => (
        <CommentItem
          key={reply.id}
          comment={reply}
          isReply={true}
          onReply={onReply}
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