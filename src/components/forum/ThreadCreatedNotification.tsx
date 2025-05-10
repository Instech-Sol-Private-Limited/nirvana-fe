'use client';

import { useState, useEffect } from 'react';

export default function ThreadCreatedNotification() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Set timeout to auto-hide after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // Animation duration
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-6 right-6 z-50 max-w-md transform transition-all duration-300 ${
        isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className="bg-teal-900/90 border border-teal-700 rounded-xl shadow-xl backdrop-blur-sm p-4 flex items-start gap-3">
        <div className="bg-teal-700/80 rounded-full p-2 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-teal-100 font-medium">Thread Created</h3>
          <p className="text-teal-300 text-sm mt-1">Your thread has been successfully posted and is now available for the community to view.</p>
        </div>
        
        <button 
          onClick={handleClose}
          className="text-teal-300 hover:text-white p-1 rounded-full hover:bg-teal-800/30 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}