'use client';

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { categories, threads, trendingTags } from '../../utils/data';
import CategoryThreads from '../../components/forum/CategoryThreads';
import TrendingTopics from '../../components/forum/TrendingTopics';
import NewThreadCard from '../../components/forum/NewThreadCard';

export default function BrowseThreadsPage() {
  const [maxThreadsPerCategory, setMaxThreadsPerCategory] = useState(5);
  
  return (
    <>
      <Head>
        <title>Browse Threads by Category | Forum</title>
        <meta name="description" content="Browse discussion threads by category" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white border-l-4 border-teal-500 pl-4">
            Browse by Category
          </h1>
          
          <Link 
            href="/threads"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300"
          >
            View All Threads
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            <CategoryThreads 
              categories={categories} 
              threads={threads} 
              maxThreadsPerCategory={maxThreadsPerCategory} 
            />
          </div>
          
          <div className="lg:w-1/4">
            <div className="sticky top-4 space-y-6">
              <NewThreadCard />
              
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-white">Trending Topics</h2>
                  <Link href="/tags" className="text-sm text-teal-500 hover:text-teal-400">
                    View All
                  </Link>
                </div>
                
                <TrendingTopics tags={trendingTags} />
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-lg font-medium text-white mb-4">Categories</h2>
                <div className="space-y-2">
                  {categories.map(category => (
                    <Link 
                      key={category.id} 
                      href={`/categories/${category.slug}`}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-800"
                    >
                      <div className="flex items-center text-white">
                        {category.iconType && (
                          <span className="text-teal-500 mr-2">{category.iconType}</span>
                        )}
                        {category.name}
                      </div>
                      <span className="text-gray-400 text-sm">
                        {threads.filter(t => t.category.id === category.id).length} threads
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}