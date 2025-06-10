/**
 * DefaultAvatar Component
 * Fallback avatar component when customer photos fail to load
 * Uses monochromatic design system with proper accessibility
 */

import React from 'react';
import { User } from 'lucide-react';

interface DefaultAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ 
  name, 
  size = 'md',
  className = '' 
}) => {
  // Extract initials from name
  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Size configurations
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  const initials = getInitials(name);

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gray-100 
        border-2 border-gray-200 
        flex items-center justify-center 
        text-black font-semibold
        ${className}
      `}
      aria-label={`Avatar para ${name}`}
    >
      {initials.length > 0 ? (
        <span>{initials}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-gray-400" />
      )}
    </div>
  );
};

export default DefaultAvatar;