// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { MessageCircle, ThumbsUp, ThumbsDown, Reply, CheckCircle, X, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';


// interface Author {
//   id: string;
//   username: string;
//   avatar: string | null;
//   role?: string;
// }

// interface Comment {
//   id: string;
//   author: Author;
//   content: string;
//   createdAt: string;
//   likeCount: number;
//   dislikeCount: number;
//   isLiked?: boolean;
//   isDisliked?: boolean;
//   isAcceptedAnswer?: boolean;
//   isEdited?: boolean;
//   images?: string[];
//   replies?: Comment[];
// }

// const CommentItem = ({
//   comment,
//   isNested = false,
//   threadId,
//   onReply
// }: {
//   comment: Comment;
//   isNested?: boolean;
//   threadId: string;
//   onReply: (commentId: string, authorUsername: string) => void;
// }) => {
//   const [isLiked, setIsLiked] = useState(comment.isLiked || false);
//   const [isDisliked, setIsDisliked] = useState(comment.isDisliked || false);
//   const [likeCount, setLikeCount] = useState(comment.likeCount);
//   const [dislikeCount, setDislikeCount] = useState(comment.dislikeCount || 0);
//   const [showReplyForm, setShowReplyForm] = useState(false);
//   const [replyText, setReplyText] = useState('');
//   const [visibleReplies, setVisibleReplies] = useState(2);

//   const handleLikeToggle = () => {
//     if (isLiked) {
//       setLikeCount(likeCount - 1);
//       setIsLiked(false);
//     } else {

//       if (isDisliked) {
//         setDislikeCount(dislikeCount - 1);
//         setIsDisliked(false);
//       }
//       setLikeCount(likeCount + 1);
//       setIsLiked(true);
//     }
//   };

//   const handleDislikeToggle = () => {
//     if (isDisliked) {
//       setDislikeCount(dislikeCount - 1);
//       setIsDisliked(false);
//     } else {

//       if (isLiked) {
//         setLikeCount(likeCount - 1);
//         setIsLiked(false);
//       }
//       setDislikeCount(dislikeCount + 1);
//       setIsDisliked(true);
//     }
//   };

//   const handleReplyClick = () => {
//     setShowReplyForm(!showReplyForm);
//     if (!showReplyForm) {
//       onReply(comment.id, comment.author.username);
//     }
//   };

//   const handleSubmitReply = (e: React.FormEvent) => {
//     e.preventDefault();


//     setReplyText('');
//     setShowReplyForm(false);
//   };

//   const showMoreReplies = () => {
//     if (comment.replies) {
//       setVisibleReplies(comment.replies.length);
//     }
//   };

//   const showLessReplies = () => {
//     setVisibleReplies(2);
//   };

//   const hasMoreRepliesToShow = comment.replies && comment.replies.length > 2 && visibleReplies < comment.replies.length;
//   const hasRepliesToHide = comment.replies && comment.replies.length > 2 && visibleReplies > 2;

//   return (
//     <div className={`${isNested ? 'ml-0 sm:ml-6 pl-3 sm:pl-4 border-l border-gray-700/40' : ''} mb-4`}>
//       <div className="flex gap-3">

//         <Link href={`/users/${comment.author.id}`} className="flex-shrink-0">
//           <div className="w-10 h-10 rounded-full overflow-hidden">
//             <Image
//               src={comment.author.avatar || "https://avatar.iran.liara.run/public/22"}
//               alt={comment.author.username}
//               width={40}
//               height={40}
//               className="object-cover"
//             />
//           </div>
//         </Link>


//         <div className="flex-1">
//           <div className="bg-gray-750 rounded-2xl p-4">

//             <div className="flex items-center justify-between mb-2">
//               <div className="flex items-center">
//                 <Link href={`/users/${comment.author.id}`} className="text-white font-medium hover:text-teal-400 transition-colors">
//                   {comment.author.username}
//                 </Link>

//                 {comment.author.role && (
//                   <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-700 text-teal-400">
//                     {comment.author.role}
//                   </span>
//                 )}

//                 {comment.isAcceptedAnswer && (
//                   <span className="ml-2 flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-green-900/40 text-green-300">
//                     <CheckCircle className="h-3 w-3" />
//                     Solution
//                   </span>
//                 )}

//                 {comment.isEdited && (
//                   <span className="ml-2 text-xs text-gray-500 italic">edited</span>
//                 )}
//               </div>
//               <span className="text-xs text-gray-400">
//                 {new Date(comment.createdAt).toLocaleDateString('en-US', {
//                   day: 'numeric',
//                   month: 'short',
//                   year: 'numeric'
//                 })}
//               </span>
//             </div>


//             <p className="text-gray-300 whitespace-pre-line text-sm">
//               {comment.content}
//             </p>


//             {comment.images && comment.images.length > 0 && (
//               <div
//                 className="mt-1 grid grid-cols-2 gap-1"
//                 style={{ width: '120px', height: '120px' }} // Explicitly set width and height
//               >
//                 {comment.images.map((image, index) => (
//                   <div key={index} className="rounded overflow-hidden">
//                     <Image
//                       src={image}
//                       alt={`Comment image ${index + 1}`}
//                       width={50}
//                       height={50}
//                       className="object-cover w-full h-auto"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>


//           <div className="flex items-center gap-4 mt-2 pl-2">
//             <button
//               onClick={handleLikeToggle}
//               className={`flex items-center gap-1 text-xs ${isLiked ? 'text-teal-400' : 'text-gray-400'} hover:text-teal-400 transition-colors`}
//             >
//               <ThumbsUp className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
//               <span>{likeCount}</span>
//             </button>

//             <button
//               onClick={handleDislikeToggle}
//               className={`flex items-center gap-1 text-xs ${isDisliked ? 'text-gray-400' : 'text-gray-400'} hover:text-gray-600 transition-colors`}
//             >
//               <ThumbsDown className="h-4 w-4" fill={isDisliked ? "currentColor" : "none"} />
//               <span>{dislikeCount}</span>
//             </button>

//             <button
//               onClick={handleReplyClick}
//               className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-400 transition-colors"
//             >
//               <Reply className="h-4 w-4" />
//               Reply
//             </button>
//           </div>


//           {showReplyForm && (
//             <div className="mt-3 pl-2">
//               <form onSubmit={handleSubmitReply}>
//                 <textarea
//                   value={replyText}
//                   onChange={(e) => setReplyText(e.target.value)}
//                   placeholder={`Reply to ${comment.author.username}...`}
//                   className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
//                   rows={3}
//                 ></textarea>

//                 <div className="mt-2 flex items-center justify-end gap-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowReplyForm(false);
//                       setReplyText('');
//                     }}
//                     className="px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={!replyText.trim()}
//                     className="px-4 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}


//           {comment.replies && comment.replies.length > 0 && !isNested && (
//             <div className="mt-4">
//               {comment.replies.slice(0, visibleReplies).map(reply => (
//                 <CommentItem
//                   key={reply.id}
//                   comment={reply}
//                   isNested={true}
//                   threadId={threadId}
//                   onReply={onReply}
//                 />
//               ))}


//               {hasMoreRepliesToShow && (
//                 <button
//                   onClick={showMoreReplies}
//                   className="mt-2 ml-6 flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors"
//                 >
//                   <ChevronDown className="h-4 w-4" />
//                   View {comment.replies.length - visibleReplies} more {comment.replies.length - visibleReplies === 1 ? 'reply' : 'replies'}
//                 </button>
//               )}

//               {hasRepliesToHide && (
//                 <button
//                   onClick={showLessReplies}
//                   className="mt-2 ml-6 flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors"
//                 >
//                   <ChevronUp className="h-4 w-4" />
//                   View less
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


// const getMockComments = (threadId: string): Comment[] => {
//   return [
//     {
//       id: 'comment1',
//       author: {
//         id: 'user1',
//         username: 'DevMaster',
//         avatar: 'https://avatar.iran.liara.run/public/22',
//         role: 'Moderator'
//       },
//       content: 'This is a really interesting topic! I\'ve been working with Next.js for about 2 years now and have encountered similar issues.',
//       createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
//       likeCount: 15,
//       dislikeCount: 2,
//       isAcceptedAnswer: true,
//       replies: [
//         {
//           id: 'reply1',
//           author: {
//             id: 'user2',
//             username: 'ReactEnthusiast',
//             avatar: 'https://avatar.iran.liara.run/public/22'
//           },
//           content: 'Could you share some examples of how you solved this? I\'m facing the same issue with route handling.',
//           createdAt: new Date(Date.now() - 3600000 * 22).toISOString(), // 22 hours ago
//           likeCount: 3,
//           dislikeCount: 0,
//           replies: []
//         },
//         {
//           id: 'reply2',
//           author: {
//             id: 'user4',
//             username: 'TailwindPro',
//             avatar: 'https://avatar.iran.liara.run/public/22'
//           },
//           content: 'I found that using the latest version of Next.js resolves most of these routing issues.',
//           createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
//           likeCount: 7,
//           dislikeCount: 1,
//           images: ['https://avatar.iran.liara.run/public/22']
//         },
//         {
//           id: 'reply3',
//           author: {
//             id: 'user3',
//             username: 'CodeWizard',
//             avatar: ''
//           },
//           content: 'This is another reply that will only show when we click "View more replies".',
//           createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
//           likeCount: 1,
//           dislikeCount: 0
//         },
//         {
//           id: 'reply4',
//           author: {
//             id: 'user5',
//             username: 'JSLover',
//             avatar: 'https://avatar.iran.liara.run/public/22'
//           },
//           content: 'One more reply to demonstrate the "View more" functionality.',
//           createdAt: new Date(Date.now() - 3600000 * 19).toISOString(),
//           likeCount: 2,
//           dislikeCount: 0
//         }
//       ]
//     },
//     {
//       id: 'comment2',
//       author: {
//         id: 'user5',
//         username: 'FullStackDev',
//         avatar: 'https://avatar.iran.liara.run/public/22'
//       },
//       content: 'Have you tried using the new app router in Next.js? It makes handling dynamic routes much easier.',
//       createdAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
//       likeCount: 8,
//       dislikeCount: 0,
//       isEdited: true,
//       replies: []
//     }
//   ];
// };

// export default function UnifiedComments({ threadId }: { threadId: string }) {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
//   const [replyToUsername, setReplyToUsername] = useState<string | null>(null);


//   useState(() => {
//     setComments(getMockComments(threadId));
//   });

//   const handleReplyToComment = (commentId: string, authorUsername: string) => {
//     setActiveReplyId(commentId);
//     setReplyToUsername(authorUsername);
//   };

//   if (comments.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-10 bg-gray-800 rounded-xl border border-gray-700">
//         <div className="bg-gray-700 rounded-full p-3 mb-4">
//           <MessageCircle className="h-6 w-6 text-gray-400" />
//         </div>
//         <p className="text-gray-400 text-center">No comments yet.</p>
//         <p className="text-gray-500 text-sm text-center mt-1">Be the first to start the conversation!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {comments.map(comment => (
//         <CommentItem
//           key={comment.id}
//           comment={comment}
//           threadId={threadId}
//           onReply={handleReplyToComment}
//         />
//       ))}
//     </div>
//   );
// }