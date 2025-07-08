import React from 'react';

interface TrainWithXLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const TrainWithXLogo: React.FC<TrainWithXLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textSizeClasses = {
    xs: 'text-sm',
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Custom X with dumbbell logo */}
      <div
        className={`${sizeClasses[size]} relative flex items-center justify-center`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          {/* Gradient definition */}
          <defs>
            <linearGradient
              id="logoGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(240 100% 27%)" />
              <stop offset="50%" stopColor="hsl(260 100% 35%)" />
              <stop offset="100%" stopColor="hsl(280 100% 40%)" />
            </linearGradient>
          </defs>

          {/* X shape with dumbbell in center */}
          <path
            d="M20 20 L45 45 M55 55 L80 80 M80 20 L55 45 M45 55 L20 80"
            stroke="url(#logoGradient)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Dumbbell in center */}
          <rect
            x="42"
            y="47"
            width="16"
            height="6"
            rx="3"
            fill="url(#logoGradient)"
          />
          <circle cx="45" cy="50" r="4" fill="url(#logoGradient)" />
          <circle cx="55" cy="50" r="4" fill="url(#logoGradient)" />
        </svg>
      </div>

      {showText && (
        <span className={`font-bold text-gradient ${textSizeClasses[size]}`}>
          TrainWithX
        </span>
      )}
    </div>
  );
};
