'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
import ReplyList from './ReplyList';
import { getThreadComments, updateComment as updateCommentApi, deleteComment as deleteCommentApi } from '@/utils/threads';

interface CommentType {
  id: string;
  thread_id: string;
  imgs?: string[];
  content: string;
  has_subcomment: boolean;
  total_likes: number;
  total_dislikes: number;
  user_name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_edited?: boolean;
  profiles: {
    avatar_url: string;
  };
}

interface CommentsProps {
  threadId: string;
}

export default function Comments({ threadId }: CommentsProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyToUsername, setReplyToUsername] = useState<string | null>(null);
  const [showMainForm, setShowMainForm] = useState(false);

  const handleReplyToComment = (commentId: string, authorUsername: string) => {
    setActiveReplyId(commentId);
    setReplyToUsername(authorUsername);
  };
  
  const handleUpdateComment = async (commentId: string, text: string) => {
    try {
      const response = await updateCommentApi({
        comment_id: commentId,
        content: text
      });
      
      if (response.success) {
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: text, isEdited: true } 
            : comment
        ));
        console.log(`Updated comment ${commentId}: ${text}`);
      } else {
        console.error("Failed to update comment:", response.message);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
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

   useEffect(() => {
    const fetchComments = async () => {
      if (!threadId) return;
      
      setLoading(true);
      const response = await getThreadComments(threadId);
      if (response.success) {
        console.log(response.data.comments)
        setComments(response.data.comments || []);
      } else {
        console.error(response.message);
      }
      setLoading(false);
    };

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
    <div className="space-y-6">
      {comments.map(comment => (
        <div key={comment.id}>
          <CommentItem
            comment={{
              id: comment.id,
              content: comment.content,
              author: {
                id: comment.user_id,
                username: comment.user_name,
                avatar: comment.profiles.avatar_url || null,
              },
              createdAt: comment.created_at,
              likeCount: comment.total_likes,
              dislikeCount: comment.total_dislikes,
              isEdited: Boolean(comment.is_edited),
              images: comment.imgs
            }}
            onReply={handleReplyToComment}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
          />
            <ReplyList 
              parentId={comment.id}
              onReply={handleReplyToComment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
        </div>
      ))}
    </div>
  );
}