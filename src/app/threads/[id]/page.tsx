'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatRelativeDate } from '../../../utils';
import ThreadCreatedNotification from '../../../components/forum/ThreadCreatedNotification';
import { applyThreadReaction, getThreadDetails } from '@/utils/threads';
import { Thread } from '@/types';
import {
  FaRegSadTear,
  FaArrowLeft,
  FaRegClock,
  FaRegThumbsUp,
  FaThumbsUp,
  FaThumbsDown,
  FaRegThumbsDown,
  FaRegComment,
  FaHeart,
  FaRegHeart,
} from 'react-icons/fa';
import Comments from '@/components/comment/Comments';
import UserNameWithBadges
  from '@/components/common/UsernameWithBadge';
import { useAuth } from '@/context/AuthProvider';
import { toast } from 'react-toastify';
import { TbBulb, TbBulbFilled } from 'react-icons/tb';
import { SiHuggingface } from 'react-icons/si';

export default function ThreadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [threadData, setThreadData] = useState<Thread | null>(null);
  const [threadId, setThreadId] = useState<string>('');
  const [showCreatedNotification, setShowCreatedNotification] = useState(false);
  const [threadsStats, setThreadsStats] = useState({ likes: 0, dislikes: 0, comments: 0 })
  const { userId } = useAuth();

  const handleApplyReact = async (
    threadId: string,
    thread: Thread,
    type: 'like' | 'dislike' | 'heart' | 'hug' | 'insightful' | null
  ) => {
    if (!userId) {
      toast.error('Account is not logged in!');
      router.push('/login');
      return;
    }

    setThreadData((prev) => {
      if (!prev || prev.id !== thread.id) return prev;

      const newReaction = prev.user_reaction === type ? null : type;

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
        total_likes: prev.total_likes,
        total_dislikes: prev.total_dislikes,
        total_hearts: prev.total_hearts,
        total_hugs: prev.total_hugs,
        total_insightfuls: prev.total_insightfuls,
      };

      // Decrease previous reaction count
      if (prev.user_reaction) {
        const prevField = reactionFields[prev.user_reaction as ReactionType];
        updatedCounts[prevField] = Math.max(0, updatedCounts[prevField] - 1);
      }

      // Increase new reaction count
      if (newReaction) {
        const newField = reactionFields[newReaction as ReactionType];
        updatedCounts[newField]++;
      }

      return {
        ...prev,
        user_reaction: newReaction,
        ...updatedCounts,
      };
    });

    await applyThreadReaction(threadId, type);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/categories/${slug}`);
  };

  const fetchThreadDetails = async () => {
    if (params && params.id) {
      const response = await getThreadDetails(params.id as string);
      if (response.success) {
        setThreadData(response.data)
        setThreadId(params.id as string);
      }
    }
  }

  useEffect(() => {
    fetchThreadDetails()
  }, [params]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isCreated = searchParams.get('created') === 'true';

    let timer: NodeJS.Timeout;

    if (isCreated) {
      setShowCreatedNotification(true);
      timer = setTimeout(() => {
        setShowCreatedNotification(false);
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (threadData) {
      setThreadsStats(prev => ({
        ...prev,
        likes: threadData.total_likes,
        dislikes: threadData.total_dislikes,
        comments: threadData.total_comments,
      }))
    }
  }, [threadData]);


  if (!threadData && threadId) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-10">
        <div className="bg-gray-800 rounded-lg p-8 w-full text-center shadow-2xl border border-gray-700">
          <div className="bg-gray-700 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6">
            <FaRegSadTear className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Thread Not Found</h2>
          <p className="text-gray-400 mb-8">The thread you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-900/30">
            Back to Forums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-4/5 mx-auto px-4 sm:px-0">
      {showCreatedNotification && <ThreadCreatedNotification />}

      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-white rounded-lg hover:opacity-60 transition-all  "
        >
          <FaArrowLeft className="text-lg" />
        </button>
      </div>

      {threadData ? (
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 transition-all hover:shadow-teal-900/10 mb-8">
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 group">
                <div className="w-12 h-12 rounded-full  ring-2 ring-gray-700 group-hover:ring-teal-500 transition-all overflow-hidden">
                  <Image
                    src={threadData.profiles.avatar_url}
                    alt={threadData.author_name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-3 leading-tight">{threadData.title}</h1>

                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <button
                    onClick={() => handleCategoryClick(threadData.category_name)}
                    className="px-3 py-1 text-xs rounded-full bg-gray-700 text-teal-400 hover:bg-gray-600 transition-colors"
                  >
                    {threadData.category_name}
                  </button>


                </div>

                <div className="flex items-center text-sm text-gray-400">
                  <UserNameWithBadges
                    userId={threadData.author_id}
                    username={threadData.author_name}
                    className="text-teal-400 hover:text-teal-300 font-medium"
                  />


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
                    <div key={index} className="rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer aspect-square">
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
              {threadData.keywords.map((tag, index) => (
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
              <div className="flex items-center gap-3 text-gray-400">
                {/* Like */}
                <div
                  className="flex items-center gap-1 md:text-base text-sm cursor-pointer"
                  onClick={() => handleApplyReact(threadData.id, threadData, 'like')}
                >
                  {threadData.user_reaction === 'like' ? (
                    <FaThumbsUp className="text-amber-200 md:text-lg text-base" />
                  ) : (
                    <FaRegThumbsUp className="text-gray-400 md:text-lg text-base" />
                  )}
                  <span>{threadData.total_likes || 0}</span>
                </div>

                {/* Dislike */}
                <div
                  className="flex items-center gap-1 md:text-base text-sm cursor-pointer"
                  onClick={() => handleApplyReact(threadData.id, threadData, 'dislike')}
                >
                  {threadData.user_reaction === 'dislike' ? (
                    <FaThumbsDown className="text-amber-700 md:text-lg text-base" />
                  ) : (
                    <FaRegThumbsDown className="text-gray-400 md:text-lg text-base" />
                  )}
                  <span>{threadData.total_dislikes || 0}</span>
                </div>

                {/* Insightful */}
                <div
                  className="flex items-center gap-1 md:text-base text-sm cursor-pointer"
                  onClick={() => handleApplyReact(threadData.id, threadData, 'insightful')}
                >
                  {threadData.user_reaction === 'insightful' ? (
                    <TbBulbFilled className="text-yellow-500 md:text-xl text-lg" />
                  ) : (
                    <TbBulb className="text-gray-400 md:text-xl text-lg" />
                  )}
                  <span>{threadData.total_insightfuls || 0}</span>
                </div>

                {/* Heart */}
                <div
                  className="flex items-center gap-1 md:text-base text-sm cursor-pointer"
                  onClick={() => handleApplyReact(threadData.id, threadData, 'heart')}
                >
                  {threadData.user_reaction === 'heart' ? (
                    <FaHeart className="text-pink-500 md:text-lg text-base" />
                  ) : (
                    <FaRegHeart className="text-gray-400 md:text-lg text-base" />
                  )}
                  <span>{threadData.total_hearts || 0}</span>
                </div>

                {/* Hug */}
                <div
                  className="flex items-center gap-1 md:text-base text-sm cursor-pointer"
                  onClick={() => handleApplyReact(threadData.id, threadData, 'hug')}
                >
                  {threadData.user_reaction === 'hug' ? (
                    <SiHuggingface className="text-cyan-500 md:text-lg text-base" />
                  ) : (
                    <SiHuggingface className="text-gray-400 md:text-lg text-base" />
                  )}
                  <span>{threadData.total_hugs || 0}</span>
                </div>

                {/* comments */}
                <div className="flex items-center gap-1 md:text-base text-sm">
                  <FaRegComment className="text-gray-400 cursor-pointer md:text-lg text-base" />
                  <span>{threadData.total_comments || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full mx-auto">
          <div className="animate-pulse bg-gray-800 h-24 rounded-lg mb-4"></div>
          <div className="animate-pulse bg-gray-800 h-64 rounded-lg mb-4"></div>
          <div className="animate-pulse bg-gray-800 h-32 rounded-lg"></div>
        </div>
      )}

      {/* Comments */}
      <Comments threadId={threadId} threadsStats={threadsStats} fetchThreadDetails={fetchThreadDetails} />
    </div>
  );
}