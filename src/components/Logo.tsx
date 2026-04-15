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
        {/* Tent icon */}
        <polygon
          points="22,5 40,37 4,37"
          stroke={color}
          strokeWidth="2.2"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Door slit */}
        <line x1="18" y1="37" x2="26" y2="24" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        {/* Ground line */}
        <line x1="0" y1="41" x2="44" y2="41" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />

        {/* WILD */}
        <text
          x="54"
          y="25"
          fontFamily="var(--font-playfair), 'Oswald', Georgia, serif"
          fontSize="17"
          fontWeight="700"
          letterSpacing="0.38em"
          fill={color}
        >
          WILD
        </text>
        {/* ORA */}
        <text
          x="54"
          y="43"
          fontFamily="var(--font-playfair), 'Oswald', Georgia, serif"
          fontSize="17"
          fontWeight="700"
          letterSpacing="0.38em"
          fill={color}
        >
          ORA
        </text>
      </svg>
    </Link>
  );
}
