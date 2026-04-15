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
        {/* Circle — noir */}
        <circle cx="24" cy="24" r="22" fill="#0a0a0a" />
        <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="1.5" fill="none" opacity="0.25" />
        {/* W long et étroit */}
        <polyline
          points="13,10 17,38 24,22 31,38 35,10"
          stroke="#ffffff"
          strokeWidth="3.5"
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
