import React from "react";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "compact";
  darkMode?: boolean;
}

/** HBT brand mark: round red badge with high-contrast white HBT lettering. */
export default function Logo({ className = "h-12", variant = "full" }: LogoProps) {
  if (variant === "icon" || variant === "compact") {
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="HBT logo">
        <circle cx="50" cy="50" r="47" fill="#D71920" />
        <circle cx="50" cy="50" r="43" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.9" />
        <text x="50" y="59" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-2">HBT</text>
        <path d="M27 69H73" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full aspect-square shrink-0" role="img" aria-label="HBT logo">
        <circle cx="50" cy="50" r="47" fill="#D71920" />
        <circle cx="50" cy="50" r="43" stroke="#FFFFFF" strokeWidth="2.5" />
        <text x="50" y="59" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-2">HBT</text>
        <path d="M27 69H73" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div className="hidden sm:block leading-tight">
        <div className="font-display font-black tracking-tight text-[15px] sm:text-base">HAIDER BROTHERS</div>
        <div className="text-[9px] sm:text-[10px] font-bold tracking-[0.24em] opacity-60">TRADERS • TYRES & AUTO SERVICE</div>
      </div>
    </div>
  );
}
