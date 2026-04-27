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
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
  };

  const Content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <img 
        src="/images/visiondrill-logo-icon.png" 
        alt="Visiondrill" 
        className={`${sizes[iconSize]} object-contain group-hover:scale-105 transition-transform duration-300`} 
      />
      <div className="flex flex-col">
        <span className={`text-xl font-black tracking-tighter ${textClass} leading-none`}>
          Visiondrill
        </span>
        {subtitle && (
          <span className={`text-[10px] font-bold ${subTextClass} tracking-tight mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="inline-block transition-opacity active:opacity-75">{Content}</Link>;
  }

  return Content;
}
