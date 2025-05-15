
import {
    User,
    Thread,
    Comment,
    Category,
    Notification,
    Reply
} from '@/types';

// Sample Users
export const users: User[] = [
    {
        id: '1',
        username: 'alex_dev',
        email: 'alex@example.com',
        avatar: '/images/avatars/avatar1.png',
        bio: 'Full-stack developer specializing in React and Node.js',
        joinedDate: '2023-01-15',
        postCount: 142,
        reputation: 3240,
        isAdmin: false
    },
    {
        id: '2',
        username: 'sarah_design',
        email: 'sarah@example.com',
        avatar: '/images/avatars/avatar2.png',
        bio: 'UI/UX designer with 5+ years of experience',
        joinedDate: '2023-03-22',
        postCount: 78,
        reputation: 1980,
        isAdmin: false
    },
    {
        id: '3',
        username: 'mike_code',
        email: 'mike@example.com',
        avatar: '/images/avatars/avatar3.png',
        bio: 'Python enthusiast and machine learning practitioner',
        joinedDate: '2023-02-08',
        postCount: 103,
        reputation: 2450,
        isAdmin: false
    },
    {
        id: '4',
        username: 'jason_admin',
        email: 'jason@example.com',
        avatar: '/images/avatars/avatar4.png',
        bio: 'Forum administrator and React expert',
        joinedDate: '2022-11-05',
        postCount: 321,
        reputation: 4870,
        isAdmin: true
    },
    {
        id: '5',
        username: 'emma_frontend',
        email: 'emma@example.com',
        avatar: '/images/avatars/avatar5.png',
        bio: 'Frontend developer focusing on accessibility',
        joinedDate: '2023-04-12',
        postCount: 56,
        reputation: 1250,
        isAdmin: false
    }
];

export const replies: Reply[] = [
    {
        id: '1',
        threadId: '1',
        content: 'I\'ve been using hooks extensively for the past year and completely agree with the separation of concerns approach. Custom hooks have made our codebase much more maintainable.',
        author: users[3], // jason_admin
        createdAt: '2025-04-28T15:12:00Z',
        likeCount: 14,
        dislikeCount: 0,
        likedByCurrentUser: false,
        isEdited: false,
        isSolution: true,
        images: []
    },
    {
        id: '2',
        threadId: '1',
        content: 'Have you tried the new React compiler with hooks? The performance improvements are incredible. I was skeptical at first but the benchmarks don\'t lie.',
        author: users[1], // sarah_design
        createdAt: '2025-04-28T16:45:00Z',
        likeCount: 8,
        dislikeCount: 1,
        likedByCurrentUser: true,
        isEdited: true,
        isSolution: false,
        images: []
    },
    {
        id: '3',
        threadId: '2',
        content: 'We migrated a large CRA app to Next.js last month. The biggest challenges were:\n\n1. Routing differences - we had to completely rethink our routing strategy\n2. Data fetching patterns - moving from client-side only to SSR/ISR\n3. API integration - we rebuilt our API layer to take advantage of Next.js API routes\n\nOverall, it was worth it though. The performance improvements alone justified the effort.',
        author: users[0], // alex_dev
        createdAt: '2025-05-01T11:08:00Z',
        likeCount: 19,
        dislikeCount: 0,
        likedByCurrentUser: false,
        isEdited: false,
        isSolution: true,
        images: [
            '/images/reply-images/nextjs-migration-diagram.png'
        ]
    },
    {
        id: '4',
        threadId: '3',
        content: 'TypeScript\'s utility types are amazing. I use `Partial<Type>` and `Pick<Type, Keys>` constantly, but don\'t sleep on `Omit<Type, Keys>` and `Required<Type>` either. They can be real lifesavers.',
        author: users[4], // emma_frontend
        createdAt: '2025-05-03T09:21:00Z',
        likeCount: 23,
        dislikeCount: 0,
        likedByCurrentUser: false,
        isEdited: false,
        isSolution: false,
        images: []
    },
    {
        id: '5',
        threadId: '4',
        content: 'For dark mode with Tailwind and Next.js, I recommend using the `next-themes` package. It handles all the complexity of theme switching, local storage persistence, and system preference detection.\n\nHere\'s a quick example:\n\n```jsx\n// _app.tsx\nimport { ThemeProvider } from \'next-themes\';\n\nfunction MyApp({ Component, pageProps }) {\n  return (\n    <ThemeProvider attribute="class">\n      <Component {...pageProps} />\n    </ThemeProvider>\n  );\n}\n```\n\nThen in your components:\n\n```jsx\nimport { useTheme } from \'next-themes\';\n\nconst ThemeToggle = () => {\n  const { theme, setTheme } = useTheme();\n  \n  return (\n    <button onClick={() => setTheme(theme === \'dark\' ? \'light\' : \'dark\')}>\n      Toggle theme\n    </button>\n  );\n};\n```',
        author: users[2], // mike_code
        createdAt: '2025-05-05T17:30:00Z',
        likeCount: 16,
        dislikeCount: 0,
        likedByCurrentUser: true,
        isEdited: false,
        isSolution: true,
        images: []
    },
    {
        id: '6',
        threadId: '5',
        content: 'For Node.js performance tuning, we\'ve had great success with:\n\n1. Implementing proper caching strategies - Redis has been a game changer\n2. Using worker threads for CPU-intensive tasks\n3. Optimizing database queries and connection pooling\n4. Setting up proper logging and monitoring (we use Datadog)\n5. Horizontal scaling behind a load balancer\n\nWe went from handling ~500 req/s to over 5000 req/s with these improvements.',
        author: users[3], // jason_admin
        createdAt: '2025-05-02T13:25:00Z',
        likeCount: 27,
        dislikeCount: 1,
        likedByCurrentUser: false,
        isEdited: false,
        isSolution: false,
        images: [
            '/images/reply-images/performance-graph.png',
            '/images/reply-images/architecture-diagram.png'
        ]
    }
];
// Sample Categories
export const categories= [
    {
        id: '1',
        name: 'React',
        slug: 'react',
        description: 'Discussions about React.js library and ecosystem',
        threadCount: 256,
        iconType: 'cube',
        color: 'blue'
    },
    {
        id: '2',
        name: 'Next.js',
        slug: 'nextjs',
        description: 'Next.js framework help and tutorials',
        threadCount: 184,
        iconType: 'dots',
        color: 'black'
    },
    {
        id: '3',
        name: 'TypeScript',
        slug: 'typescript',
        description: 'TypeScript language discussions and help',
        threadCount: 149,
        iconType: 'stripes',
        color: 'blue'
    },
    {
        id: '4',
        name: 'UI/UX',
        slug: 'ui-ux',
        description: 'User interface and experience design topics',
        threadCount: 97,
        iconType: 'dots',
        color: 'purple'
    },
    {
        id: '5',
        name: 'Node.js',
        slug: 'nodejs',
        description: 'Server-side JavaScript with Node.js',
        threadCount: 135,
        iconType: 'cube',
        color: 'green'
    },
    {
        id: '6',
        name: 'General',
        slug: 'general',
        description: 'General programming discussions',
        threadCount: 218,
        iconType: 'document',
        color: 'gray'
    }
];

// Sample Threads
export const threads = [
    {
        id: '1',
        title: 'Best practices for React hooks in 2025',
        content: 'I\'ve been working with React hooks for a while now and wanted to share some best practices I\'ve learned. What are your thoughts on custom hooks vs HOCs in 2025?',
        author: users[0],
        category: categories[0],
        tags: ['React', 'Hooks', 'Frontend', 'Best Practices'],
        createdAt: '2025-04-28T14:35:00Z',
        updatedAt: '2025-04-28T14:35:00Z',
        viewCount: 342,
        replyCount: 18,
        likeCount: 56,
        isSticky: true,
        isClosed: false,
        isSolved: false,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT94qzalt0oBHgnnyEqdBK5XFDZIp3nW2Cxcg&s'],
        lastActivity: '2025-05-06T09:12:00Z'
    },
    {
        id: '2',
        title: 'Migrating from Create React App to Next.js',
        content: 'Our team is looking to migrate a large CRA application to Next.js. Has anyone done this recently? Any tips or gotchas to watch out for?',
        author: users[2],
        category: categories[1],
        tags: ['Next.js', 'Migration', 'CRA', 'React'],
        createdAt: '2025-05-01T10:22:00Z',
        updatedAt: '2025-05-01T10:22:00Z',
        viewCount: 187,
        replyCount: 12,
        likeCount: 31,
        isSticky: false,
        isClosed: false,
        isSolved: false,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT94qzalt0oBHgnnyEqdBK5XFDZIp3nW2Cxcg&s'],
        lastActivity: '2025-05-07T16:45:00Z'
    },
    {
        id: '3',
        title: 'TypeScript utility types you should know',
        content: 'I\'ve compiled a list of TypeScript utility types that have saved me tons of time. Let\'s discuss which ones you find most useful!',
        author: users[1],
        category: categories[2],
        tags: ['TypeScript', 'Utility Types', 'Development'],
        createdAt: '2025-05-03T08:15:00Z',
        updatedAt: '2025-05-03T09:30:00Z',
        viewCount: 274,
        replyCount: 24,
        likeCount: 87,
        isSticky: false,
        isClosed: false,
        isSolved: true,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT94qzalt0oBHgnnyEqdBK5XFDZIp3nW2Cxcg&s'],
        lastActivity: '2025-05-08T11:20:00Z'
    },
    {
        id: '4',
        title: 'Implementing dark mode in Next.js with Tailwind',
        content: 'Looking for some guidance on implementing a dark mode toggle in a Next.js app using Tailwind CSS. What\'s the best approach in 2025?',
        author: users[4],
        category: categories[1],
        tags: ['Next.js', 'Tailwind', 'Dark Mode', 'CSS'],
        createdAt: '2025-05-05T16:40:00Z',
        updatedAt: '2025-05-05T16:40:00Z',
        viewCount: 156,
        replyCount: 9,
        likeCount: 28,
        isSticky: false,
        isSolved: true,
        isClosed: false,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT94qzalt0oBHgnnyEqdBK5XFDZIp3nW2Cxcg&s'],
        lastActivity: '2025-05-07T20:18:00Z'
    },
    {
        id: '5',
        title: 'Node.js performance tuning for high-traffic APIs',
        content: 'Our API is starting to get some serious traffic and we\'re seeing performance issues. What strategies have worked for you to scale a Node.js API?',
        author: users[3],
        category: categories[4],
        tags: ['Node.js', 'Performance', 'Scaling', 'API'],
        createdAt: '2025-05-02T11:08:00Z',
        updatedAt: '2025-05-02T11:08:00Z',
        viewCount: 312,
        replyCount: 17,
        likeCount: 42,
        isSticky: false,
        isSolved: false,
        isClosed: false,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT94qzalt0oBHgnnyEqdBK5XFDZIp3nW2Cxcg&s'],
        lastActivity: '2025-05-08T07:33:00Z'
    }
];

// Sample Comments
export const comments: Comment[] = [
    {
        id: '1',
        threadId: '1',
        content: 'Great post! I\'ve found that custom hooks provide much better reusability than HOCs in most cases. Especially with the new React compiler, they\'re even more efficient.',
        author: users[3],
        createdAt: '2025-04-28T15:12:00Z',
        likeCount: 14,
        dislikeCount: 0,
        isAcceptedAnswer: true,
        replies: []
    },
    {
        id: '2',
        threadId: '1',
        content: 'I agree with @jason_admin. Custom hooks have been game-changers for our codebase. We\'ve cut down so much boilerplate.',
        author: users[1],
        createdAt: '2025-04-28T16:45:00Z',
        likeCount: 8,
        dislikeCount: 1,
        isAcceptedAnswer: false,
        replies: []
    },
    {
        id: '3',
        threadId: '2',
        content: 'We recently migrated from CRA to Next.js. The biggest challenges were around routing and server-side data fetching patterns. Happy to share more details if you\'re interested.',
        author: users[0],
        createdAt: '2025-05-01T11:08:00Z',
        likeCount: 19,
        dislikeCount: 0,
        isAcceptedAnswer: true,
        replies: [
            {
                id: '4',
                threadId: '2',
                parentId: '3',
                content: 'I\'d love to hear more about how you handled authentication during the migration. That\'s our biggest concern.',
                author: users[2],
                createdAt: '2025-05-01T12:32:00Z',
                likeCount: 5,
                dislikeCount: 0,
                isAcceptedAnswer: false,
                replies: []
            }
        ]
    },
    {
        id: '5',
        threadId: '3',
        content: 'Partial<Type> and Pick<Type, Keys> are my two favorite utility types. They\'ve saved me so much time when working with complex interfaces.',
        author: users[4],
        createdAt: '2025-05-03T09:21:00Z',
        likeCount: 23,
        dislikeCount: 0,
        isAcceptedAnswer: false,
        replies: []
    }
];

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

export const currentUser = users[0];