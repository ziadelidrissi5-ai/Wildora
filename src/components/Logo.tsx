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
    sm: { width: 140, height: 38 },
    md: { width: 178, height: 48 },
    lg: { width: 216, height: 58 },
  };

  const { width, height } = sizes[size];

  return (
    <Link href={`/${locale}`} aria-label="Wildora — Accueil">
      <svg
        width={width}
        height={height}
        viewBox="0 0 178 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Circle */}
        <circle cx="24" cy="24" r="22" fill={color} />
        {/* W inside circle */}
        <polyline
          points="8,14 13,34 24,20 35,34 40,14"
          stroke={variant === 'light' ? '#080808' : '#ffffff'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* WILD */}
        <text
          x="56"
          y="25"
          fontFamily="var(--font-playfair), 'Oswald', Georgia, serif"
          fontSize="18"
          fontWeight="900"
          letterSpacing="0.34em"
          fill={color}
        >
          WILD
        </text>
        {/* ORA */}
        <text
          x="56"
          y="44"
          fontFamily="var(--font-playfair), 'Oswald', Georgia, serif"
          fontSize="18"
          fontWeight="900"
          letterSpacing="0.34em"
          fill={color}
        >
          ORA
        </text>
      </svg>
    </Link>
  );
}
