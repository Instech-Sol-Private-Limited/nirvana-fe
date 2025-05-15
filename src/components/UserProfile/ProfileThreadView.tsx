'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatRelativeDate } from '@/utils';
import { Thread } from '@/types';
import { getThreadDetails } from '@/utils/threads'; // Reuse the utility function
import {
  FaRegSadTear,
  FaArrowLeft,
  FaThumbtack,
  FaCheck,
  FaRegClock,
  FaRegThumbsUp,
  FaThumbsUp,
  FaThumbsDown,
  FaRegThumbsDown,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
} from 'react-icons/fa';
import Comments from '@/components/comment/Comments';
import CommentInput from '@/components/comment/CommentInput';
import ThreadActions from '@/components/threads/ThreadActions';
import DeleteThreadModal from '@/components/comment/DeleteCommentModal';

interface ProfileThreadViewProps {
  threadId: string;
  onBack: () => void;
  isCurrentUser: boolean;
}

const ProfileThreadView: React.FC<ProfileThreadViewProps> = ({ threadId, onBack, isCurrentUser }) => {
  const [threadData, setThreadData] = useState<Thread | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDisliked, setIsDisliked] = useState(false);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch thread details using the shared utility function
  useEffect(() => {
    const fetchThreadDetails = async () => {
      try {
        const response = await getThreadDetails(threadId);
        if (response.success) {
          setThreadData(response.data.thread);
          setLikeCount(response.data.thread.total_likes || 0);
        }
      } catch (error) {
        console.error('Error fetching thread details:', error);
      }
    };

    if (threadId) {
      fetchThreadDetails();
    }
  }, [threadId]);

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
      if (isDisliked) {
        setDislikeCount(dislikeCount - 1);
        setIsDisliked(false);
      }
    }
    setIsLiked(!isLiked);
  };

  const handleDislikeToggle = () => {
    if (isDisliked) {
      setDislikeCount(dislikeCount - 1);
    } else {
      setDislikeCount(dislikeCount + 1);
      if (isLiked) {
        setLikeCount(likeCount - 1);
        setIsLiked(false);
      }
    }
    setIsDisliked(!isDisliked);
  };

  const handleEditThread = () => {
    window.location.href = `/threads/edit/${threadId}`;
  };

  const handleDeleteThread = async () => {
    try {
      console.log('Deleting thread:', threadId);
      onBack();
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  if (!threadData) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-10">
        <div className="bg-gray-800 rounded-lg p-8 w-full text-center shadow-2xl border border-gray-700">
          <div className="bg-gray-700 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6">
            <FaRegSadTear className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Thread Not Found</h2>
          <p className="text-gray-400 mb-8">The thread you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-900/30"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const threadActions = isCurrentUser
    ? [
        { label: 'Edit Thread', onClick: handleEditThread },
        { label: 'Delete Thread', onClick: () => setShowDeleteModal(true) },
      ]
    : [];

  return (
    <div className="w-full mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-white rounded-lg hover:opacity-60 transition-all"
        >
          <FaArrowLeft className="text-lg" />
        </button>
      </div>

      {threadData && (
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 transition-all hover:shadow-teal-900/10 mb-8">
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-start gap-4">
              <Link href={`/users/${threadData.author_id}`} className="flex-shrink-0 group">
                <div className="w-12 h-12 rounded-full ring-2 ring-gray-700 group-hover:ring-teal-500 transition-all">
                  <Image
                    src={threadData.profiles.avatar_url}
                    alt={threadData.author_name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
              </Link>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold text-white mb-3 leading-tight">{threadData.title}</h1>

                  {isCurrentUser && (
                    <ThreadActions actions={threadActions} targetType="thread" targetId={threadId} />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-gray-700 text-teal-400 hover:bg-gray-600 transition-colors">
                    {threadData.category_name}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-400">
                  <Link href={`/users/${threadData.author_id}`} className="text-teal-400 hover:text-teal-300 font-medium">
                    {threadData.author_name}
                  </Link>
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="flex items-center">
                    <FaRegClock className="h-3 w-3 mr-1 text-gray-500" />
                    {formatRelativeDate(threadData.publish_date)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">{threadData.description}</p>

              {threadData.imgs && threadData.imgs.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {threadData.imgs.map((img, index) => (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer aspect-square"
                    >
                      <Image
                        src={img}
                        alt={`Thread image ${index + 1}`}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {threadData.keywords &&
                threadData.keywords.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tags/${tag}`}
                    className="px-3 py-1 text-xs rounded-full bg-gray-700 text-teal-400 hover:bg-gray-600 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-700 pt-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-2 ${
                    isLiked ? 'text-teal-400' : 'text-gray-400'
                  } hover:text-teal-400 transition-colors`}
                >
                  {isLiked ? (
                    <FaThumbsUp className="h-5 w-5 fill-current" />
                  ) : (
                    <FaRegThumbsUp className="h-5 w-5" />
                  )}
                  <span>{likeCount}</span>
                </button>

                <button
                  onClick={handleDislikeToggle}
                  className={`flex items-center gap-2 ${
                    isDisliked ? 'text-gray-400' : 'text-gray-400'
                  } hover:text-gray-400 transition-colors`}
                >
                  {isDisliked ? (
                    <FaThumbsDown className="h-5 w-5 fill-current" />
                  ) : (
                    <FaRegThumbsDown className="h-5 w-5" />
                  )}
                  <span>{dislikeCount || 0}</span>
                </button>

                <div className="flex items-center gap-2 text-gray-400">
                  <FaRegComment className="h-5 w-5 fill-current" />
                  <span>{threadData.replyCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Comments ({threadData?.replyCount || 0})
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select className="bg-gray-700 text-white text-sm rounded-lg px-3 py-1.5 border border-gray-600 focus:ring-1 focus:ring-teal-500 focus:border-teal-500">
              <option>Most Recent</option>
              <option>Most Liked</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 mb-8 border border-gray-700">
          <CommentInput threadId={threadId} />
        </div>

        <Comments threadId={threadId} />
      </div>

      <DeleteThreadModal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        onConfirm={handleDeleteThread}
      />
    </div>
  );
};

export default ProfileThreadView;