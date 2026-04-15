import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/types';

interface LogoProps {
  locale: Locale;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ locale, variant = 'dark', size = 'md' }: LogoProps) {
  const textColor = variant === 'light' ? '#ffffff' : '#0a0a0a';
  const accentColor = variant === 'light' ? '#ffffff' : '#0a0a0a';

  const sizes = {
    sm: { height: 30, fontSize: 16, letterSize: 11 },
    md: { height: 42, fontSize: 18, letterSize: 12 },
    lg: { height: 54, fontSize: 22, letterSize: 15 },
  };

  const { height, fontSize, letterSize } = sizes[size];

  return (
    <Link href={`/${locale}`} aria-label="Wildora — Accueil">
      <svg
        width={height * 4.9}
        height={height}
        viewBox="0 0 206 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="22" cy="24" r="18" stroke={accentColor} strokeWidth="4" />
        <path d="M14 25.5l8-6 8 6v6H14v-6z" fill={accentColor} />
        <text
          x="50"
          y="19"
          fontFamily="var(--font-playfair), 'Oswald', sans-serif"
          fontSize={fontSize}
          fontWeight="600"
          letterSpacing="0.22em"
          fill={textColor}
        >
          WILD
        </text>
        <text
          x="50"
          y="39"
          fontFamily="var(--font-playfair), 'Oswald', sans-serif"
          fontSize={fontSize}
          fontWeight="600"
          letterSpacing="0.22em"
          fill={textColor}
        >
          ORA
        </text>
      </svg>
    </Link>
  );
}
