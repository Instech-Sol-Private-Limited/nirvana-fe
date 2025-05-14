// mockData.ts
export interface Author {
  id: string;
  username: string;
  avatar: string | null;
  role?: string;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isAcceptedAnswer?: boolean;
  isEdited?: boolean;
  images?: string[];
  parentId?: string | null;
  threadId: string;
}

export const getMockComments = (threadId: string): Comment[] => {
  return [
    {
      id: 'comment1',
      author: {
        id: 'user1',
        username: 'DevMaster',
        avatar: 'https://avatar.iran.liara.run/public/22',
        role: 'Moderator'
      },
      content: 'This is a really interesting topic! I\'ve been working with Next.js for about 2 years now and have encountered similar issues.',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      likeCount: 15,
      dislikeCount: 2,
      isAcceptedAnswer: true,
      threadId,
      parentId: null,
    },
    {
      id: 'reply1',
      author: {
        id: 'user2',
        username: 'ReactEnthusiast',
        avatar: 'https://avatar.iran.liara.run/public/22'
      },
      content: 'Could you share some examples of how you solved this? I\'m facing the same issue with route handling.',
      createdAt: new Date(Date.now() - 3600000 * 22).toISOString(), // 22 hours ago
      likeCount: 3,
      dislikeCount: 0,
      threadId,
      parentId: 'comment1',
    },
    {
      id: 'reply2',
      author: {
        id: 'user4',
        username: 'TailwindPro',
        avatar: 'https://avatar.iran.liara.run/public/22'
      },
      content: 'I found that using the latest version of Next.js resolves most of these routing issues.',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      likeCount: 7,
      dislikeCount: 1,
      images: ['https://avatar.iran.liara.run/public/22'],
      threadId,
      parentId: 'comment1',
    },
    {
      id: 'reply3',
      author: {
        id: 'user3',
        username: 'CodeWizard',
        avatar: null
      },
      content: 'This is another reply that will only show when we click "View more replies".',
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      likeCount: 1,
      dislikeCount: 0,
      threadId,
      parentId: 'comment1',
    },
    {
      id: 'reply4',
      author: {
        id: 'user5',
        username: 'JSLover',
        avatar: 'https://avatar.iran.liara.run/public/22'
      },
      content: 'One more reply to demonstrate the "View more" functionality.',
      createdAt: new Date(Date.now() - 3600000 * 19).toISOString(),
      likeCount: 2,
      dislikeCount: 0,
      threadId,
      parentId: 'comment1',
    },
    {
      id: 'comment2',
      author: {
        id: 'user5',
        username: 'FullStackDev',
        avatar: 'https://avatar.iran.liara.run/public/22'
      },
      content: 'Have you tried using the new app router in Next.js? It makes handling dynamic routes much easier.',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
      likeCount: 8,
      dislikeCount: 0,
      isEdited: true,
      threadId,
      parentId: null,
    }
  ];
};