'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Reply, CheckCircle } from 'lucide-react';
import CommentAuthor from './CommentAuthor';
import CommentForm from './CommentForm';
import CommentContent from './CommentContent';
import ThreadActions from '@/components/threads/ThreadActions';
import CommentEditForm from './CommentEditForm';
import DeleteCommentModal from '../dialogs/DeleteCommentModal';
import { useAuth } from '@/context/AuthProvider';
import { addReply } from '@/utils/threads';
import { toast } from 'react-toastify';
import { uploadToSupabase } from '@/utils/supabsethreadbucket';
import UserNameWithBadges from '../common/UsernameWithBadge';
import { Comment, Reply as Replys } from '@/types';

export interface Author {
  id: string;
  username: string;
  avatar: string | null;
  role?: string;
}

interface CommentItemProps {
  comment: Comment | any;
  type: "reply" | "comment";
  reply_to?: string;
  parentId: string;
  handleApplyReact: (parentId: string, comment: Comment, type: 'like' | 'dislike') => Promise<void> | any;
  fetchReplies: (parentId: string) => void;
  onUpdate: (data: { comment_id: string; content: string; imgs?: (string | undefined)[] }) => Promise<any>;
  onDelete?: (commentId: string) => void;
}

const CommentItem = ({
  comment,
  type = "comment",
  parentId,
  handleApplyReact,
  reply_to,
  fetchReplies,
  onUpdate,
  onDelete,
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { userId } = useAuth();
  const isAuthor = userId === comment.user_id;

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
  };

  const handleSubmitReply = async (text: string) => {
    try {
      setReplySubmitting(true);

      const response = await addReply({
        comment_id: parentId,
        content: text,
      });

      if (response.success) {
        fetchReplies(parentId);
        toast.success(response.data.message)
        setShowReplyForm(false);
      } else {
        console.error('Failed to add reply:', response.message);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmitEdit = async ({
    content,
    images,
    previews
  }: {
    content: string;
    images: File[];
    previews: string[];
  }) => {
    try {
      const imageUrls = await Promise.all(
        previews?.map(async (preview, index) => {
          if (preview.startsWith('http')) {
            return preview;
          } else {
            const file = images[index]
            const url = await uploadToSupabase(file);
            return url;
          }
        })
      );

      const updatedCommentValues = {
        comment_id: comment.id,
        content,
        imgs: imageUrls ? imageUrls : [],
      };

      const response = await onUpdate(updatedCommentValues);
      if (response.success) {
        toast.success('Comment updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update comment.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteComment = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(comment.id);
    }
    setShowDeleteModal(false);
  };

  return (
    <div className={`${type === "reply" ? 'ml-0 sm:ml-12 pl-5 sm:pl-4 border-l-2 border-teal-500' : ''} mb-4`}>
      <div className="flex gap-3">
        <div className="flex-1">
          {isEditing ? (
            <CommentEditForm
              initialContent={comment.content}
              type={"reply"}
              placeholder={`Reply to ${comment.user_name}...`}
              initialImages={comment.imgs}
              onSubmit={handleSubmitEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <div className={`bg-gray-750 rounded-2xl p-4 border ${type === "reply" ? 'border-white/10' : 'bg-white/5 border-transparent'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <CommentAuthor author={{ avatar: comment.profiles?.avatar_url, username: comment.user_name }} />
                  <div className="flex-grow flex items-center gap-3">
                    <UserNameWithBadges
                      userId={comment.user_id}
                      username={comment.user_name}
                      className="text-white hover:text-teal-400 transition-colors"
                    />

                    {type !== "reply" && comment.is_solution && (
                      <span className="ml-2 flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-green-900/40 text-green-300">
                        <CheckCircle className="h-3 w-3" />
                        Solution
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-xs text-gray-400 mr-2">
                    {new Date(comment.created_at).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>

                  {isAuthor && (
                    <ThreadActions
                      targetType={type}
                      targetId={comment.id}
                      actions={[
                        { label: 'Edit', onClick: handleEditComment },
                        { label: 'Delete', onClick: handleDeleteComment },
                      ]}
                    />
                  )}
                </div>
              </div>

              <div className="pl-8">
                <CommentContent content={comment.content} images={type === "reply" ? undefined : comment.imgs} />

                <div className="w-full flex items-center gap-4 mt-5 pl-2">
                  <button
                    onClick={() => handleApplyReact(comment.id, comment, 'like')}
                    className={`flex items-center gap-1 text-xs ${comment.user_reaction === 'like' ? 'text-teal-400' : 'text-gray-400'} hover:text-teal-400 transition-colors`}
                  >
                    <ThumbsUp className="h-4 w-4" fill={comment.user_reaction === 'like' ? 'currentColor' : 'none'} />
                    <span>{comment.total_likes}</span>
                  </button>

                  <button
                    onClick={() => handleApplyReact(comment.id, comment, 'dislike')}
                    className={`flex items-center gap-1 text-xs ${comment.user_reaction === 'dislike' ? 'text-gray-400' : 'text-gray-400'} hover:text-gray-600 transition-colors`}
                  >
                    <ThumbsDown className="h-4 w-4" fill={comment.user_reaction === 'dislike' ? 'currentColor' : 'none'} />
                    <span>{comment.total_dislikes}</span>
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
                      reply_to={reply_to}
                      placeholder={`Reply to ${reply_to ? reply_to : comment.user_name}...`}
                      onSubmit={handleSubmitReply}
                      onCancel={handleCancelReply}
                      isSubmitting={replySubmitting}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteCommentModal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CommentItem;
