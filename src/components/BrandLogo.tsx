import Link from 'next/link';
import React from 'react';

interface BrandLogoProps {
  href?: string;
  variant?: 'dark' | 'light';
  subtitle?: string;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ 
  href = '/', 
  variant = 'dark', 
  subtitle,
  className = '',
  iconSize = 'sm'
}: BrandLogoProps) {
  
  const textClass = variant === 'dark' ? 'text-gray-900' : 'text-white';
  const subTextClass = variant === 'dark' ? 'text-blue-600' : 'text-blue-300';
  
  const sizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
  };

  const Content = (
    <div className={`flex items-center gap-2 group ${className}`}>
      <img 
        src="/images/visiondrill-logo-icon.png" 
        alt="Visiondrill" 
        className={`${sizes[iconSize]} object-contain`} 
      />
      <div className="flex flex-col">
        <span className={`text-lg font-black tracking-tighter ${textClass} leading-none`}>
          Visiondrill
        </span>
        {subtitle && (
          <span className={`text-[8px] font-black ${subTextClass} uppercase tracking-widest mt-1`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{Content}</Link>;
  }

  return Content;
}
