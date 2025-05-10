// src/components/forum/ThreadList.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Thread } from '../../types';
import { formatRelativeDate } from '../../utils';

interface ThreadListProps {
  threads: Thread[];
  isLoading?: boolean;
}

const ThreadList: React.FC<ThreadListProps> = ({ threads, isLoading = false }) => {
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
      <div className="p-8 text-center bg-gray-800 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-medium text-white mb-2">No threads found</h3>
        <p className="text-gray-400">There are no threads available at the moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <Link
          key={thread.id}
          href={`/threads/${thread.id}`}
          className="block"
        >
          <div className="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition-colors duration-200">
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image 
                    src={thread.author.avatar || "/images/avatars/default.png"} 
                    alt={thread.author.username} 
                    width={40} 
                    height={40} 
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white group-hover:text-teal-400">
                      {thread.title}
                    </h3>
                    
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <span>
                        by <span className="text-teal-500">{thread.author.username}</span>
                      </span>
                      <span className="mx-2">•</span>
                      <span>{formatRelativeDate(thread.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span className="text-teal-500">{thread.category.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {thread.viewCount}
                    </div>
                    
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      {thread.replyCount}
                    </div>
                    
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      {thread.likeCount}
                    </div>
                  </div>
                </div>
                
                <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                  {thread.content}
                </p>
                
                <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                  {thread.tags && thread.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs rounded bg-gray-700 text-teal-500 hover:bg-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ThreadList;