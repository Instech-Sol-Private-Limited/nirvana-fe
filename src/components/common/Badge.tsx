import React from 'react';
import { 
  FaUserPlus, 
  FaPencilAlt, 
  FaRegComment, 
  FaUsers 
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
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'FaUserPlus': <FaUserPlus />,
  'FaPencilAlt': <FaPencilAlt />,
  'FaRegComment': <FaRegComment />,
  'FaUsers': <FaUsers />,
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
}: BadgeProps) {
  const id = `badge-${name.toLowerCase().replace(/\s+/g, '-')}`;
  
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
    lg: 'text-base py-2 px-4',
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
          animate-badge-pulse
          transition-all duration-300
          hover:scale-105 hover:shadow-lg
        `}
        style={{
          borderColor: 'rgba(20,184,166,0.7)', // teal border fallback
        }}
      >
        
        <span className="absolute inset-0 pointer-events-none rounded-full opacity-30"
          style={{
            background: 'linear-gradient(90deg,rgba(255,255,255,0.15),rgba(20,184,166,0.15))'
          }}
        />
        <span className="relative flex items-center">
          <span className="mr-1 text-xs opacity-90">{ICON_MAP[icon] || null}</span>
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
    </>
  );
}