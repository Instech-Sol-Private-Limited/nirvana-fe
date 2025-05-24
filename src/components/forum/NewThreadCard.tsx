'use client';

import React, { useState } from 'react';
import AddThreadModal from '../dialogs/AddThreadModal';
import PrimaryButton from '../addons/PrimaryButton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

interface NewThreadCardProps {
  onNewThread: () => void;
  userId?: string | null;
}

const NewThreadCard: React.FC<NewThreadCardProps> = ({ onNewThread }) => {
  const { userId } = useAuth()
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!userId) {
    return (
      <div className="relative rounded-lg cursor-pointer overflow-hidden p-6 shadow-lg text-white flex flex-col items-start justify-between bg-gradient-to-tr from-teal-700 to-teal-500 transition-colors duration-500 group">
        {/* hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-800 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

        <div className="relative">
          <h2 className="text-white lg:text-xl md:text-lg text-base font-semibold mb-2">Join the Conversation</h2>
          <p className="text-sm text-purple-100 mb-4">
            Sign in to ask questions, share insights, and connect with the community.
          </p>
          <PrimaryButton
            text="Login to Continue"
            onClick={() => router.push('/login')}
            className="md:!text-sm !text-xs !py-2 !px-4 mt-4"
            center={false}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative rounded-lg cursor-pointer overflow-hidden p-6 shadow-lg text-white flex flex-col items-start justify-between bg-gradient-to-tr from-teal-700 to-teal-500 transition-colors duration-500 group">
        {/* hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-800 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

        <div className="relative ">
          <h2 className="text-white lg:text-xl md:text-lg text-base font-semibold mb-2">Start a Discussion</h2>
          <p className="text-teal-200 md:text-sm text-xs mt-2">
            Have a question or want to share something with the community? Start a new thread to get the conversation going.
          </p>
          <PrimaryButton
            type="submit"
            className="md:!text-sm !text-xs !py-2 !px-4 mt-4"
            onClick={() => setIsOpen(true)}
            text="Create New Thread"
            center={false}
          />
        </div>
      </div>

      <AddThreadModal isOpen={isOpen} setIsOpen={setIsOpen} onNewThread={onNewThread} />
    </>
  );
};

export default NewThreadCard;
