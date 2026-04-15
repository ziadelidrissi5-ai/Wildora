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
    sm: { width: 100, height: 32 },
    md: { width: 124, height: 40 },
    lg: { width: 152, height: 48 },
  };

  const { width, height } = sizes[size];

  return (
    <Link href={`/${locale}`} aria-label="Wildora — Accueil">
      <svg
        width={width}
        height={height}
        viewBox="0 0 124 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Tent icon — triangle over a ground line */}
        <polygon
          points="18,6 32,30 4,30"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Door slit at base */}
        <line x1="15" y1="30" x2="21" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Ground line */}
        <line x1="0" y1="33" x2="36" y2="33" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />

        {/* WILD */}
        <text
          x="44"
          y="21"
          fontFamily="var(--font-playfair), 'Oswald', Georgia, serif"
          fontSize="13"
          fontWeight="700"
          letterSpacing="0.32em"
          fill={color}
        >
          WILD
        </text>
        {/* ORA */}
        <text
          x="44"
          y="35"
          fontFamily="var(--font-playfair), 'Oswald', Georgia, serif"
          fontSize="13"
          fontWeight="700"
          letterSpacing="0.32em"
          fill={color}
        >
          ORA
        </text>
      </svg>
    </Link>
  );
}
