'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';

interface FinalCTAProps {
  locale: Locale;
}

export default function FinalCTA({ locale }: FinalCTAProps) {
  const { t } = getTranslations(locale);
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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[500px] flex items-center justify-center overflow-hidden"
      aria-labelledby="final-cta-heading"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://unsplash.com/photos/a-tent-is-pitched-up-in-the-desert-eMIrlZFtvU4/download?force=true&w=2000"
          alt={locale === 'fr' ? 'Campement Wildora dans le désert' : 'Wildora camp in the desert'}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
      </div>

      {/* Content */}
      <div className="container-narrow relative z-10 text-center py-section">
        <p className="section-label text-sand justify-center mb-6 reveal">
          {locale === 'fr' ? 'L\'aventure vous attend' : 'Adventure awaits'}
        </p>
        <h2
          id="final-cta-heading"
          className="font-serif text-display-xl uppercase tracking-[0.04em] text-white mb-6 reveal reveal-delay-1"
        >
          {t('finalCta.headline')}
        </h2>
        <p className="text-xl text-white/75 mb-10 max-w-lg mx-auto reveal reveal-delay-2">
          {t('finalCta.subheadline')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center reveal reveal-delay-3">
          <Link
            href={`/${locale}/produits`}
            className="btn-sand text-base py-4 px-10 shadow-[0_8px_40px_rgba(196,153,95,0.35)]"
          >
            {t('finalCta.cta')}
            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="btn-ghost text-base py-4 px-10"
          >
            {t('finalCta.ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
