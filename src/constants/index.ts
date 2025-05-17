
import {
    Notification,
} from '@/types';


// Sample Notifications
export const notifications: Notification[] = [
    {
        id: '1',
        userId: '1',
        type: 'reply',
        content: 'Jason replied to your thread "Best practices for React hooks in 2025"',
        isRead: false,
        createdAt: '2025-04-28T15:12:00Z',
        relatedThreadId: '1',
        relatedCommentId: '1',
        relatedUserId: '4'
    },
    {
        id: '2',
        userId: '1',
        type: 'like',
        content: 'Sarah liked your thread "Best practices for React hooks in 2025"',
        isRead: true,
        createdAt: '2025-04-28T15:30:00Z',
        relatedThreadId: '1',
        relatedUserId: '2'
    },
    {
        id: '3',
        userId: '2',
        type: 'mention',
        content: 'Mike mentioned you in a comment',
        isRead: false,
        createdAt: '2025-05-03T10:08:00Z',
        relatedThreadId: '3',
        relatedCommentId: '5',
        relatedUserId: '3'
    }
];

// Sample trending tags
export const trendingTags = [
    { name: 'React', count: 128 },
    { name: 'Next.js', count: 97 },
    { name: 'TypeScript', count: 86 },
    { name: 'Tailwind', count: 72 },
    { name: 'Performance', count: 63 },
    { name: 'Node.js', count: 54 },
    { name: 'Authentication', count: 48 },
    { name: 'API', count: 41 }
];
