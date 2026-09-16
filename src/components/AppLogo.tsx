import React, { useState } from 'react';
import { APP_ASSETS } from '../utils/assets';

interface AppLogoProps {
  className?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'squircle' | 'round' | 'square';
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  alt = 'CreatorFlow AI',
  size = 'md',
  shape = 'squircle'
}) => {
  const [useFallback, setUseFallback] = useState(false);
  const [renderSvg, setRenderSvg] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  }[size];

  const shapeClasses = {
    squircle: 'rounded-xl',
    round: 'rounded-full',
    square: 'rounded-lg'
  }[shape];

  // If both image attempts fail, render ultra-resilient vector brand monogram
  if (renderSvg) {
    return (
      <div
        className={`${sizeClasses} ${shapeClasses} bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#2563EB] flex items-center justify-center text-white font-extrabold shadow-md shadow-purple-950/50 border border-purple-400/40 select-none overflow-hidden relative ${className}`}
      >
        <div className="absolute inset-0 bg-radial from-white/20 to-transparent pointer-events-none" />
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="22" fill="#090A0F" />
          <path
            d="M25 50C25 36.19 36.19 25 50 25C60 25 68 31 72 40L60 45C58 40 54 37 50 37C42.82 37 37 42.82 37 50C37 57.18 42.82 63 50 63C55 63 59 60 61 56L73 61C69 70 60 75 50 75C36.19 75 25 63.81 25 50Z"
            fill="url(#cfGrad)"
          />
          <circle cx="72" cy="28" r="8" fill="#F59E0B" />
          <path
            d="M48 44H68V52H48V44Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }

  const currentSrc = useFallback ? APP_ASSETS.publicIcon : APP_ASSETS.icon;

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="eager"
      decoding="async"
      onError={() => {
        if (!useFallback) {
          setUseFallback(true);
        } else {
          setRenderSvg(true);
        }
      }}
      className={`object-cover ${shapeClasses} ${className || sizeClasses}`}
    />
  );
};
