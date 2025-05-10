'use client';

import { useState } from 'react';
import CategoryFilter from '../components/forum/CategoryFilter';
import ThreadList from '../components/forum/ThreadList';
import NewThreadCard from '../components/forum/NewThreadCard';
import TrendingTopics from '../components/forum/TrendingTopics';
import { categories, threads, trendingTags } from '../utils/data';
import { ThreadFilter } from '../types';

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['React', 'Next.js']);
  const [filter, setFilter] = useState<ThreadFilter>({
    sortBy: 'recent',
    timeRange: 'all'
  });

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
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <CategoryFilter 
          categories={categories}
          selectedCategories={selectedCategories}
          onToggle={handleCategoryToggle}
        />
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Discussion Threads</h2>
          <div className="flex gap-2">
            <select 
              className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm"
              value={filter.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="unanswered">Unanswered</option>
              <option value="solved">Solved</option>
            </select>
            <select 
              className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm"
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
        
        {/* Using the updated ThreadList component that makes threads clickable */}
        <ThreadList threads={sortedThreads} />
      </div>
      
      <div className="w-full lg:w-80">
        <NewThreadCard />
        
        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Trending Topics</h2>
            <a href="#" className="text-sm text-primary-500 hover:text-primary-400">View All</a>
          </div>
          
          <TrendingTopics tags={trendingTags} />
        </div>
      </div>
    </div>
  );
}