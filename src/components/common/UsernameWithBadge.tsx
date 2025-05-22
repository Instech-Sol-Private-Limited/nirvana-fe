
import React, { useState, useEffect } from 'react';
import { getUserBadges, UserBadge } from '@/utils/badge';
import Badge from './Badge';

interface UserNameWithBadgesProps {
  userId: string;
  username: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  maxBadges?: number;
}

export default function UserNameWithBadges({
  userId,
  username,
  size = 'sm',
  className = '',
  maxBadges = 1
}: UserNameWithBadgesProps) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBadges() {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await getUserBadges(userId);

        if (response.success) {
          setBadges(response.data.badges);
        }
      } catch (error) {
        console.error('Error loading badges:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBadges();
  }, [userId]);

  const visibleBadges = badges.slice(0, maxBadges);

  return (
    <span className={`flex items-center gap-2`}>
      <span className="capitalize font-medium">{username}</span>

      <span className={`${className}`}>
        {loading ? (
          <span className="h-5 w-16 bg-gray-700 rounded-full animate-pulse"></span>
        ) : (
          visibleBadges.map((badge) => (
            <Badge
              key={badge.id}
              name={badge.name}
              description={badge.description}
              icon={badge.icon}
              color={badge.color}
              background={badge.background}
              size={size}
            />
          ))
        )}
      </span>
    </span>
  );
}