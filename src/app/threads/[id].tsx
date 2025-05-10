// src/pages/threads/[id].tsx
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { 
  getThreadById, 
  getCommentsForThread,
  createComment,
  toggleThreadLike,
  toggleCommentLike,
  toggleCommentDislike,
  markAsAcceptedAnswer,
  formatDate, 
  formatRelativeDate
} from '../../utils';
import { threads, comments as allComments, currentUser } from '../../utils/data';
import { Comment as CommentType } from '../../types';

const ThreadDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // This would typically be fetched from an API, but for this example we'll use the client-side data
  const thread = getThreadById(id as string);
  const [comments, setComments] = useState<CommentType[]>(
    getCommentsForThread(id as string)
  );
  
  if (!thread) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-white">Thread not found</h1>
          <p className="mt-4 text-gray-400">The thread you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="mt-6 inline-block bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }
  
  const handleCommentSubmit = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    const commentData = {
      threadId: thread.id,
      content: newComment,
      author: currentUser,
      parentId,
      replies: []
    };
    
    const newCommentObj = createComment(commentData);
    
    // Update local state
    if (parentId) {
      // Find the parent comment and add the reply
      const updatedComments = comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newCommentObj]
          };
        }
        return comment;
      });
      setComments(updatedComments);
    } else {
      // Add as a top-level comment
      setComments([...comments, newCommentObj]);
    }
    
    setNewComment('');
    setReplyingTo(null);
    setCommenting(false);
  };
  
  const handleLikeThread = () => {
    toggleThreadLike(thread.id, currentUser.id);
    // Update local state
    thread.likeCount += 1;
  };
  
  const handleLikeComment = (commentId: string) => {
    toggleCommentLike(commentId, currentUser.id);
    
    // Update local state
    const updateCommentLikes = (cmts: CommentType[]): CommentType[] => {
      return cmts.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likeCount: comment.likeCount + 1 };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { 
            ...comment, 
            replies: updateCommentLikes(comment.replies) 
          };
        }
        return comment;
      });
    };
    
    setComments(updateCommentLikes(comments));
  };
  
  const handleDislikeComment = (commentId: string) => {
    toggleCommentDislike(commentId, currentUser.id);
    
    // Update local state
    const updateCommentDislikes = (cmts: CommentType[]): CommentType[] => {
      return cmts.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, dislikeCount: comment.dislikeCount + 1 };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { 
            ...comment, 
            replies: updateCommentDislikes(comment.replies) 
          };
        }
        return comment;
      });
    };
    
    setComments(updateCommentDislikes(comments));
  };
  
  const handleAcceptAnswer = (commentId: string) => {
    markAsAcceptedAnswer(commentId, thread.id);
    
    // Update local state
    const updateAcceptedAnswer = (cmts: CommentType[]): CommentType[] => {
      return cmts.map(comment => ({
        ...comment,
        isAcceptedAnswer: comment.id === commentId,
        replies: comment.replies ? updateAcceptedAnswer(comment.replies) : []
      }));
    };
    
    setComments(updateAcceptedAnswer(comments));
  };
  
  const renderComment = (comment: CommentType) => {
    return (
      <div 
        key={comment.id} 
        className={`bg-gray-800 rounded-lg p-5 ${comment.isAcceptedAnswer ? 'border-l-4 border-green-500' : ''}`}
      >
        <div className="flex">
          <div className="flex-shrink-0 mr-4">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image 
                src={comment.author.avatar || "/images/avatars/default.png"} 
                alt={comment.author.username} 
                width={40} 
                height={40} 
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <Link
                    href={`/users/${comment.author.id}`}
                    className="font-medium text-teal-500 hover:text-teal-400"
                  >
                    {comment.author.username}
                  </Link>
                  {comment.isAcceptedAnswer && (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-900 text-green-300 rounded">
                      Accepted Solution
                    </span>
                  )}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatRelativeDate(comment.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-gray-300">
              {comment.content}
            </div>
            
            <div className="mt-4 flex items-center space-x-4">
              <button 
                onClick={() => handleLikeComment(comment.id)}
                className="flex items-center text-gray-400 hover:text-teal-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                {comment.likeCount}
              </button>
              
              <button 
                onClick={() => handleDislikeComment(comment.id)}
                className="flex items-center text-gray-400 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13v-9m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
                {comment.dislikeCount}
              </button>
              
              <button 
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center text-gray-400 hover:text-teal-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reply
              </button>
              
              {/* Only thread author can mark a solution as accepted */}
              {currentUser.id === thread.author.id && !comment.isAcceptedAnswer && (
                <button 
                  onClick={() => handleAcceptAnswer(comment.id)}
                  className="flex items-center text-gray-400 hover:text-green-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as Solution
                </button>
              )}
            </div>
            
            {/* Reply form */}
            {replyingTo === comment.id && (
              <div className="mt-4">
                <form onSubmit={(e) => handleCommentSubmit(e, comment.id)}>
                  <textarea
                    className="w-full p-3 bg-gray-700 text-white rounded resize-none"
                    rows={3}
                    placeholder="Write your reply..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="px-4 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-teal-600 text-white rounded hover:bg-teal-700"
                    >
                      Post Reply
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 pl-4 border-l border-gray-700">
                {comment.replies.map(reply => renderComment(reply))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>{thread.title} | Forum</title>
        <meta name="description" content={`${thread.content.substring(0, 160)}...`} />
      </Head>

      <Layout>
        <div className="mb-6">
          <Link href="/" className="flex items-center text-teal-500 hover:text-teal-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to threads
          </Link>
        </div>
        
        {/* Thread */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-white">{thread.title}</h1>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                {thread.category.name}
              </span>
              {thread.isSticky && (
                <span className="px-3 py-1 bg-teal-900 text-teal-300 rounded text-sm">
                  Pinned
                </span>
              )}
              {thread.isClosed && (
                <span className="px-3 py-1 bg-red-900 text-red-300 rounded text-sm">
                  Closed
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <div className="flex-shrink-0 mr-3">
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
            <div>
              <Link
                href={`/users/${thread.author.id}`}
                className="font-medium text-teal-500 hover:text-teal-400"
              >
                {thread.author.username}
              </Link>
              <div className="text-sm text-gray-400">
                Posted on {formatDate(thread.createdAt)}
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-gray-300">
            {thread.content}
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            {thread.tags.map((tag, index) => (
              <Link 
                key={index} 
                href={`/tags/${tag}`} 
                className="px-3 py-1 text-sm rounded bg-gray-700 text-teal-500 hover:bg-gray-600"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-gray-400">{thread.viewCount} views</span>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-gray-400">{thread.replyCount} replies</span>
              </div>
              
              <button 
                onClick={handleLikeThread}
                className="flex items-center text-gray-400 hover:text-teal-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>{thread.likeCount} likes</span>
              </button>
            </div>
            
            <button 
              onClick={() => setCommenting(!commenting)}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
            >
              Reply to Thread
            </button>
          </div>
        </div>
        
        {/* Comment form */}
        {commenting && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-medium text-white mb-4">Add Your Reply</h2>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                className="w-full p-3 bg-gray-700 text-white rounded resize-none"
                rows={5}
                placeholder="Write your reply..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCommenting(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Post Reply
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Comments */}
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-white">
            {comments.length} {comments.length === 1 ? 'Reply' : 'Replies'}
          </h2>
          
          {comments.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400">No replies yet. Be the first to reply!</p>
            </div>
          ) : (
            comments.map(comment => renderComment(comment))
          )}
        </div>
      </Layout>
    </>
  );
};

export default ThreadDetailPage;