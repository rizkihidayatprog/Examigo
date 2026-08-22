import React from 'react';

interface ExamigoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  showText?: boolean;
}

export default function ExamigoLogo({ 
  className = '', 
  size = 'md', 
  showBadge = false,
  showText
}: ExamigoLogoProps) {
  const textSizeMap = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const textSize = textSizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none group ${className}`}>
      {/* Pure Unique Typography Wordmark Logo */}
      <span className={`font-black tracking-tight leading-none text-slate-900 font-sans ${textSize}`}>
        Exam
        <span className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:to-blue-500 transition-all">
          igo
        </span>
        <span className="text-indigo-600 font-serif inline-block text-xs align-super ml-0.5">✦</span>
      </span>

      {/* Optional Badge (Default Off) */}
      {showBadge && (
        <span className="rounded-full font-black text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest">
          AI SAAS
        </span>
      )}
    </div>
  );
}
