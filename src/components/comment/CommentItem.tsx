'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, Reply, CheckCircle } from 'lucide-react';
import { Comment } from '@/constants/mockData';
import CommentAuthor from './CommentAuthor';
import CommentForm from './CommentForm';
import CommentContent from './CommentContent';

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onReply: (commentId: string, authorUsername: string) => void;
}

const CommentItem = ({
  comment,
  isReply = false,
  onReply
}: CommentItemProps) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [isDisliked, setIsDisliked] = useState(comment.isDisliked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [dislikeCount, setDislikeCount] = useState(comment.dislikeCount || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
      setIsLiked(false);
    } else {
      if (isDisliked) {
        setDislikeCount(dislikeCount - 1);
        setIsDisliked(false);
      }
      setLikeCount(likeCount + 1);
      setIsLiked(true);
    }
  };

  const handleDislikeToggle = () => {
    if (isDisliked) {
      setDislikeCount(dislikeCount - 1);
      setIsDisliked(false);
    } else {
      if (isLiked) {
        setLikeCount(likeCount - 1);
        setIsLiked(false);
      }
      setDislikeCount(dislikeCount + 1);
      setIsDisliked(true);
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
    if (!showReplyForm) {
      onReply(comment.id, comment.author.username);
    }
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
  };

  const handleSubmitReply = (text: string) => {
    console.log(`Replying to comment ${comment.id}: ${text}`);
    setShowReplyForm(false);
  };

  return (
    <div className={`${isReply ? 'ml-0 sm:ml-6 pl-3 sm:pl-4 border-l border-gray-700/40' : ''} mb-4`}>
      <div className="flex gap-3">
        <Link href={`/users/${comment.author.id}`} className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <CommentAuthor author={comment.author} />
          </div>
        </Link>

        <div className="flex-1">
          <div className="bg-gray-750 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Link href={`/users/${comment.author.id}`} className="text-white font-medium hover:text-teal-400 transition-colors">
                  {comment.author.username}
                </Link>

                {comment.author.role && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-700 text-teal-400">
                    {comment.author.role}
                  </span>
                )}

                {comment.isAcceptedAnswer && (
                  <span className="ml-2 flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-green-900/40 text-green-300">
                    <CheckCircle className="h-3 w-3" />
                    Solution
                  </span>
                )}

                {comment.isEdited && (
                  <span className="ml-2 text-xs text-gray-500 italic">edited</span>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            <CommentContent content={comment.content} images={comment.images} />
          </div>

          <div className="flex items-center gap-4 mt-2 pl-2">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-1 text-xs ${isLiked ? 'text-teal-400' : 'text-gray-400'} hover:text-teal-400 transition-colors`}
            >
              <ThumbsUp className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={handleDislikeToggle}
              className={`flex items-center gap-1 text-xs ${isDisliked ? 'text-gray-400' : 'text-gray-400'} hover:text-gray-600 transition-colors`}
            >
              <ThumbsDown className="h-4 w-4" fill={isDisliked ? "currentColor" : "none"} />
              <span>{dislikeCount}</span>
            </button>

            <button
              onClick={handleReplyClick}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-400 transition-colors"
            >
              <Reply className="h-4 w-4" />
              Reply
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-3 pl-2">
              <CommentForm 
                placeholder={`Reply to ${comment.author.username}...`}
                onSubmit={handleSubmitReply}
                onCancel={handleCancelReply}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;