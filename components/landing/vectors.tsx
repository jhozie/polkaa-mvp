import React from "react";

// Official Polkaa Logo (Using the official brand mark: Deep Teal/Navy + Sunshine Yellow Dot)
export function PolkaaLogo({
  variant = "light",
  className = "h-9 w-auto"
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  return (
    <img
      src={variant === "dark" ? "/polkaa-logo-dark.png" : "/polkaa-logo-light.svg"}
      alt="Polkaa"
      className={className}
    />
  );
}

// GTBank Official Vector Logo (Guaranty Trust Bank Orange Square)
export function GTBankLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Guaranty Trust Bank"
    >
      <rect width="100" height="100" rx="16" fill="#DD3800" />
      <rect x="22" y="22" width="22" height="22" fill="#FFFFFF" />
      <path d="M56 22H78V36H56V22Z" fill="#FFFFFF" />
      <path d="M56 44H78V58H56V44Z" fill="#FFFFFF" />
      <path d="M56 64H78V78H56V64Z" fill="#FFFFFF" />
      <path d="M22 56H44V78H22V56Z" fill="#FFFFFF" />
    </svg>
  );
}

// MTN MoMo PSB Official Rail Vector Logo (Solar Amber / Rich Yellow with signature curves)
export function MoMoLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MTN MoMo PSB"
    >
      <rect width="100" height="100" rx="22" fill="#FFCC00" />
      {/* MoMo Dual Geometric Arcs in Rich Navy / Teal */}
      <path
        d="M28 58C28 44.7452 38.7452 34 52 34C60.8366 34 68.4907 38.7779 72.5 45.9"
        stroke="#004F71"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M72 42C72 55.2548 61.2548 66 48 66C39.1634 66 31.5093 61.2221 27.5 54.1"
        stroke="#004F71"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="5" fill="#004F71" />
    </svg>
  );
}

// Central Bank of Nigeria (CBN) Regulatory Vector Badge
export function CBNBadge({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill="rgba(0, 79, 113, 0.12)"
        stroke="#004F71"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="#004F71"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// High-resolution Topographic Security Guilloche Contours (Subtle luxury lines)
export function TopographicPattern({ className = "absolute inset-0 opacity-20 pointer-events-none" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M-50 120 C 150 80, 280 220, 650 140"
        stroke="rgba(255, 204, 5, 0.25)"
        strokeWidth="1.2"
        strokeDasharray="4 2"
      />
      <path
        d="M-50 160 C 180 120, 260 260, 650 180"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1.2"
      />
      <path
        d="M-50 200 C 120 160, 320 300, 650 220"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1"
      />
      <path
        d="M-50 240 C 220 200, 300 340, 650 260"
        stroke="rgba(255, 204, 5, 0.2)"
        strokeWidth="1"
      />
      <path
        d="M-50 280 C 160 240, 360 380, 650 300"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1.2"
        strokeDasharray="6 3"
      />
    </svg>
  );
}

// Smart Chip Vector for Cards
export function SmartChip({ className = "w-9 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 34"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="44" height="34" rx="5" fill="#E6AF2E" />
      <rect x="2" y="2" width="40" height="30" rx="3.5" stroke="#B8860B" strokeWidth="1" fill="#D4AF37" />
      <path d="M2 17H42" stroke="#8B6914" strokeWidth="1" />
      <path d="M14 2V32" stroke="#8B6914" strokeWidth="1" />
      <path d="M30 2V32" stroke="#8B6914" strokeWidth="1" />
      <rect x="14" y="9" width="16" height="16" rx="2" stroke="#8B6914" strokeWidth="1" fill="#F3E5AB" />
    </svg>
  );
}

// Contactless Wave Vector
export function ContactlessWave({ className = "w-5 h-5 text-white/70" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 16.5a5 5 0 0 1 0-9" />
      <path d="M12 19a9 9 0 0 0 0-14" />
      <path d="M15.5 21.5a13 13 0 0 0 0-19" />
    </svg>
  );
}

// Hand-Drawn Directional Arrow Vector (Nearpays Image 3 style)
export function CurvedReviewArrow({ className = "w-28 h-16 text-slate-800" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 70"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 50 C 35 15, 75 70, 105 32"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M96 28 L 108 31 L 105 43"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
