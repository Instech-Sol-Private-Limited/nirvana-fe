// src/components/forum/CategoryFilter.tsx
import React, { useRef } from 'react';
import { Category } from '../../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onToggle: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategories, onToggle }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Scroll the slider left
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Scroll the slider right
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const renderIcon = (category: Category) => {
    switch (category.iconType) {
      case 'cube':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
        );
      case 'stripes':
        return (
          <div className="flex flex-col gap-1">
            <div className="h-1 w-5 bg-current"></div>
            <div className="h-1 w-5 bg-current"></div>
            <div className="h-1 w-5 bg-current"></div>
          </div>
        );
      case 'dots':
        return (
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-current"></div>
            ))}
          </div>
        );
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6 relative">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-lg font-medium">Categories</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={scrollRight}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div 
        ref={sliderRef}
        className="flex overflow-x-auto pb-2 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex space-x-3">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex flex-col items-center p-3 rounded-lg min-w-16 ${
                selectedCategories.includes(category.name) 
                  ? `bg-${category.color}-900 text-${category.color}-500` 
                  : 'bg-gray-800 text-gray-400'
              } hover:bg-gray-700 transition-colors`}
              onClick={() => onToggle(category.name)}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                selectedCategories.includes(category.name) 
                  ? `bg-${category.color}-800` 
                  : 'bg-gray-700'
              } mb-2`}>
                {renderIcon(category)}
              </div>
              <span className="text-xs font-medium truncate max-w-full">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;