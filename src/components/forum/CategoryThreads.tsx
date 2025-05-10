// src/components/forum/CategoryThreads.tsx
import React from 'react';
import Link from 'next/link';
import { Thread, Category } from '../../types';
import ThreadList from './ThreadList';
import { threadApi } from '../../utils/api';

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
  // Group threads by category
  const threadsByCategory = categories.reduce((acc, category) => {
    const categoryThreads = threads
      .filter(thread => thread.category.id === category.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
              href={`/categories/${category.slug}`}
              className="flex items-center space-x-2 group"
            >
              <h2 className="text-xl font-semibold text-white group-hover:text-teal-500">
                {category.name}
              </h2>
              {category.iconType && (
                <span className="text-teal-500">{category.iconType}</span>
              )}
            </Link>
            
            <Link 
              href={`/threads?category=${encodeURIComponent(category.name)}`}
              className="text-sm text-teal-500 hover:text-teal-400"
            >
              View All
            </Link>
          </div>
          
          {/* Using the updated ThreadList component that makes threads clickable */}
          <ThreadList threads={threads} />
          
          {threads.length >= maxThreadsPerCategory && (
            <div className="mt-4 text-center">
              <Link 
                href={`/threads?category=${encodeURIComponent(category.name)}`}
                className="inline-block px-4 py-2 bg-gray-800 text-teal-500 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                View All {category.name} Threads
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryThreads;