'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { threads, categories } from '../../../utils/data';
import { formatRelativeDate } from '../../../utils';
import NestedComments from '../../../components/forum/NestedComments';
import ReplyForm from '../../../components/forum/ReplyForm';
import ThreadCreatedNotification from '../../../components/forum/ThreadCreatedNotification';

export default function ThreadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [threadId, setThreadId] = useState<string>('');
  const [showCreatedNotification, setShowCreatedNotification] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  
  useEffect(() => {
    if (params && params.id) {
      setThreadId(params.id as string);
    }
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
  
 
  const thread = threads.find(t => t.id === threadId);
  
 
  useEffect(() => {
    if (thread) {
      setLikeCount(thread.likeCount);
    }
  }, [thread]);

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
  
  if (!thread && threadId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full text-center shadow-2xl border border-gray-700">
          <div className="bg-gray-700 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
  
  if (!thread) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse bg-gray-800 h-24 rounded-lg mb-4"></div>
        <div className="animate-pulse bg-gray-800 h-64 rounded-lg mb-4"></div>
        <div className="animate-pulse bg-gray-800 h-32 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {showCreatedNotification && <ThreadCreatedNotification />}
      
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center text-sm">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          Home
        </Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <button 
          onClick={() => handleCategoryClick(thread.category.slug)} 
          className="text-gray-400 hover:text-white transition-colors"
        >
          {thread.category.name}
        </button>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white font-medium truncate">{thread.title}</span>
      </nav>
      
      {/* Thread Card */}
      <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 transition-all hover:shadow-teal-900/10 mb-8">
        {/* Thread Header */}
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-start gap-4">
            <Link href={`/users/${thread.author.id}`} className="flex-shrink-0 group">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-700 group-hover:ring-teal-500 transition-all">
                <Image 
                  src={thread.author.avatar || "/images/avatars/default.png"} 
                  alt={thread.author.username} 
                  width={48} 
                  height={48}
                  className="object-cover"
                />
              </div>
            </Link>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-3 leading-tight">{thread.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <button 
                  onClick={() => handleCategoryClick(thread.category.slug)} 
                  className="px-3 py-1 text-xs rounded-full bg-gray-700 text-teal-400 hover:bg-gray-600 transition-colors"
                >
                  {thread.category.name}
                </button>
                
                {thread.isSticky && (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-teal-900/50 text-teal-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Pinned
                  </span>
                )}
                
                {thread.isSolved && (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-green-900/50 text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Solved
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-sm text-gray-400">
                <Link href={`/users/${thread.author.id}`} className="text-teal-400 hover:text-teal-300 font-medium">
                  {thread.author.username}
                </Link>
                <span className="mx-2 text-gray-600">•</span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatRelativeDate(thread.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Thread Content */}
        <div className="p-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{thread.content}</p>
            
            {/* If thread has images, show them in a better grid */}
            {thread.images && thread.images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                {thread.images.map((img, index) => (
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
            {thread.tags.map((tag, index) => (
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>{likeCount}</span>
              </button>
              
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>{thread.replyCount}</span>
              </button>
              
              <div className="flex items-center gap-2 px-3 py-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{thread.viewCount}</span>
              </div>
            </div>
            
            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBookmarkToggle}
                className={`flex items-center justify-center p-2 rounded-lg hover:bg-gray-700/50 transition-colors ${isBookmarked ? 'text-teal-400' : 'text-gray-400'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              
              <div className="relative">
                <button 
                  onClick={handleShareToggle}
                  className="flex items-center justify-center p-2 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                
                {showShareOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-10 overflow-hidden">
                    <div className="py-1">
                      <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left text-gray-300 hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                        Twitter
                      </button>
                      <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left text-gray-300 hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                        Facebook
                      </button>
                      <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left text-gray-300 hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
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
      
      {/* Replies/Comments Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Comments ({thread.replyCount})
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
          <ReplyForm threadId={thread.id} />
        </div>
        
        {/* Nested Comments Component */}
        <NestedComments threadId={thread.id} />
      </div>
    </div>
  );
}