// src/components/forum/CategoryThreads.tsx
import React from 'react';
import Link from 'next/link';
import { Thread, Category } from '../../types';
import ThreadList from './ThreadList';


interface CategoryThreadsProps {
    categories: Category[];
    threads: Thread[];
    maxThreadsPerCategory?: number;
}

const CategoryThreads: React.FC<CategoryThreadsProps> = ({
    categories,
    threads,
    maxThreadsPerCategory = 3
}) => {
    const threadsByCategory = categories.reduce((acc, category) => {
        const categoryThreads = threads
            .filter(thread => thread.category_id === category.id)
            .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
            .slice(0, maxThreadsPerCategory);

        if (categoryThreads.length > 0) {
            acc[category.id] = {
                category,
                threads: categoryThreads
            };
        }

        return acc;
    }, {} as Record<string, { category: Category, threads: Thread[] }>);

    return (
        <div className="space-y-12">
            {Object.values(threadsByCategory).map(({ category, threads }) => (
                <div key={category.id} className="category-section">
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href={`/categories/${category.category_slug}`}
                            className="flex items-center space-x-2 group"
                        >
                            <h2 className="text-xl font-semibold text-white group-hover:text-teal-500">
                                {category.category_name}
                            </h2>
                            {/* {category.iconType && (
                <span className="text-teal-500">{category.iconType}</span>
              )} */}
                        </Link>

                        <Link
                            href={`/threads?category=${encodeURIComponent(category.category_name)}`}
                            className="text-sm text-teal-500 hover:text-teal-400"
                        >
                            View All
                        </Link>
                    </div>


                    <ThreadList threads={threads} onNewThread={() => undefined} />

                    {threads.length >= maxThreadsPerCategory && (
                        <div className="mt-4 text-center">
                            <Link
                                href={`/threads?category=${encodeURIComponent(category.category_name)}`}
                                className="inline-block px-4 py-2 bg-gray-800 text-teal-500 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                            >
                                View All {category.category_name} Threads
                            </Link>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CategoryThreads;