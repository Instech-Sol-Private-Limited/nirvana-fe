'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
import ReplyList from './ReplyList';
import CommentForm from './CommentForm';
import { Comment, getMockComments } from '@/constants/mockData';

interface CommentsProps {
  threadId: string;
}

export default function Comments({ threadId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyToUsername, setReplyToUsername] = useState<string | null>(null);
  const [showMainForm, setShowMainForm] = useState(false);

  useEffect(() => {
    setComments(getMockComments(threadId));
  }, [threadId]);

  const handleReplyToComment = (commentId: string, authorUsername: string) => {
    setActiveReplyId(commentId);
    setReplyToUsername(authorUsername);
  };

  const handleAddComment = (text: string) => {
    console.log(`Adding comment to thread ${threadId}: ${text}`);
    setShowMainForm(false);
  };

  const handleCancelMainComment = () => {
    setShowMainForm(false);
  };

  const topLevelComments = comments.filter(comment => !comment.parentId);

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
    <div className="space-y-6">
      
      {/* {!showMainForm ? (
        <button 
          onClick={() => setShowMainForm(true)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 text-sm text-left hover:bg-gray-650 transition-all"
        >
          Add a comment...
        </button>
      ) : (
        <CommentForm 
          onSubmit={handleAddComment}
          onCancel={handleCancelMainComment}
        />
      )} */}

      {/* Comment list */}
      {topLevelComments.map(comment => (
        <div key={comment.id}>
          <CommentItem
            comment={comment}
            onReply={handleReplyToComment}
          />
          <ReplyList 
            parentId={comment.id}
            comments={comments}
            onReply={handleReplyToComment}
          />
        </div>
      ))}
    </div>
  );
}