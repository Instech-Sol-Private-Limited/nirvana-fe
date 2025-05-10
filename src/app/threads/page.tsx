'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import CategoryFilter from '../../components/forum/CategoryFilter';
import ThreadList from '../../components/forum/ThreadList';
import { categories, threads } from '../../utils/data';
import { ThreadFilter } from '../../types';
import ThreadCreatedNotification from '../../components/forum/ThreadCreatedNotification';

export default function AllThreadsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams ? searchParams.get('category') : null;
  const threadCreated = searchParams?.get('created') === 'true';
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  
  const [filter, setFilter] = useState<ThreadFilter>({
    sortBy: 'recent',
    timeRange: 'all'
  });
  
  const [showCreatedNotification, setShowCreatedNotification] = useState(threadCreated);

  // Update selected categories when URL param changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);
  
  // Handle thread created notification
  useEffect(() => {
    if (threadCreated) {
      setShowCreatedNotification(true);
      
      // Remove notification after 5 seconds
      const timer = setTimeout(() => {
        setShowCreatedNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [threadCreated]);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleFilterChange = (newFilter: Partial<ThreadFilter>) => {
    setFilter({ ...filter, ...newFilter });
  };

  // Apply filters to threads
  const filteredThreads = threads.filter(thread => 
    selectedCategories.length === 0 || selectedCategories.includes(thread.category.name)
  );

  // Sort threads based on filter
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    switch (filter.sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.viewCount - a.viewCount;
      case 'unanswered':
        return a.replyCount - b.replyCount;
      case 'solved':
        return Number(b.isSolved) - Number(a.isSolved);
      default:
        return 0;
    }
  });

  return (
    <>
      <Head>
        <title>All Threads | Forum</title>
        <meta name="description" content="Browse all discussion threads" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {showCreatedNotification && <ThreadCreatedNotification />}
        
        <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-teal-500 pl-4">
          All Threads
        </h1>
        
        {/* Category filter at the top as a slider */}
        <div className="mb-8">
          <CategoryFilter 
            categories={categories}
            selectedCategories={selectedCategories}
            onToggle={handleCategoryToggle}
          />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-300">
            {sortedThreads.length} thread{sortedThreads.length !== 1 ? 's' : ''} found
          </div>
          
          <div className="flex gap-2">
            <select 
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
              value={filter.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="unanswered">Unanswered</option>
              <option value="solved">Solved</option>
            </select>
            
            <select 
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
              value={filter.timeRange}
              onChange={(e) => handleFilterChange({ timeRange: e.target.value as any })}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
        
        {sortedThreads.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">No Threads Found</h2>
            <p className="text-gray-400">
              {selectedCategories.length > 0 
                ? "There are no threads in the selected categories." 
                : "There are no threads available."}
            </p>
          </div>
        ) : (
          <ThreadList threads={sortedThreads} />
        )}
      </div>
    </>
  );
}