'use client';

import React, { useEffect, useRef } from 'react';
import type { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';

interface TrustBadgesProps {
  locale: Locale;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

export default function TrustBadges({ locale }: TrustBadgesProps) {
  const { t, tArray } = getTranslations(locale);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const badges = tArray<{
    icon: string;
    title: string;
    description: string;
  }>('trust.badges');

  const safeBadges = Array.isArray(badges) ? badges : [];

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-white border-y border-warm-pale"
      aria-label={t('trust.headline')}
    >
      <div className="container-wide">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-warm-light mb-10 reveal">
          {t('trust.headline')}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {safeBadges.map((badge, index) => (
            <div
              key={badge.icon}
              className={`flex flex-col items-center text-center gap-3 group reveal reveal-delay-${index + 1}`}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl border border-warm-pale flex items-center justify-center text-sand group-hover:bg-sand group-hover:border-sand group-hover:text-white transition-all duration-300">
                <div className="w-6 h-6">
                  {BADGE_ICONS[badge.icon] || BADGE_ICONS.shield}
                </div>
              </div>

              {/* Text */}
              <div>
                <p className="font-semibold text-primary text-sm mb-1">{badge.title}</p>
                <p className="text-xs text-warm-light leading-relaxed">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 reveal">
          {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Stripe'].map((method) => (
            <span
              key={method}
              className="px-4 py-2 border border-warm-pale rounded-lg text-xs font-semibold text-warm-light bg-white"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
