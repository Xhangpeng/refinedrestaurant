import React from 'react';

interface PalaceLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  className?: string;
}

export const PalaceLogo: React.FC<PalaceLogoProps> = ({ size = 'responsive', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    responsive: 'w-8 h-8 sm:w-9 sm:h-9',
  }[size] || 'w-8 h-8';

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-md p-1.5 border border-amber-300/40 ${sizeClasses} ${className}`}
      aria-label="Maheswari Restaurant Emblem"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-stone-950 drop-shadow-xs"
      >
        {/* Royal Crown / Palace Dome & Arch */}
        <path d="M12 2L15 6L21 4L18 12H6L3 4L9 6L12 2Z" fill="currentColor" fillOpacity="0.25" />
        <path d="M6 12V20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20V12" />
        <path d="M10 22V16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16V22" />
        <circle cx="12" cy="7" r="1.5" fill="currentColor" />
      </svg>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
};
