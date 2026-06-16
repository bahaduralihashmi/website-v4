import React from "react";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "compact";
  darkMode?: boolean;
}

export default function Logo({ className = "h-12", variant = "full", darkMode = true }: LogoProps) {
  // Brand Colors matching the logo:
  // Red: Racing red/orange-red (#EB1C24 or brand-orange)
  // Dark text: Slate-900 / white depending on darkMode
  const primaryRed = "#E11D48"; // vibrant racing red
  const textDarkColor = darkMode ? "#FFFFFF" : "#0F172A";
  const grayColor = darkMode ? "#94A3B8" : "#64748B";

  if (variant === "icon") {
    // A quick, highly-identifiable compact circular/square icon for favicon / tiny spots
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Ambient Glow */}
        <circle cx="50" cy="50" r="40" fill="url(#iconGlow)" opacity="0.15" />
        
        {/* Tire track arc on top of icon */}
        <path
          d="M20,38 C30,22 70,22 80,38"
          stroke={textDarkColor}
          strokeWidth="4"
          strokeDasharray="4 4"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        {/* Slanted bold letter "H" and "T" */}
        <g transform="skewX(-10) translate(8, 0)">
          <text
            x="20"
            y="65"
            fill={primaryRed}
            fontSize="32"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-1"
          >
            H
          </text>
          <text
            x="48"
            y="65"
            fill={textDarkColor}
            fontSize="32"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-1"
          >
            B
          </text>
        </g>

        {/* Tire wrapping right side */}
        <circle cx="76" cy="55" r="14" stroke={textDarkColor} strokeWidth="4.5" />
        <circle cx="76" cy="55" r="8" stroke={textDarkColor} strokeWidth="2.5" />
        <path d="M76,41 L76,69 M62,55 L90,55" stroke={textDarkColor} strokeWidth="1.5" />

        <defs>
          <radialGradient id="iconGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={primaryRed} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  // Full HBT Logo matching the shop's physical sign board and uploaded image
  return (
    <div className={`flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 350 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* BACKGROUND GLOW (Subtle, professional) */}
        <defs>
          <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. TIRE TREAD TRACK ARC (Top header curving down over the letters into the wheel) */}
        <g id="Tire-Tread-Arc" transform="translate(45, 10)">
          {/* Subtle guide curve */}
          <path d="M 5,20 Q 100,-8 212,28" stroke={grayColor} strokeWidth="1" fill="none" opacity="0.15" />
          
          {/* Authentic Herringbone/Leaning tread tracks from the uploaded sign */}
          <g fill={textDarkColor} opacity="0.85">
            {/* Left side rising treads */}
            <path d="M 5,22 L 11,14 L 16,16 L 10,24 Z" />
            <path d="M 23,17 L 29,9 L 34,11 L 28,19 Z" />
            <path d="M 42,13 L 48,5 L 53,7 L 47,15 Z" />
            <path d="M 62,10 L 68,2 L 73,4 L 67,12 Z" />
            <path d="M 83,8 L 89,1 L 94,3 L 88,10 Z" />
            
            {/* Center-right crowning treads bending towards the tire */}
            <path d="M 105,7 L 111,1 L 116,3 L 110,9 Z" />
            <path d="M 127,8 L 133,3 L 137,6 L 131,11 Z" />
            <path d="M 149,11 L 154,6 L 158,9 L 153,14 Z" />
            <path d="M 170,15 L 175,10 L 179,13 L 174,18 Z" />
            <path d="M 190,21 L 194,16 L 198,19 L 194,24 Z" />
            <path d="M 209,28 L 213,23 L 217,26 L 213,31 Z" />
          </g>
        </g>

        {/* 2. MAIN LOGO BODY: STYLIZED SLANTED "HBT" */}
        <g id="HBT-Acronym" transform="translate(56, 32)">
          {/* High-fidelity, sharp racing red path for 'H' */}
          <path 
            d="M 5,48 L 16,6 H 31 L 27,22 H 49 L 53,6 H 68 L 57,48 H 42 L 46,31 H 24 L 20,48 Z" 
            fill={primaryRed} 
          />
          
          {/* High-fidelity block 'B' in Racing Red */}
          <path 
            d="M 72,48 L 84,6 H 112 C 122,6 128,10 126,17 C 125,21 121,24 116,26 C 122,27 124,31 122,37 C 120,44 113,48 102,48 Z 
               M 94,21 H 105 C 109,21 111,19 112,16 C 113,13 111,11 107,11 H 97 Z 
               M 90,38 H 101 C 105,38 107,36 108,32 C 109,28 107,26 103,26 H 93 Z" 
            fill={primaryRed} 
          />
          
          {/* High-fidelity slanted 'T' adjacent and integrated to the wheel */}
          <path 
            d="M 124,13 L 126,6 H 168 L 166,13 H 152 L 143,48 H 128 L 137,13 Z" 
            fill={primaryRed} 
          />

          {/* 3. SIMPLIFIED & AUTHENTIC TIRE & RIM SYSTEM (Clean, high-contrast circular wheel matching the real shop brand) */}
          <g id="Wheel-Icon" transform="translate(178, 14)">
            {/* Elegant, clean concentric circular ring in the rim disc */}
            <circle cx="25" cy="25" r="9" stroke={grayColor} strokeWidth="1.5" fill="none" opacity="0.6" />
          </g>
        </g>

        {/* 4. "HAIDER BROTHERS TRADERS" sub-text at the base */}
        <text
          x="175"
          y="104"
          fill={textDarkColor}
          fontSize="15.5"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="5.8"
          textAnchor="middle"
          id="hbt-signature-text"
        >
          HAIDER BROTHERS TRADERS
        </text>

        {/* Small trademark label */}
        <text
          x="332"
          y="102"
          fill={grayColor}
          fontSize="7"
          fontWeight="700"
          fontFamily="monospace"
        >
          ®
        </text>
      </svg>
    </div>
  );
}
