'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';


const UserProfile = dynamic(() => import('@/components/UserProfile/UserProfile'), {
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4">
        <div className="h-32 w-32 bg-gray-700 rounded-full mx-auto"></div>
        <div className="h-8 bg-gray-700 rounded w-48 mx-auto"></div>
        <div className="h-4 bg-gray-700 rounded w-64 mx-auto"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
});

export default function UserProfilePage() {
  return (
    <div className="pt-[85px] min-h-screen  w-full">
      <UserProfile />
    </div>
  );
}