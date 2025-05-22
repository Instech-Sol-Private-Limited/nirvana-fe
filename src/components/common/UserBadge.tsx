// components/common/UserBadges.tsx
import React, { useState, useEffect } from 'react';
import Badge from './Badge';
import { getUserBadges, UserBadge } from '@/utils/badge';

interface UserBadgesProps {
  userId: string;
  displayMode?: 'inline' | 'grid';
  maxDisplay?: number;
  showMoreText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UserBadges({
  userId,
  displayMode = 'inline',
  maxDisplay = 3,
  showMoreText = 'more',
  size = 'md',
  className = '',
}: UserBadgesProps) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    async function loadBadges() {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await getUserBadges(userId);
        console.log('getUserBadges response:', response);
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
  
  if (loading) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {[...Array(2)].map((_, i) => (
          <div 
            key={i} 
            className="w-16 h-6 rounded-full bg-gray-700 animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  if (badges.length === 0) {
    return null;
  }
  
  const visibleBadges = expanded ? badges : badges.slice(0, maxDisplay);
  const hasMoreBadges = badges.length > maxDisplay;
  
  const containerClasses = {
    inline: 'flex flex-wrap gap-2',
    grid: 'grid grid-cols-2 sm:grid-cols-3 gap-2',
  };
  
  return (
    <div className={className}>
      <div className={containerClasses[displayMode]}>
        {visibleBadges.map((badge) => (
          <Badge
            key={badge.id}
            name={badge.name}
            description={badge.description}
            icon={badge.icon}
            color={badge.color}
            background={badge.background}
            size={size}
          />
        ))}
        
        {!expanded && hasMoreBadges && (
          <button 
            onClick={() => setExpanded(true)}
            className="text-xs text-gray-400 hover:text-teal-400 transition-colors"
          >
            +{badges.length - maxDisplay} {showMoreText}
          </button>
        )}
      </div>
    </div>
  );
}