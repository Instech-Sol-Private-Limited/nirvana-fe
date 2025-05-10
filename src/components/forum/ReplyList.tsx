// src/components/forum/ReplyList.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { replies, currentUser } from '../../utils/data';
import { formatRelativeDate } from '../../utils';

interface ReplyListProps {
  threadId: string;
}

const ReplyList: React.FC<ReplyListProps> = ({ threadId }) => {
  // Get replies for this thread
  const threadReplies = replies.filter(reply => reply.threadId === threadId);
  
  if (threadReplies.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="text-lg font-medium text-white mb-2">No replies yet</h3>
        <p className="text-gray-400">Be the first to reply to this thread</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {threadReplies.map((reply) => {
        const [isLiked, setIsLiked] = useState(reply.likedByCurrentUser || false);
        const [likeCount, setLikeCount] = useState(reply.likeCount);
        
        const handleLikeToggle = () => {
          if (isLiked) {
            setLikeCount(likeCount - 1);
          } else {
            setLikeCount(likeCount + 1);
          }
          setIsLiked(!isLiked);
        };
        
        return (
          <div 
            key={reply.id} 
            className={`bg-gray-800 rounded-lg overflow-hidden shadow border border-gray-700 ${
              reply.isSolution ? 'border-l-4 border-green-500' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image 
                      src={reply.author.avatar || "/images/avatars/default.png"} 
                      alt={reply.author.username} 
                      width={40} 
                      height={40}
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Link href={`/users/${reply.author.id}`} className="font-medium text-teal-500 hover:text-teal-400">
                        {reply.author.username}
                      </Link>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-sm text-gray-400">{formatRelativeDate(reply.createdAt)}</span>
                      
                      {reply.author.role && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-gray-700 text-teal-400 rounded">
                          {reply.author.role}
                        </span>
                      )}
                      
                      {reply.isSolution && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-green-900 text-green-300 rounded flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Solution
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {reply.isEdited && (
                        <span className="text-xs text-gray-500 italic">edited</span>
                      )}
                      
                      {(currentUser.id === reply.author.id || currentUser.isAdmin) && (
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 hover:text-teal-500 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-500 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-gray-300 whitespace-pre-line">
                    {reply.content}
                  </div>
                  
                  {/* Reply Images, if any */}
                  {reply.images && reply.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {reply.images.map((image, index) => (
                        <div key={index} className="rounded overflow-hidden">
                          <Image 
                            src={image} 
                            alt={`Reply image ${index + 1}`} 
                            width={300} 
                            height={200}
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={handleLikeToggle}
                      className={`flex items-center space-x-1 ${isLiked ? 'text-teal-500' : 'text-gray-400'} hover:text-teal-500`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>{likeCount}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-teal-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span>Reply</span>
                    </button>
                    
                    {currentUser.isAdmin && !reply.isSolution && (
                      <button className="flex items-center space-x-1 text-gray-400 hover:text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Mark as Solution</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReplyList;