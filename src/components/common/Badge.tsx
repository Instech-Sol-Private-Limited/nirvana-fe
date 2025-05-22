
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
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-xs py-1 px-2',
    lg: 'text-sm py-1.5 px-3',
  };

  return (
    <>
      <span 
  id={tooltip ? id : undefined}
  className={`
    inline-flex items-center gap-1 rounded-full font-semibold
    border-2
    ${sizeClasses[size]} 
    ${color} ${background} ${className}
    animate-badge-pulse
  `}
>
  {ICON_MAP[icon] || null}
  <span className="font-medium">{name}</span>
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
