// import React from 'react';
// import { 
//   FaUserPlus, 
//   FaPencilAlt, 
//   FaRegComment, 
//   FaUsers 
// } from 'react-icons/fa';
// import { Tooltip } from 'react-tooltip';

// interface BadgeProps {
//   name: string;
//   description?: string;
//   icon: string;
//   color: string;
//   background: string;
//   className?: string;
//   tooltip?: boolean;
//   size?: 'sm' | 'md' | 'lg';
// }

// const ICON_MAP: Record<string, React.ReactNode> = {
//   'FaUserPlus': <FaUserPlus />,
//   'FaPencilAlt': <FaPencilAlt />,
//   'FaRegComment': <FaRegComment />,
//   'FaUsers': <FaUsers />,
// };

// export default function Badge({ 
//   name, 
//   description, 
//   icon, 
//   color, 
//   background,
//   className = '',
//   tooltip = true,
//   size = 'md',
// }: BadgeProps) {
//   const id = `badge-${name.toLowerCase().replace(/\s+/g, '-')}`;
  
//   const sizeClasses = {
//     sm: 'text-xs py-0.5 px-2',
//     md: 'text-sm py-1 px-3',
//     lg: 'text-base py-2 px-4',
//   };

//   return (
//     <>
//       <span 
//         id={tooltip ? id : undefined}
//         className={`
//           inline-flex items-center gap-2 rounded-full font-semibold
//           border-2 shadow-md relative overflow-hidden
//           ${sizeClasses[size]} 
//           ${color} ${background} ${className}
//           animate-badge-pulse
//           transition-all duration-300
//           hover:scale-105 hover:shadow-lg
//         `}
//         style={{
//           borderColor: 'rgba(20,184,166,0.7)', // teal border fallback
//         }}
//       >
        
//         <span className="absolute inset-0 pointer-events-none rounded-full opacity-30"
//           style={{
//             background: 'linear-gradient(90deg,rgba(255,255,255,0.15),rgba(20,184,166,0.15))'
//           }}
//         />
//         <span className="relative flex items-center">
//           <span className="mr-1 text-xs opacity-90">{ICON_MAP[icon] || null}</span>
//           <span className="font-bold drop-shadow relative z-10">{name}</span>
//         </span>
//       </span>
      
//       {tooltip && description && (
//         <Tooltip 
//           anchorId={id} 
//           content={description} 
//           place="top"
//           className="z-50"
//         />
//       )}
//     </>
//   );
// }


// components/Badge.tsx
import React from 'react';
import { 
  FaUserPlus, 
  FaPencilAlt, 
  FaRegComment, 
  FaUsers,
  FaUserCircle,
  FaSun,
  FaEye,
  FaCompass,
  FaHeart,
  FaMusic,
  FaBookOpen,
  FaLightbulb,
  FaStar,
  FaCrown
} from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

interface BadgeProps {
  name: string;
  description?: string;
  icon: string;
  color: string;
  background: string;
  className?: string;
  tooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  soulTitle?: boolean; 
}

const ICON_MAP: Record<string, React.ReactNode> = {
 
  'FaUserPlus': <FaUserPlus />,
  'FaPencilAlt': <FaPencilAlt />,
  'FaRegComment': <FaRegComment />,
  'FaUsers': <FaUsers />,
  
  
  'FaUserCircle': <FaUserCircle />,     // Wanderer
  'FaSun': <FaSun />,                   // Light Seeker
  'FaEye': <FaEye />,                   // Insight Whisperer
  'FaCompass': <FaCompass />,           // Pathfinder
  'FaHeart': <FaHeart />,               // Soul Contributor
  'FaMusic': <FaMusic />,               // Harmonic Voice
  'FaBookOpen': <FaBookOpen />,         // Wisdom Weaver
  'FaLightbulb': <FaLightbulb />,       // Echo Guide
  'FaStar': <FaStar />,                 // Anamfriend
  'FaCrown': <FaCrown />,               // Elder Soul
};

export default function Badge({ 
  name, 
  description, 
  icon, 
  color, 
  background,
  className = '',
  tooltip = true,
  size = 'md',
  soulTitle = false,
}: BadgeProps) {
  const id = `badge-${name.toLowerCase().replace(/\s+/g, '-')}`;
  
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
    lg: 'text-base py-2 px-4',
  };

  const iconSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <>
      <span 
        id={tooltip ? id : undefined}
        className={`
          inline-flex items-center gap-2 rounded-full font-semibold
          border-2 shadow-md relative overflow-hidden
          ${sizeClasses[size]} 
          ${color} ${background} ${className}
          ${soulTitle ? 'animate-pulse ring-2 ring-opacity-50' : 'animate-badge-pulse'}
          transition-all duration-300
          hover:scale-105 hover:shadow-lg
        `}
        style={{
          borderColor: soulTitle ? 'rgba(147, 51, 234, 0.7)' : 'rgba(20,184,166,0.7)',
        }}
      >
        {soulTitle && (
          <span 
            className="absolute inset-0 pointer-events-none rounded-full opacity-20"
            style={{
              background: 'linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 3s ease infinite'
            }}
          />
        )}
        
        <span className="absolute inset-0 pointer-events-none rounded-full opacity-30"
          style={{
            background: soulTitle 
              ? 'linear-gradient(90deg,rgba(147, 51, 234,0.15),rgba(59, 130, 246,0.15))'
              : 'linear-gradient(90deg,rgba(255,255,255,0.15),rgba(20,184,166,0.15))'
          }}
        />
        
        <span className="relative flex items-center">
          <span className={`mr-1 opacity-90 ${iconSizeClasses[size]}`}>
            {ICON_MAP[icon] || null}
          </span>
          <span className="font-bold drop-shadow relative z-10">{name}</span>
        </span>
      </span>
      
      {tooltip && description && (
        <Tooltip 
          anchorId={id} 
          content={description} 
          place="top"
          className="z-50"
        />
      )}
      
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </>
  );
}


// // Simple username with soul title badge
// <UserNameWithBadges 
//   userId={user.id} 
//   username={user.username}
//   prioritizeSoulTitle={true}
//   showLevel={true}
// />

// // Full profile view
// <UserProfileWithSoulpoints
//   userId={user.id}
//   username={user.username}
//   showHistory={true}
//   showAllBadges={true}
// />

// // Compact view with soulpoints
// <UserNameWithBadges 
//   userId={user.id} 
//   username={user.username}
//   showSoulpoints={true}
//   showLevel={true}
//   maxBadges={2}
// />