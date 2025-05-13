import React, { useRef, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Category } from '../../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onToggle: (category: string) => void;
  isLoading?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onToggle,
  isLoading = false
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderSkeletons = () => (
    <div className="flex gap-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-20 h-6 rounded-full bg-gray-700 animate-pulse" />
      ))}
    </div>
  );

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      const timer = setTimeout(checkScrollPosition, 100);
      return () => {
        slider.removeEventListener('scroll', checkScrollPosition);
        clearTimeout(timer);
      };
    }
  }, [categories]);

  return (
    <div className="w-full mb-6 relative">
      <h2 className="text-white font-poppins text-lg font-medium mb-3">Categories</h2>

      <div className={`relative ${showLeftArrow ? "px-5" : ""}`}>
        {showLeftArrow && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-full z-10 flex items-center z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-20% from-secondary to-transparent" />
            <button
              onClick={() => scroll('left')}
              className="relative z-20 p-1 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white ml-1"
              aria-label="Scroll left"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
          </div>
        )}

        <div
          ref={sliderRef}
          className="overflow-x-auto py-2 hide-scrollbar scroll-smooth"
        >
          <div className="flex gap-3 px-1">
            {isLoading ? renderSkeletons() : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onToggle(category.category_name)}
                  className={`flex flex-col items-center px-4 py-2 cursor-pointer rounded-full min-w-16 flex-shrink-0 transition-colors ${selectedCategories.includes(category.category_name)
                    ? `bg-gray-600 text-gray-400 hover:bg-gray-600`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                  <span className="text-xs font-medium truncate">
                    {category.category_name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 flex items-center justify-end z-20">
            <div className="absolute inset-0 bg-gradient-to-l from-secondary from-20% to-transparent" />
            <button
              onClick={() => scroll('right')}
              className="relative z-20 p-1 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white mr-1"
              aria-label="Scroll right"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default CategoryFilter;