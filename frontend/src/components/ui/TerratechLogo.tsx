import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  collapsed?: boolean;
}

export const TerratechLogo: React.FC<LogoProps> = ({
  className = 'h-8 w-8',
  showText = true,
  collapsed = false,
}) => {
  return (
    <div className="flex items-center gap-3 sidebar-brand-box min-w-0 select-none">
      {/* Isotipo: Síntesis geométrica de estratos mineros y prisma técnico */}
      <svg
        className={`${className} flex-shrink-0`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="10" fill="#0F172A" />
        {/* Capas geológicas / estratos de suelo minero */}
        <path
          d="M8 28L20 22L32 28L20 34L8 28Z"
          fill="#D97706"
          opacity="0.95"
        />
        <path
          d="M8 21L20 15L32 21L20 27L8 21Z"
          fill="#B45309"
          opacity="0.85"
        />
        {/* Prisma técnico superior */}
        <path
          d="M8 14L20 8L32 14L20 20L8 14Z"
          fill="#F59E0B"
        />
        {/* Vértice de anclaje de precisión */}
        <circle cx="20" cy="8" r="2" fill="#FFFFFF" />
      </svg>

      {showText && !collapsed && (
        <div className="flex flex-col min-w-0 sidebar-hide-on-collapse">
          <span className="font-sans text-sm tracking-wider uppercase text-slate-900 dark:text-foundry-titanium font-extrabold leading-tight truncate">
            TERRATECH
          </span>
          <span className="font-mono text-[9px] tracking-widest text-slate-500 dark:text-foundry-aluminum uppercase font-bold truncate">
            OS INDUSTRIAL v2.4
          </span>
        </div>
      )}
    </div>
  );
};
