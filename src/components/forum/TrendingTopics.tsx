
import React from 'react';
import Link from 'next/link';
import { TagCount } from '@/utils/trending';

interface TrendingTopicsProps {
  tags: TagCount[];
  isLoading?: boolean;
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ tags, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded">
            <div className="bg-gray-800 h-4 w-24 rounded"></div>
            <div className="bg-gray-800 h-3 w-16 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center py-2">
        No trending topics found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tags.map((tag, index) => (
        <Link 
          key={index} 
          href={`/tags/${tag.name}`}
          className="flex items-center justify-between p-2 rounded hover:bg-gray-800"
        >
          <span className="text-teal-500 text-sm">#{tag.name}</span>
          <span className="text-gray-400 text-xs">{tag.count} threads</span>
        </Link>
      ))}
    </div>
  );
};

export default TrendingTopics;