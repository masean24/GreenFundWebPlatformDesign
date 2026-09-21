interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function GreenFundMark({ size = 36, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer G arc — dark forest green */}
      <path
        d="M85 50C85 69.33 69.33 85 50 85C30.67 85 15 69.33 15 50C15 30.67 30.67 15 50 15C62.5 15 73.5 21.5 80 31.5"
        stroke="#14432B"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      {/* G horizontal bar — transitions to teal */}
      <path
        d="M50 50 H80"
        stroke="#1F8A8C"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      {/* Solar panels block at bottom of G interior */}
      <rect x="38" y="57" width="8" height="6" rx="1" fill="#1F8A8C" />
      <rect x="47" y="57" width="8" height="6" rx="1" fill="#26A9AB" />
      <rect x="56" y="57" width="8" height="6" rx="1" fill="#1F8A8C" />
      <rect x="38" y="64" width="8" height="5" rx="1" fill="#26A9AB" />
      <rect x="47" y="64" width="8" height="5" rx="1" fill="#1F8A8C" />
      <rect x="56" y="64" width="8" height="5" rx="1" fill="#26A9AB" />
      {/* Sun — amber */}
      <circle cx="72" cy="27" r="7" fill="#F59E0B" />
      <line x1="72" y1="17" x2="72" y2="14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <line x1="79" y1="20" x2="81" y2="18" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="27" x2="85" y2="27" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <line x1="79" y1="34" x2="81" y2="36" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <line x1="65" y1="20" x2="63" y2="18" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      {/* Leaf — bright green */}
      <path
        d="M30 45 C22 35 28 22 38 24 C38 24 42 35 35 44 Z"
        fill="#4CAF50"
      />
      <path
        d="M30 45 C34 38 36 30 38 24"
        stroke="#14432B"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

interface WordmarkProps {
  dark?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GreenFundWordmark({ dark = false, size = "md", className = "" }: WordmarkProps) {
  const sizes = { sm: "text-base", md: "text-lg", lg: "text-2xl" };
  return (
    <span className={`font-bold tracking-tight ${sizes[size]} ${className}`}>
      <span style={{ color: dark ? "#FFFFFF" : "#14432B" }}>Green</span>
      <span style={{ color: "#4CAF50" }}>Fund</span>
    </span>
  );
}

interface FullLogoProps {
  dark?: boolean;
  markSize?: number;
  wordmarkSize?: "sm" | "md" | "lg";
  className?: string;
}

export default function GreenFundLogo({ dark = false, markSize = 32, wordmarkSize = "md", className = "" }: FullLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <GreenFundMark size={markSize} />
      <GreenFundWordmark dark={dark} size={wordmarkSize} />
    </div>
  );
}
