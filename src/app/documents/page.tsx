'use client';

import Link from 'next/link';
import { useState } from 'react';
import { categories, currentUser } from '../../utils/data';

interface Document {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: any;
  category: any;
  tags: string[];
}

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: 'd1',
    title: 'Getting Started with React',
    description: 'A comprehensive guide for beginners to learn React',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    downloadCount: 342,
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-15'),
    author: currentUser,
    category: categories.find(cat => cat.id === 'technology'),
    tags: ['React', 'JavaScript', 'Frontend']
  },
  {
    id: 'd2',
    title: 'UI Design Principles',
    description: 'Learn the fundamentals of good UI design',
    fileType: 'PDF',
    fileSize: '3.8 MB',
    downloadCount: 218,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05'),
    author: currentUser,
    category: categories.find(cat => cat.id === 'design'),
    tags: ['Design', 'UI', 'UX']
  },
  {
    id: 'd3',
    title: 'NextJS Project Structure',
    description: 'Best practices for organizing your NextJS projects',
    fileType: 'DOCX',
    fileSize: '1.2 MB',
    downloadCount: 156,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-12'),
    author: currentUser,
    category: categories.find(cat => cat.id === 'technology'),
    tags: ['NextJS', 'JavaScript', 'Project Management']
  }
];

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Filter documents by category and search query
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesCategory = selectedCategory ? doc.category?.id === selectedCategory : true;
    const matchesSearch = searchQuery.trim() === '' ? true : 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'oldest':
        return a.createdAt.getTime() - b.createdAt.getTime();
      case 'popular':
        return b.downloadCount - a.downloadCount;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <text x="8" y="18" fontSize="6" fill="currentColor">PDF</text>
          </svg>
        );
      case 'docx':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <text x="8" y="18" fontSize="6" fill="currentColor">DOC</text>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
    }
  };

  // Format date as "Month Day, Year"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Documents</h1>
        <Link 
          href="/documents/upload" 
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Document
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="flex-1 mb-4 md:mb-0">
            <label htmlFor="search" className="sr-only">Search documents</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div>
              <label htmlFor="category" className="sr-only">Filter by category</label>
              <select
                id="category"
                className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="sort" className="sr-only">Sort by</label>
              <select
                id="sort"
                className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Downloads</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Documents list */}
      {sortedDocuments.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-medium text-white mb-2">No documents found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedDocuments.map(doc => (
            <div key={doc.id} className="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition-colors">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {getFileIcon(doc.fileType)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/documents/${doc.id}`} className="text-lg font-medium text-teal-500 hover:text-teal-400">
                        {doc.title}
                      </Link>
                      <div className="mt-1 text-sm text-gray-400">
                        Uploaded by <Link href={`/users/${doc.author.id}`} className="text-teal-500 hover:text-teal-400">
                          {doc.author.username}
                        </Link> on {formatDate(doc.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="px-3 py-1 mr-2 text-xs rounded bg-gray-700 text-gray-300">
                        {doc.fileType}
                      </span>
                      <span className="px-3 py-1 text-xs rounded bg-gray-700 text-gray-300">
                        {doc.fileSize}
                      </span>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-gray-300">
                    {doc.description}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {doc.tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        href={`/tags/${tag}`} 
                        className="px-2 py-1 text-xs rounded bg-gray-700 text-teal-500 hover:bg-gray-600"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>{doc.downloadCount} downloads</span>
                    </div>
                    
                    <Link 
                      href={`/documents/${doc.id}/download`}
                      className="px-4 py-2 bg-teal-600 text-white text-sm rounded hover:bg-teal-700 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}