'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaRegThumbsUp, FaRegThumbsDown, FaRegComment } from 'react-icons/fa';
import { Thread } from '@/types';
import ThreadActions from '../threads/ThreadActions';
import DeleteThreadModal from '../dialogs/DeleteThreadModal';
import AddThreadModal from '../dialogs/AddThreadModal';

interface ThreadItemProps {
  thread: Thread;
  isCurrentUser: boolean;
  onThreadUpdated?: () => void;
}

const ProfileThreadItem: React.FC<ThreadItemProps> = ({ thread, isCurrentUser, onThreadUpdated }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  const actions = [
    {
      label: 'Edit',
      onClick: () => {
        setSelectedThread(thread);
        setIsEditOpen(true);
      },
    },
    {
      label: 'Delete',
      onClick: () => {
        setIsDeleteOpen(true);
      },
    },
  ];

  const handleThreadClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.thread-actions')) {
      window.location.href = `/threads/${thread.id}`;
    }
  };

  return (
    <>
      <div onClick={handleThreadClick} className="block cursor-pointer">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors hover:shadow-lg">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-white mb-2 hover:text-teal-400 transition-colors">
              {thread.title}
            </h3>

            {isCurrentUser && (
              <div className="thread-actions" onClick={(e) => e.stopPropagation()}>
                <ThreadActions actions={actions} targetType="thread" targetId={thread.id} />
              </div>
            )}
          </div>

          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-700 text-teal-400 hover:bg-gray-600 transition-colors">
              {thread.category_name}
            </span>
          </div>

          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {thread.description}
          </p>

          {thread.imgs && thread.imgs.length > 0 && (
            <div className="flex space-x-2 mb-4">
              {thread.imgs.slice(0, 3).map((img, idx) => (
                <div key={idx} className="w-16 h-16 rounded-md overflow-hidden bg-gray-700">
                  <Image
                    src={img}
                    alt={`Thread image ${idx + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
              {thread.imgs.length > 3 && (
                <div className="w-16 h-16 rounded-md bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">+{thread.imgs.length - 3}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FaRegThumbsUp className="w-3 h-3" />
                {thread.total_likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <FaRegThumbsDown className="w-3 h-3" />
                {thread.total_dislikes || 0}
              </span>
              <span className="flex items-center gap-1">
                <FaRegComment className="w-3 h-3" />
                {thread.total_likes || 0}
              </span>
            </div>

          </div>
        </div>
      </div>

      <DeleteThreadModal
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        selectedThread={thread}
        onNewThread={() => {
          if (onThreadUpdated) onThreadUpdated();
        }}
      />

      <AddThreadModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        selectedThread={selectedThread}
        onNewThread={() => {
          if (onThreadUpdated) onThreadUpdated();
          setIsEditOpen(false);
        }}
      />
    </>
  );
};

export default ProfileThreadItem;