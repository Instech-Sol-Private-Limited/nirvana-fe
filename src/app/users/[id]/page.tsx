'use client';

import dynamic from 'next/dynamic';

const UserProfile = dynamic(() => import('@/components/UserProfile/UserProfile'))

export default function UserProfilePage() {
  return (
    <div className="pt-10 w-full">
      <UserProfile />
    </div>
  );
}