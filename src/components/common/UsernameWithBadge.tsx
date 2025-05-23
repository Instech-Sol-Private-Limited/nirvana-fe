
// import React, { useState, useEffect } from 'react';
// import { getUserBadges, UserBadge } from '@/utils/badge';
// import Badge from './Badge';

// interface UserNameWithBadgesProps {
//   userId: string;
//   username: string;
//   size?: 'sm' | 'md' | 'lg';
//   className?: string;
//   maxBadges?: number;
// }

// export default function UserNameWithBadges({
//   userId,
//   username,
//   size = 'sm',
//   className = '',
//   maxBadges = 1
// }: UserNameWithBadgesProps) {
//   const [badges, setBadges] = useState<UserBadge[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function loadBadges() {
//     if (!userId) return;

//     try {
//       setLoading(true);
//       const response = await getUserBadges(userId);

//       if (response.success) {
//         setBadges(response.data.badges);
//       }
//     } catch (error) {
//       console.error('Error loading badges:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadBadges();
//   }, [userId]);

//   const visibleBadges = badges;

//   return (
//     <span className={`flex items-center gap-2`}>
//       <span className="capitalize font-medium">{username}</span>

//       <span className={`${className}`}>
//         {loading ? (
//           <span className="h-5 w-16 bg-gray-700 rounded-full animate-pulse"></span>
//         ) : (
//           visibleBadges.map((badge) => (
//             <Badge
//               key={badge.id}
//               name={badge.name}
//               description={badge.description}
//               icon={badge.icon}
//               color={badge.color}
//               background={badge.background}
//               size={size}
//             />
//           ))
//         )}
//       </span>
//     </span>
//   );
// }


// components/UsernameWithBadge.tsx (Enhanced Version)
import React, { useState, useEffect, useCallback } from 'react';
import { getUserBadges, UserBadge } from '@/utils/badge';
import {getUserSoulpoints, SoulpointsData, getUserAnamcoins, AnamcoinsData } from '@/utils/soulpoints';
import Badge from './Badge';
import { FaFire } from 'react-icons/fa';



interface UserNameWithBadgesProps {
  userId: string;
  username: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  maxBadges?: number;
  showSoulpoints?: boolean;
  showLevel?: boolean;
  showAnamcoins?: boolean;  
  prioritizeSoulTitle?: boolean;
}



const SOUL_TITLE_NAMES = [
  'Wanderer', 'Light Seeker', 'Insight Whisperer', 'Pathfinder',
  'Soul Contributor', 'Harmonic Voice', 'Wisdom Weaver',
  'Echo Guide', 'Anamfriend', 'Elder Soul'
];

export default function UserNameWithBadges({
  userId,
  username,
  size = 'sm',
  className = '',
  maxBadges = 1,
  showSoulpoints = false,
  showLevel = false,
  showAnamcoins = false,  
  prioritizeSoulTitle = true
}: UserNameWithBadgesProps) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [soulpoints, setSoulpoints] = useState<SoulpointsData | null>(null);
  const [anamcoins, setAnamcoins] = useState<AnamcoinsData | null>(null);  
  const [loading, setLoading] = useState(true);


  const loadUserData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const promises = [
        getUserBadges(userId),
        (showSoulpoints || showLevel) ? getUserSoulpoints(userId) : Promise.resolve({ success: true, data: null }),
        showAnamcoins ? getUserAnamcoins(userId) : Promise.resolve({ success: true, data: null })  
      ];

      const [badgesResponse, soulpointsResponse, anamcoinsResponse] = await Promise.all(promises);  

      if (badgesResponse.success && badgesResponse.data && 'badges' in badgesResponse.data) {
        setBadges(badgesResponse.data.badges);
      }

      if (
        soulpointsResponse.success &&
        soulpointsResponse.data &&
        typeof soulpointsResponse.data === 'object' &&
        'points' in soulpointsResponse.data &&
        'level' in soulpointsResponse.data &&
        'soul_title' in soulpointsResponse.data
      ) {
        setSoulpoints(soulpointsResponse.data as SoulpointsData);
      }

      
      if (
        anamcoinsResponse.success &&
        anamcoinsResponse.data &&
        typeof anamcoinsResponse.data === 'object' &&
        'balance' in anamcoinsResponse.data &&
        'total_earned' in anamcoinsResponse.data
      ) {
        setAnamcoins(anamcoinsResponse.data as AnamcoinsData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, showSoulpoints, showLevel, showAnamcoins]);

  useEffect(() => {
    loadUserData();
  }, [userId, showSoulpoints, showLevel]);

 
  const soulTitleBadges = badges.filter(badge => SOUL_TITLE_NAMES.includes(badge.name));
  const otherBadges = badges.filter(badge => !SOUL_TITLE_NAMES.includes(badge.name));

  let visibleBadges: UserBadge[] = [];

  if (prioritizeSoulTitle && soulTitleBadges.length > 0) {
    
    visibleBadges = [
      ...soulTitleBadges.slice(0, 1), 
      ...otherBadges.slice(0, maxBadges - 1)
    ];
  } else {
    
    visibleBadges = badges.slice(0, maxBadges);
  }

  const pointsDisplay = showSoulpoints && soulpoints ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-600/20 rounded text-xs text-purple-200 border border-purple-500/30">
      <FaFire className="text-orange-400" />
      {soulpoints.points.toLocaleString()}
    </span>
  ) : null;

const anamcoinsDisplay = showAnamcoins && anamcoins ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold-600/20 rounded text-xs text-gold-200 border border-gold-500/30">
      <span className="text-yellow-400">💰</span>
      {anamcoins.balance.toLocaleString()}
    </span>
  ) : null;

  const levelDisplay = showLevel && soulpoints ? (
    <span className="inline-flex items-center px-2 py-0.5 bg-yellow-600/20 rounded text-xs text-yellow-200 border border-yellow-500/30">
      L{soulpoints.level}
    </span>
  ) : null;

  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="capitalize font-medium text-gray-100">{username}</span>

      
      <span className="flex items-center gap-1">
        {levelDisplay}
        {pointsDisplay}
        {anamcoinsDisplay}  
      </span>

      
      <span className="flex items-center gap-1">
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
              soulTitle={SOUL_TITLE_NAMES.includes(badge.name)}
            />
          ))
        )}
      </span>
    </span>
  );
}