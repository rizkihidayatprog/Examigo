import React from 'react';

interface ExamigoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  showText?: boolean;
  variant?: 'dark' | 'light' | 'auto';
}

export default function ExamigoLogo({ 
  className = '', 
  size = 'md', 
  showBadge = false, 
  showText = true,
  variant = 'dark'
}: ExamigoLogoProps) {
  const textSizeMap = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const iconDimMap = {
    sm: 30,
    md: 38,
    lg: 46,
    xl: 56,
  };

  const textSize = textSizeMap[size];
  const dim = iconDimMap[size];
  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Bespoke Custom Vector Emblem: Exact Favicon Design (Indigo/Blue Gradient + White 'e' + Gold AI Sparkle) */}
      <div className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg 
          width={dim} 
          height={dim} 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          <defs>
            <linearGradient id="examigoFaviconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>

          {/* Clean Rounded Background */}
          <rect width="32" height="32" rx="9" fill="url(#examigoFaviconGrad)" />

          {/* Minimalist Modern lowercase "e" with rounded geometric curves */}
          <path 
            fill="#FFFFFF" 
            d="M16 7c-4.4 0-8 3.6-8 8s3.6 8 8 8c3.2 0 6-1.9 7.3-4.6h-3.8c-.9 1.1-2.2 1.8-3.5 1.8-2.2 0-4-1.8-4-4h11.8c.1-.4.2-.8.2-1.2 0-4.4-3.6-8-8-8zm-4 6.5c.3-2.1 2-3.7 4-3.7s3.7 1.6 4 3.7h-8z" 
          />

          {/* Sparkle Motif */}
          <path 
            fill="#FBBF24" 
            d="M25.5 3l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" 
          />
        </svg>
      </div>

      {/* Typography Wordmark - Matching Favicon Palette */}
      {showText && (
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-black tracking-tight leading-none font-sans ${textSize}`}
            style={{ color: isLight ? '#FFFFFF' : '#1E1B4B' }}
          >
            Exam<span style={{ color: '#4F46E5' }} className="font-black">igo</span>
          </span>

          {showBadge && (
            <span 
              className="rounded-md font-black text-[9px] px-1.5 py-0.5 uppercase tracking-wider shadow-xs"
              style={{
                backgroundColor: isLight ? 'rgba(255,255,255,0.1)' : '#EEF2FF',
                color: isLight ? '#FFFFFF' : '#4F46E5',
                border: isLight ? '1px solid rgba(255,255,255,0.2)' : '1px solid #C7D2FE'
              }}
            >
              PRO
            </span>
          )}
        </div>
      )}
    </div>
  );
}

