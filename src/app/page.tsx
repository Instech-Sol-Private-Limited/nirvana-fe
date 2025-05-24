'use client';

import { useEffect, useState } from 'react';
import CategoryFilter from '../components/forum/CategoryFilter';
import ThreadList from '../components/forum/ThreadList';
import NewThreadCard from '../components/forum/NewThreadCard';
import TrendingTopics from '../components/forum/TrendingTopics';
import { Thread, ThreadFilter } from '../types';
import { getAllCategories } from '@/utils/categories';
import { getAllThreads } from '@/utils/threads';
import { TagCount, getTrendingTopics } from '@/utils/trending';
import Sticky from 'react-stickynode';

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [trendingTags, setTrendingTags] = useState<TagCount[]>([]);
  const [trendingAllTags, setTrendingAllTags] = useState<TagCount[]>([]);
  const [isViewAll, setIsViewAll] = useState<boolean>(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [threadsLoading, setThreadsLoading] = useState(true);

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
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const isWithinTimeRange = (dateStr: string, range: string) => {
    const now = new Date();
    const date = new Date(dateStr);

    switch (range) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week': {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return date >= oneWeekAgo;
      }
      case 'month': {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return date >= oneMonthAgo;
      }
      case 'year': {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        return date >= oneYearAgo;
      }
      case 'all':
      default:
        return true;
    }
  };

  const filteredThreads = threads
    .filter(thread =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(thread.category_name)
    )
    .filter(thread =>
      isWithinTimeRange(thread.publish_date, filter.timeRange || 'all')
    );

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    switch (filter.sortBy) {
      case 'recent':
        return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
      case 'popular':
        return b.total_likes - a.total_likes;
      default:
        return 0;
    }
  });

  const fetchCategories = async () => {
    const response = await getAllCategories();
    if (response.success) {
      setCategories(response.data);
      setCategoryLoading(false);
    }
  };

  const fetchThreads = async () => {
    const response = await getAllThreads(10, 0);
    if (response.success) {
      setThreads(response.data);
      setThreadsLoading(false);
    }
  };

  const viewAllTrendingTopics = () => {
    setIsViewAll(true);
    setTrendingTags(trendingAllTags);
  };

  const viewLessTrendingTopics = () => {
    setIsViewAll(false);
    setTrendingTags(trendingAllTags.slice(0, 10));
  };

  const fetchTrendingTopics = async () => {
    const response = await getTrendingTopics();
    if (response.success) {
      setTrendingAllTags(response.data);
      setTrendingTags(response.data.slice(0, 10));
    } else {
      console.error('Failed to fetch trending topics:', response.error);
      setTrendingTags([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchThreads();
    fetchTrendingTopics();
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      <div className="w-[calc(100%-320px)] flex-grow">
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onToggle={handleCategoryToggle}
          isLoading={categoryLoading}
        />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Discussion Threads</h2>
          <div className="flex gap-2">
            <select
              className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm outline-none"
              value={filter.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
            </select>
            
            <select
              className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm outline-none"
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

        <ThreadList
          threads={sortedThreads}
          setThreads={setThreads}
          isLoading={threadsLoading}
          onNewThread={fetchThreads}
        />
      </div>

      <div className="w-full md:w-80">
        <NewThreadCard onNewThread={fetchThreads} />

        <Sticky top={52}>
          <div className="mt-6 bg-gray-900 rounded-lg p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">Trending Topics</h2>
              {isViewAll ? (
                <button
                  className="cursor-pointer text-sm text-primary-500 hover:text-primary-400"
                  onClick={viewLessTrendingTopics}
                >
                  View Less
                </button>
              ) : (
                <button
                  className="cursor-pointer text-sm text-primary-500 hover:text-primary-400"
                  onClick={viewAllTrendingTopics}
                >
                  View All
                </button>
              )}
            </div>
            <TrendingTopics tags={trendingTags} />
          </div>
        </Sticky>
      </div>
    </div>
  );
}