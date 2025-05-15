'use client';


import { FaUser, FaComment, FaCheckCircle, FaBookmark } from 'react-icons/fa';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'threads', label: 'Threads', icon: <FaUser className="w-4 h-4" /> },
    { id: 'comments', label: 'Comments', icon: <FaComment className="w-4 h-4" /> },
    { id: 'solved', label: 'Solved', icon: <FaCheckCircle className="w-4 h-4" /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <FaBookmark className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 mb-6 overflow-x-auto">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center px-4 py-3 min-w-[120px] text-center justify-center gap-2 transition-colors ${
              activeTab === tab.id
                ? 'text-teal-400 border-b-2 border-teal-500'
                : 'text-gray-400 hover:text-white border-b-2 border-transparent'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;