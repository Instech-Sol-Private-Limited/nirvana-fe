'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const NewThreadCard: React.FC = () => {
  const router = useRouter();

  return (
    <div className="bg-teal-600 rounded-lg p-5">
      <h2 className="text-white text-lg font-medium">Start a Discussion</h2>
      <p className="text-teal-200 text-sm mt-2">
        Have a question or want to share something with the community? Start a new thread to get the conversation going.
      </p>
      
      <button
        onClick={() => router.push('/threads/new')}
        className="mt-4 inline-block bg-white text-teal-700 font-medium py-2 px-4 rounded hover:bg-teal-50 transition-colors"
      >
        Create New Thread
      </button>
    </div>
  );
};

export default NewThreadCard;
