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
    sm: { width: 120, height: 28 },
    md: { width: 148, height: 34 },
    lg: { width: 180, height: 42 },
  };

  const { width, height } = sizes[size];

  return (
    <Link href={`/${locale}`} aria-label="Wildora — Accueil">
      <svg
        width={width}
        height={height}
        viewBox="0 0 148 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* W mark — two mountain peaks */}
        <polyline
          points="2,6 8,26 14,12 20,26 26,6"
          stroke={color}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Wordmark */}
        <text
          x="34"
          y="24"
          fontFamily="var(--font-playfair), 'Oswald', Georgia, serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="0.28em"
          fill={color}
        >
          WILDORA
        </text>
      </svg>
    </Link>
  );
}
