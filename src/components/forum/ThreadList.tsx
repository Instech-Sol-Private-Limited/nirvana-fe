import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Thread } from '../../types';
import { formatRelativeDate } from '@/utils';
import { FaRegComment, FaRegThumbsUp, FaRegThumbsDown, FaThumbsUp, FaThumbsDown, FaRegHeart, FaHeart } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import ThreadActions from '../threads/ThreadActions';
import AddThreadModal from '../dialogs/AddThreadModal';
import DeleteThreadModal from '../dialogs/DeleteThreadModal';
import { useAuth } from '@/context/AuthProvider';
import UserNameWithBadges from '@/components/common/UsernameWithBadge';
import { applyThreadReaction } from '@/utils/threads';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { TbBulb, TbBulbFilled } from 'react-icons/tb';
import { SiHuggingface } from 'react-icons/si';
import AuthorizationModal from '../dialogs/AuthorizationModal';
interface ThreadListProps {
  threads: Thread[];
  setThreads?: (value: any) => void;
  isLoading?: boolean;
  onNewThread: () => void;
}

const ThreadList: React.FC<ThreadListProps> = ({ threads, setThreads, isLoading = false, onNewThread }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState({});
  const router = useRouter();
  const { userId } = useAuth();

  // const handleApplyReact = async (
  //   threadId: string,
  //   thread: Thread,
  //   type: 'like' | 'dislike' | 'heart' | 'hug' | 'insightful' | null
  // ) => {
  //   if (!setThreads) return;
  //   if (!userId) {
  //     toast.error('accpount is not logged in!');
  //     router.push('/login');
  //   }
  //   setThreads((prev: Thread[]) =>
  //     prev.map((t) => {
  //       if (t.id !== thread.id) return t;

  //       let newReaction: 'like' | 'dislike' | 'heart' | 'hug' | 'insightful' | null = t.user_reaction === type ? null : type;
  //       let totalLikes = t.total_likes;
  //       let totalDislikes = t.total_dislikes;

  //       // Remove previous reaction
  //       if (t.user_reaction === 'like') totalLikes--;
  //       if (t.user_reaction === 'dislike') totalDislikes--;

  //       // Apply new reaction if not null
  //       if (newReaction === 'like') totalLikes++;
  //       if (newReaction === 'dislike') totalDislikes++;

  //       return {
  //         ...t,
  //         user_reaction: newReaction,
  //         total_likes: totalLikes,
  //         total_dislikes: totalDislikes,
  //       };
  //     })
  //   );

  //   await applyThreadReaction(threadId, type);
  // };

  const handleApplyReact = async (
    threadId: string,
    thread: Thread,
    type: 'like' | 'dislike' | 'heart' | 'hug' | 'insightful' | null
  ) => {
    if (!setThreads) return;
    if (!userId) {
      setIsLoginOpen(true);
      return;
    }

    setThreads((prev: Thread[]) =>
      prev.map((t) => {
        if (t.id !== thread.id) return t;

        const newReaction = t.user_reaction === type ? null : type;

        const reactionFields = {
          like: 'total_likes',
          dislike: 'total_dislikes',
          heart: 'total_hearts',
          hug: 'total_hugs',
          insightful: 'total_insightfuls',
        } as const;

        type ReactionType = keyof typeof reactionFields;
        type FieldMap = Record<typeof reactionFields[ReactionType], number>;

        const updatedCounts: FieldMap = {
          total_likes: t.total_likes,
          total_dislikes: t.total_dislikes,
          total_hearts: t.total_hearts,
          total_hugs: t.total_hugs,
          total_insightfuls: t.total_insightfuls,
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

    await applyThreadReaction(threadId, type);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((placeholder) => (
          <div key={placeholder} className="bg-gray-800 rounded-lg p-5 animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              </div>
              <div className="flex-1">
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-800/60 rounded-lg">
        <HiOutlineExclamationCircle className="h-12 w-12 mx-auto text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No threads found</h3>
        <p className="text-gray-400">Be the first to start a discussion</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className="block group cursor-pointer"
          >
            <div className="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition-colors duration-200 border border-gray-700 group-hover:border-gray-600">
              <div className="flex gap-4">
                {/* user avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600">
                    {thread.profiles.avatar_url ? (
                      <Image
                        src={thread.profiles.avatar_url}
                        alt={thread.author_name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
                        {thread.author_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    {/* title */}
                    <Link href={`/threads/${thread.id}`} className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-all duration-300 truncate">
                        {thread.title}
                      </h3>

                      <div className="flex flex-wrap items-center mt-1 text-xs text-gray-400 gap-x-2 gap-y-1">
                        <UserNameWithBadges
                          userId={thread.author_id}
                          username={thread.author_name}
                          className="text-teal-500 font-medium"
                        />
                        <span>•</span>
                        <span>{formatRelativeDate(thread.publish_date)}</span>
                        {thread.category_name && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-700 text-teal-400 text-xs">
                              {thread.category_name}
                            </span>
                          </>
                        )}
                      </div>
                    </Link>

                    <div className="flex items-center gap-3 text-gray-400">
                      {/* Like */}
                      <div
                        className="flex items-center gap-1 text-sm cursor-pointer"
                        onClick={() => handleApplyReact(thread.id, thread, 'like')}
                      >
                        {thread.user_reaction === 'like' ? (
                          <FaThumbsUp className="text-amber-200" />
                        ) : (
                          <FaRegThumbsUp className="text-gray-400" />
                        )}
                        <span>{thread.total_likes || 0}</span>
                      </div>

                      {/* Dislike */}
                      <div
                        className="flex items-center gap-1 text-sm cursor-pointer"
                        onClick={() => handleApplyReact(thread.id, thread, 'dislike')}
                      >
                        {thread.user_reaction === 'dislike' ? (
                          <FaThumbsDown className="text-amber-700" />
                        ) : (
                          <FaRegThumbsDown className="text-gray-400" />
                        )}
                        <span>{thread.total_dislikes || 0}</span>
                      </div>

                      {/* Insightful */}
                      <div
                        className="flex items-center gap-1 text-sm cursor-pointer"
                        onClick={() => handleApplyReact(thread.id, thread, 'insightful')}
                      >
                        {thread.user_reaction === 'insightful' ? (
                          <TbBulbFilled className="text-yellow-500 text-lg" />
                        ) : (
                          <TbBulb className="text-gray-400 text-lg" />
                        )}
                        <span>{thread.total_insightfuls || 0}</span>
                      </div>

                      {/* Heart */}
                      <div
                        className="flex items-center gap-1 text-sm cursor-pointer"
                        onClick={() => handleApplyReact(thread.id, thread, 'heart')}
                      >
                        {thread.user_reaction === 'heart' ? (
                          <FaHeart className="text-pink-500" />
                        ) : (
                          <FaRegHeart className="text-gray-400" />
                        )}
                        <span>{thread.total_hearts || 0}</span>
                      </div>

                      {/* Hug */}
                      <div
                        className="flex items-center gap-1 text-sm cursor-pointer"
                        onClick={() => handleApplyReact(thread.id, thread, 'hug')}
                      >
                        {thread.user_reaction === 'hug' ? (
                          <SiHuggingface className="text-cyan-500" />
                        ) : (
                          <SiHuggingface className="text-gray-400" />
                        )}
                        <span>{thread.total_hugs || 0}</span>
                      </div>

                      {/* comments */}
                      <div className="flex items-center gap-1 text-sm">
                        <FaRegComment className="text-gray-400 cursor-pointer" />
                        <span>{thread.total_comments || 0}</span>
                      </div>

                      {thread.author_id === userId && (
                        <div className="flex items-center gap-1 text-sm pl-3">
                          <ThreadActions
                            targetId="thread-id-123"
                            actions={[
                              {
                                label: "Edit Thread",
                                onClick: () => {
                                  setSelectedThread(thread)
                                  setIsOpen(true);
                                }
                              },
                              {
                                label: "Remove Thread",
                                onClick: () => {
                                  setSelectedThread(thread)
                                  setDeleteOpen(true);
                                }
                              },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Link href={`/threads/${thread.id}`}>
                    {thread.description && (
                      <p className="mt-3 text-sm text-gray-300 line-clamp-2">
                        {thread.description}
                      </p>
                    )}
                  </Link>

                  <Link href={`/threads/${thread.id}`}>
                    {thread.keywords && thread.keywords.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                        {thread.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-gray-700 text-teal-400 hover:bg-gray-600 transition-colors"
                          >
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AuthorizationModal
        isOpen={isLoginOpen}
        setIsOpen={setIsLoginOpen}
      />

      <AddThreadModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onNewThread={onNewThread}
        selectedThread={selectedThread}
      />

      <DeleteThreadModal
        isOpen={deleteOpen}
        setIsOpen={setDeleteOpen}
        onNewThread={onNewThread}
        selectedThread={selectedThread}
      />
    </>
  );
};

export default ThreadList;