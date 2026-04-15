import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/types';

interface LogoProps {
  locale: Locale;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ locale, variant = 'dark', size = 'md' }: LogoProps) {
  const color = variant === 'light' ? '#ffffff' : '#0a0a0a';

  const sizes = {
    sm: { width: 72, height: 36 },
    md: { width: 88, height: 44 },
    lg: { width: 108, height: 54 },
  };

  const { width, height } = sizes[size];

  return (
    <Link href={`/${locale}`} aria-label="Wildora — Accueil">
      <svg
        width={width}
        height={height}
        viewBox="0 0 88 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* W mark — mountain peak left */}
        <polyline
          points="0,32 6,10 12,26 18,10 24,32"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Vertical separator */}
        <line x1="30" y1="8" x2="30" y2="36" stroke={color} strokeWidth="1" opacity="0.35" />
        {/* WILD top line */}
        <text
          x="36"
          y="22"
          fontFamily="var(--font-playfair), 'Oswald', Georgia, serif"
          fontSize="14"
          fontWeight="700"
          letterSpacing="0.3em"
          fill={color}
        >
          WILD
        </text>
        {/* ORA bottom line */}
        <text
          x="36"
          y="38"
          fontFamily="var(--font-playfair), 'Oswald', Georgia, serif"
          fontSize="14"
          fontWeight="700"
          letterSpacing="0.3em"
          fill={color}
        >
          ORA
        </text>
      </svg>
    </Link>
  );
}
