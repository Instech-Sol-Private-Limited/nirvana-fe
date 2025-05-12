'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { threads, categories } from '@/constants';
import { formatRelativeDate } from '../../../utils';
import NestedComments from '../../../components/forum/NestedComments';
import ReplyForm from '../../../components/forum/ReplyForm';
import ThreadCreatedNotification from '../../../components/forum/ThreadCreatedNotification';
import { getThreadDetails } from '@/utils/threads';
import { Thread } from '@/types';
import {
  FaRegSadTear,
  FaChevronRight,
  FaThumbtack,
  FaCheck,
  FaRegClock,
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegThumbsDown,
  FaRegComment,
  FaRegEye,
  FaRegBookmark,
  FaBookmark,
  FaShare,
  FaTwitter,
  FaFacebookF,
  FaLink
} from 'react-icons/fa';

export default function ThreadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [threadData, setThreadData] = useState<Thread | null>(null);
  const [threadId, setThreadId] = useState<string>('');
  const [showCreatedNotification, setShowCreatedNotification] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShareToggle = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/categories/${slug}`);
  };

  useEffect(() => {
    const fetchThreadDetails = async () => {
      if (params && params.id) {
        const response = await getThreadDetails(params.id as string);
        if (response.success) {
          console.log(response.data.thread)
          setThreadData(response.data.thread)
          setThreadId(params.id as string);
        }
      }
    }
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
      setLikeCount(threadData.total_likes);
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

      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center text-sm">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          Home
        </Link>
        <FaChevronRight className="h-3 w-3 mx-2 text-gray-600" />
        <button
          onClick={() => handleCategoryClick(threadData?.category_name || "")}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {threadData?.category_name}
        </button>
        <FaChevronRight className="h-3 w-3 mx-2 text-gray-600" />
        <span className="text-white font-medium truncate">{threadData?.title}</span>
      </nav>

      {/* Thread Card */}
      {threadData ? (
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 transition-all hover:shadow-teal-900/10 mb-8">
          {/* Thread Header */}
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-start gap-4">
              <Link href={`/users/${threadData.author_id}`} className="flex-shrink-0 group">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-700 group-hover:ring-teal-500 transition-all">
                  <Image
                    src={threadData.profiles.avatar_url}
                    alt={threadData.author_name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
              </Link>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-3 leading-tight">{threadData.title}</h1>

                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <button
                    onClick={() => handleCategoryClick(threadData.category_name)}
                    className="px-3 py-1 text-xs rounded-full bg-gray-700 text-teal-400 hover:bg-gray-600 transition-colors"
                  >
                    {threadData.category_name}
                  </button>

                  {/* {threadData.isSticky && (
                    <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-teal-900/50 text-teal-300">
                      <FaThumbtack className="h-3 w-3" />
                      Pinned
                    </span>
                  )} */}

                  {/* {threadData.isSolved && (
                    <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-green-900/50 text-green-300">
                      <FaCheck className="h-3 w-3" />
                      Solved
                    </span>
                  )} */}
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

          {/* Thread Content */}
          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">{threadData.description}</p>

              {/* If thread has images, show them in a better grid */}
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

            {/* Tags */}
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

            {/* Actions Bar */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-700 pt-4">
              {/* Left actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors ${isLiked ? 'text-teal-400' : 'text-gray-400'}`}
                >
                  {isLiked ? (
                    <FaThumbsUp className="h-5 w-5" />
                  ) : (
                    <FaRegThumbsUp className="h-5 w-5" />
                  )}
                  <span>{likeCount}</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors">
                  <FaRegThumbsDown className="h-5 w-5" />
                  <span>{threadData.total_dislikes || 0}</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors">
                  <FaRegComment className="h-5 w-5" />
                  <span>{threadData.replyCount}</span>
                </button>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBookmarkToggle}
                  className={`flex items-center justify-center p-2 rounded-lg hover:bg-gray-700/50 transition-colors ${isBookmarked ? 'text-teal-400' : 'text-gray-400'}`}
                >
                  {isBookmarked ? (
                    <FaBookmark className="h-5 w-5" />
                  ) : (
                    <FaRegBookmark className="h-5 w-5" />
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={handleShareToggle}
                    className="flex items-center justify-center p-2 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors"
                  >
                    <FaShare className="h-5 w-5" />
                  </button>

                  {showShareOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-10 overflow-hidden">
                      <div className="py-1">
                        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left text-gray-300 hover:bg-gray-700 transition-colors">
                          <FaTwitter className="h-5 w-5 text-blue-500" />
                          Twitter
                        </button>
                        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left text-gray-300 hover:bg-gray-700 transition-colors">
                          <FaFacebookF className="h-5 w-5 text-blue-600" />
                          Facebook
                        </button>
                        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left text-gray-300 hover:bg-gray-700 transition-colors">
                          <FaLink className="h-5 w-5 text-teal-500" />
                          Copy Link
                        </button>
                      </div>
                    </div>
                  )}
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


      {/* Replies/Comments Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Comments ({threadData?.replyCount})
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

        {/* New Reply Form */}
        <div className="bg-gray-800 rounded-xl p-4 mb-8 border border-gray-700">
          <ReplyForm threadId={threadId} />
        </div>

        {/* Nested Comments Component */}
        <NestedComments threadId={threadId} />
      </div>
    </div>
  );
}