'use client';

import React, { useEffect, useRef } from 'react';
import type { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';

interface BenefitsProps {
  locale: Locale;
}

const ICONS: Record<string, React.ReactNode> = {
  freedom: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  comfort: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  setup: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  durability: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
};

export default function Benefits({ locale }: BenefitsProps) {
  const { t, tArray } = getTranslations(locale);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => {
              el.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const items = tArray<{
    icon: string;
    title: string;
    description: string;
  }>('benefits.items');

  const benefitItems = items;

  return (
    <section ref={sectionRef} className="section-padding bg-white" aria-labelledby="benefits-heading">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label justify-center mb-4 reveal">{t('benefits.sectionLabel')}</p>
          <h2
            id="benefits-heading"
            className="font-serif text-display-lg text-primary reveal reveal-delay-1"
          >
            {t('benefits.headline')}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {benefitItems.map((item, index) => (
            <article
              key={item.icon}
              className={`group reveal reveal-delay-${index + 1}`}
            >
              <div className="flex flex-col gap-5">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-sand-pale flex items-center justify-center text-sand group-hover:bg-sand group-hover:text-white transition-all duration-300">
                  <div className="w-6 h-6">{ICONS[item.icon] || ICONS.freedom}</div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-serif text-xl font-bold text-primary mb-2 group-hover:text-sand transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-warm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-20 pt-12 border-t border-warm-pale">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2 000+', label: locale === 'fr' ? 'Clients satisfaits' : 'Happy customers' },
              { value: '4.9/5', label: locale === 'fr' ? 'Note moyenne' : 'Average rating' },
              { value: '42', label: locale === 'fr' ? 'Pays explorés' : 'Countries explored' },
              { value: '3 ans', label: locale === 'fr' ? 'Garantie' : 'Warranty' },
            ].map((stat, i) => (
              <div key={stat.label} className={`reveal reveal-delay-${i + 1}`}>
                <p className="font-serif text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-warm-light uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
