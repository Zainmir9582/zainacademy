import React from "react";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "stacked";
  iconSize?: number;
  textColor?: string;
  accentColor?: string;
}

export default function Logo({
  className = "",
  variant = "full",
  iconSize = 40,
  textColor = "text-white",
  accentColor = "text-brand-gold"
}: LogoProps) {
  // Highly-crafted SVG paths modeled directly after the user's uploaded academic cap logo
  const renderCap = (size: number) => (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 100 80"
      fill="currentColor"
      className="inline-block shrink-0 transition-transform duration-300"
    >
      {/* Mortarboard flat diamond top */}
      <path
        d="M 50 12 L 94 34 L 50 56 L 6 34 Z"
        className="fill-current"
      />
      
      {/* Highlight/shadow separation on the diamond plate edge */}
      <path
        d="M 40 31 C 40 31, 50 34, 60 31 L 60 34 C 50 37, 40 34, 40 34 Z"
        fill="rgba(255,255,255,0.2)"
      />
      
      {/* Bottom Skullcap skull band with curvature matching the user image */}
      <path
        d="M 21 41.5 L 21 53 C 21 53, 50 63, 79 53 L 79 41.5 C 79 41.5, 50 49, 21 41.5 Z"
        className="fill-current opacity-90"
      />
      
      {/* Hanging Tassel tassel line & fringe bulb */}
      {/* Tassel cord */}
      <path
        d="M 85 30 L 85 58 C 85 58, 86 58, 86 58 L 86 30 Z"
        className="fill-current"
      />
      {/* Tassel fringe bulb */}
      <rect
        x="83.5"
        y="58"
        width="4"
        height="7"
        rx="1.5"
        className="fill-current"
      />
    </svg>
  );

  if (variant === "icon") {
    return <div className={`flex items-center justify-center ${accentColor} ${className}`}>{renderCap(iconSize)}</div>;
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center justify-center text-center p-4 ${className}`}>
        <div className={`${accentColor} mb-3 filter drop-shadow-md`}>
          {renderCap(96)}
        </div>
        <div className="space-y-1">
          <span className={`font-display text-2xl font-black tracking-tight block uppercase ${textColor}`}>
            Zain Academy
          </span>
          <p className="text-[10px] text-brand-gold font-bold tracking-[0.35em] uppercase leading-none pl-[0.35em]">
            EST 2010
          </p>
        </div>
      </div>
    );
  }

  // Default "full" horizontal nav version
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${accentColor} filter drop-shadow-sm`}>
        {renderCap(iconSize)}
      </div>
      <div className="flex flex-col justify-center select-none">
        <span className={`font-display text-base font-black tracking-tight uppercase leading-none block ${textColor}`}>
          Zain Academy
        </span>
        <span className="text-[8px] text-brand-gold/90 font-bold tracking-[0.35em] uppercase leading-none mt-1 pl-[0.35em]">
          EST 2010
        </span>
      </div>
    </div>
  );
}
