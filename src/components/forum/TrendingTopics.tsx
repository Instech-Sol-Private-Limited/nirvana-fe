// src/components/forum/TrendingTopics.tsx
import React from 'react';
import Link from 'next/link';

interface Tag {
  name: string;
  count: number;
}

interface TrendingTopicsProps {
  tags: Tag[];
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ tags }) => {
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