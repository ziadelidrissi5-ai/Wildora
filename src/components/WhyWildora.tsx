'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';

interface WhyWildoraProps {
  locale: Locale;
}

export default function WhyWildora({ locale }: WhyWildoraProps) {
  const { t, tRaw } = getTranslations(locale);
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    tRaw<{ value: string; label: string }>('whyWildora.stat1'),
    tRaw<{ value: string; label: string }>('whyWildora.stat2'),
    tRaw<{ value: string; label: string }>('whyWildora.stat3'),
  ];

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-cream relative overflow-hidden"
      aria-labelledby="why-wildora-heading"
    >
      {/* Background decoration */}
      <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-sand-pale opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute -left-40 -bottom-40 w-96 h-96 rounded-full bg-sand-pale opacity-30 blur-3xl pointer-events-none" />

      <div className="container-wide relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative reveal order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden image-zoom shadow-premium-lg">
              <Image
                src="https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80"
                alt="Fondateurs de Wildora — aventure vanlife"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>

            {/* Stats Cards */}
            <div className="absolute -bottom-6 -right-4 md:-right-8 grid grid-cols-3 gap-2">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="glass-dark rounded-xl p-3 text-center shadow-premium-dark"
                >
                  <p className="font-serif font-bold text-white text-sm md:text-base leading-tight">
                    {stat?.value || '—'}
                  </p>
                  <p className="text-white/60 text-[9px] md:text-[10px] leading-tight mt-0.5">
                    {stat?.label || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <div>
              <p className="section-label mb-4 reveal">{t('whyWildora.sectionLabel')}</p>
              <h2
                id="why-wildora-heading"
                className="font-serif text-display-lg text-primary reveal reveal-delay-1"
              >
                {t('whyWildora.headline')}<br />
                <span className="text-sand italic">{t('whyWildora.headlineAccent')}</span>
              </h2>
            </div>

            <p className="text-warm text-lg leading-relaxed reveal reveal-delay-2">
              {t('whyWildora.paragraph1')}
            </p>
            <p className="text-warm leading-relaxed reveal reveal-delay-3">
              {t('whyWildora.paragraph2')}
            </p>

            <Link
              href={`/${locale}/a-propos`}
              className="btn-primary inline-flex mt-4 reveal reveal-delay-4"
            >
              {t('whyWildora.cta')}
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
