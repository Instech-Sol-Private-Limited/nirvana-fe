'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatRelativeDate } from '../../utils';

// Define types for our comments
interface Author {
  id: string;
  username: string;
  avatar: string;
  role?: string;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
  likeCount: number;
  isAcceptedAnswer?: boolean;
  replies?: Comment[];
}

const CommentItem = ({ 
  comment, 
  level = 0,
  threadId, 
  onReply 
}: { 
  comment: Comment; 
  level?: number;
  threadId: string;
  onReply: (commentId: string) => void;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showMore, setShowMore] = useState(false);
  
  // Maximum nesting level before "Show more" button appears
  const MAX_NESTING_LEVEL = 4;
  
  const handleLikeToggle = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
    if (!showReplyForm) {
      onReply(comment.id);
    }
  };
  
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally submit the reply to your backend
    console.log(`Replying to comment ${comment.id}: ${replyText}`);
    
    // Reset form
    setReplyText('');
    setShowReplyForm(false);
  };

  return (
    <div className={`${level > 0 ? 'ml-0 sm:ml-6 pl-3 sm:pl-4 border-l border-gray-700' : ''}`}>
      <div className="flex gap-3 mb-4">
        {/* Author Avatar */}
        <Link href={`/users/${comment.author.id}`} className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image 
              src={comment.author.avatar || "/images/avatars/default.png"} 
              alt={comment.author.username} 
              width={40} 
              height={40}
              className="object-cover"
            />
          </div>
        </Link>
        
        {/* Comment Content */}
        <div className="flex-1">
          <div className="bg-gray-750 rounded-2xl p-4">
            {/* Author Info */}
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Solution
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{formatRelativeDate(comment.createdAt)}</span>
            </div>
            
            {/* Comment Text */}
            <p className="text-gray-300 whitespace-pre-line text-sm">
              {comment.content}
            </p>
          </div>
          
          {/* Comment Actions */}
          <div className="flex items-center gap-4 mt-2 pl-2">
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center gap-1 text-xs ${isLiked ? 'text-teal-400' : 'text-gray-400'} hover:text-teal-400 transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{likeCount}</span>
            </button>
            
            <button 
              onClick={handleReplyClick}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>
          </div>
          
          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3 pl-2">
              <form onSubmit={handleSubmitReply}>
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  rows={3}
                ></textarea>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-4 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {level < MAX_NESTING_LEVEL ? (
                comment.replies.map(reply => (
                  <CommentItem 
                    key={reply.id} 
                    comment={reply} 
                    level={level + 1}
                    threadId={threadId}
                    onReply={onReply}
                  />
                ))
              ) : (
                <>
                  {!showMore ? (
                    <button 
                      onClick={() => setShowMore(true)}
                      className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors ml-3 mb-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Show {comment.replies.length} more {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                  ) : (
                    <>
                      {comment.replies.map(reply => (
                        <CommentItem 
                          key={reply.id} 
                          comment={reply} 
                          level={level + 1}
                          threadId={threadId}
                          onReply={onReply}
                        />
                      ))}
                      <button 
                        onClick={() => setShowMore(false)}
                        className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors ml-3 mt-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Hide replies
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock data - replace with your actual data fetching logic
const getMockComments = (threadId: string): Comment[] => {
  return [
    {
      id: 'comment1',
      author: {
        id: 'user1',
        username: 'DevMaster',
        avatar: '/images/avatars/default.png',
        role: 'Moderator'
      },
      content: 'This is a really interesting topic! Ive been working with Next.js for about 2 years now and have encountered similar issues.',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      likeCount: 15,
      isAcceptedAnswer: true,
      replies: [
        {
          id: 'reply1',
          author: {
            id: 'user2',
            username: 'ReactEnthusiast',
            avatar: '/images/avatars/default.png'
          },
          content: 'Could you share some examples of how you solved this? Im facing the same issue with route handling.',
          createdAt: new Date(Date.now() - 3600000 * 22).toISOString(), // 22 hours ago
          likeCount: 3,
          replies: [
            {
              id: 'reply1-1',
              author: {
                id: 'user1',
                username: 'DevMaster',
                avatar: '/images/avatars/default.png',
                role: 'Moderator'
              },
              content: 'Sure! The key is to make sure your dynamic routes are properly configured in your Next.js app. Heres what worked for me:\n\n1. Make sure youre using the correct file structure\n2. Ensure params are properly typed\n3. Check that your navigation is using the correct paths',
              createdAt: new Date(Date.now() - 3600000 * 20).toISOString(), // 20 hours ago
              likeCount: 7,
              replies: [
                {
                  id: 'reply1-1-1',
                  author: {
                    id: 'user2',
                    username: 'ReactEnthusiast',
                    avatar: '/images/avatars/default.png'
                  },
                  content: 'That makes sense. Ill try implementing these changes and see if it resolves the issue. Thanks!',
                  createdAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
                  likeCount: 2,
                  replies: [
                    {
                      id: 'reply1-1-1-1',
                      author: {
                        id: 'user3',
                        username: 'NextjsNewbie',
                        avatar: '/images/avatars/default.png'
                      },
                      content: 'I was having the same problem and this thread really helped me! For anyone else struggling, double check your import statements too.',
                      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
                      likeCount: 4,
                      replies: [
                        {
                          id: 'reply-deep',
                          author: {
                            id: 'user4',
                            username: 'CodeWizard',
                            avatar: '/images/avatars/default.png'
                          },
                          content: 'Another tip: make sure youre using the latest Next.js version as some routing behavior changed in recent updates.',
                          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(), // 6 hours ago
                          likeCount: 1
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'comment2',
      author: {
        id: 'user5',
        username: 'TailwindPro',
        avatar: '/images/avatars/default.png'
      },
      content: 'For the UI issues you mentioned, I recommend using Tailwinds group hover classes to create more responsive interaction states. That would make your buttons and links feel more modern.',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
      likeCount: 8,
      replies: []
    },
    {
      id: 'comment3',
      author: {
        id: 'user6',
        username: 'FullStackDev',
        avatar: '/images/avatars/default.png'
      },
      content: 'Have you tried using the next/navigation hooks properly? It sounds like your routing issue might be related to how youre handling the navigation between pages.',
      createdAt: new Date(Date.now() - 3600000 * 10).toISOString(), // 10 hours ago
      likeCount: 5,
      replies: []
    }
  ];
};

export default function NestedComments({ threadId }: { threadId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  
  // Fetch comments (in real app, this would be an API call)
  useState(() => {
    setComments(getMockComments(threadId));
  });
  
  const handleReplyToComment = (commentId: string) => {
    setActiveReplyId(commentId);
  };

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-gray-800 rounded-xl border border-gray-700">
        <div className="bg-gray-700 rounded-full p-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <p className="text-gray-400 text-center">No comments yet.</p>
        <p className="text-gray-500 text-sm text-center mt-1">Be the first to start the conversation!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <CommentItem 
          key={comment.id} 
          comment={comment} 
          threadId={threadId}
          onReply={handleReplyToComment}
        />
      ))}
    </div>
  );
}