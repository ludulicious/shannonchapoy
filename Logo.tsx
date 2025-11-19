
import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'color';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ variant = 'color', className = '', showText = true }) => {
  // Determine colors based on variant
  // Using brand colors: Sea Blue (#488B98) and Lt Purple (#7D337D)
  const color1 = variant === 'light' ? '#FFFFFF' : '#488B98'; 
  const color2 = variant === 'light' ? '#E0E7FF' : '#7D337D'; 
  const bodyColor = variant === 'light' ? '#FFFFFF' : '#543178'; // Dark Purple for body
  
  const textColorPrimary = variant === 'light' ? 'text-white' : 'text-brand-skyBlue';
  const textColorSecondary = variant === 'light' ? 'text-white/90' : 'text-brand-dkPurple';

  return (
    <div className={`flex items-center ${showText ? 'gap-3' : ''} ${className}`}>
      {/* Iconic Butterfly SVG */}
      <svg 
        width="56" 
        height="56" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 md:w-14 md:h-14 drop-shadow-sm"
      >
        {/* Left Upper Wing */}
        <path 
          d="M48 50 C 48 50, 25 25, 10 35 C 0 45, 15 60, 48 58" 
          stroke={color1} 
          strokeWidth="2.5" 
          fill="none"
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Inner Vein Left Upper */}
        <path d="M48 50 Q 25 40 18 45" stroke={color1} strokeWidth="1" opacity="0.5" />

        {/* Left Lower Wing */}
        <path 
          d="M48 58 C 48 58, 15 65, 25 85 C 35 95, 45 80, 48 72" 
          stroke={color1} 
          strokeWidth="2.5" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Upper Wing */}
        <path 
          d="M52 50 C 52 50, 75 25, 90 35 C 100 45, 85 60, 52 58" 
          stroke={color2} 
          strokeWidth="2.5" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner Vein Right Upper */}
        <path d="M52 50 Q 75 40 82 45" stroke={color2} strokeWidth="1" opacity="0.5" />

        {/* Right Lower Wing */}
        <path 
          d="M52 58 C 52 58, 85 65, 75 85 C 65 95, 55 80, 52 72" 
          stroke={color2} 
          strokeWidth="2.5" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Body */}
        <path 
          d="M50 42 L50 75" 
          stroke={bodyColor} 
          strokeWidth="3" 
          strokeLinecap="round"
        />
        
        {/* Antennae */}
        <path d="M50 42 C 50 42, 45 30, 35 35" stroke={bodyColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 42 C 50 42, 55 30, 65 35" stroke={bodyColor} strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Head dot */}
        <circle cx="50" cy="42" r="2" fill={bodyColor} />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none justify-center">
          <span className={`font-serif font-medium text-2xl md:text-3xl tracking-wide ${textColorPrimary}`}>
            Shannon
          </span>
          <span className={`font-serif font-bold text-2xl md:text-3xl tracking-wide -mt-1 ${textColorSecondary}`}>
            Chapoy
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
