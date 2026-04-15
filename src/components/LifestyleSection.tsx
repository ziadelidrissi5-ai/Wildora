'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';

interface LifestyleSectionProps {
  locale: Locale;
}

const IMAGES = [
  {
    src: 'https://unsplash.com/photos/a-4x4-travels-through-the-desert-sands-Frn_KV_fROc/download?force=true&w=1600',
    alt: '4x4 avec tente de toit sur les dunes',
    labelKey: 'lifestyle.card1',
    span: 'lg:col-span-2 lg:row-span-2',
    aspect: 'aspect-[3/2] lg:aspect-auto',
  },
  {
    src: 'https://unsplash.com/photos/sahara-desert-KMM9KskzuGY/download?force=true&w=900',
    alt: 'Campement au Sahara au coucher du soleil',
    labelKey: 'lifestyle.card2',
    span: 'lg:col-span-1',
    aspect: 'aspect-square',
  },
  {
    src: 'https://unsplash.com/photos/a-tent-is-pitched-up-in-the-woods-Md1fvql3Kk0/download?force=true&w=900',
    alt: 'Camp en forêt avec tente de toit',
    labelKey: 'lifestyle.card3',
    span: 'lg:col-span-1',
    aspect: 'aspect-square',
  },
  {
    src: 'https://unsplash.com/photos/tent-set-up-in-a-forest-with-mountains-in-background-ANhJ9FO9Hjg/download?force=true&w=1200',
    alt: 'Tente de toit à lisière de forêt',
    labelKey: 'lifestyle.card4',
    span: 'lg:col-span-1',
    aspect: 'aspect-[4/3]',
  },
  {
    src: 'https://unsplash.com/photos/a-tent-is-pitched-up-in-the-desert-eMIrlZFtvU4/download?force=true&w=1200',
    alt: 'Tente premium et 4x4 dans le désert',
    labelKey: 'lifestyle.card5',
    span: 'lg:col-span-2',
    aspect: 'aspect-[16/9]',
  },
];

export default function LifestyleSection({ locale }: LifestyleSectionProps) {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-primary text-white overflow-hidden"
      aria-labelledby="lifestyle-heading"
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-12">
          <div>
            <p className="section-label text-sand mb-4 reveal">{t('lifestyle.sectionLabel')}</p>
            <h2
              id="lifestyle-heading"
              className="font-serif text-display-lg uppercase tracking-[0.04em] text-white reveal reveal-delay-1"
            >
              {t('lifestyle.headline')}
            </h2>
          </div>
          <div className="reveal reveal-delay-2">
            <p className="text-white/65 text-lg leading-relaxed mb-6">
              {t('lifestyle.description')}
            </p>
            <Link
              href={`/${locale}/produits`}
              className="inline-flex items-center gap-2 text-sand font-semibold group"
            >
              {t('lifestyle.cta')}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 auto-rows-auto lg:auto-rows-[220px]">
          {IMAGES.map((img, index) => {
            const cardKey = img.labelKey as
              | 'lifestyle.card1'
              | 'lifestyle.card2'
              | 'lifestyle.card3'
              | 'lifestyle.card4'
              | 'lifestyle.card5';
            return (
              <div
                key={img.src}
                className={`relative group overflow-hidden rounded-2xl image-zoom ${img.span} ${img.aspect} reveal reveal-delay-${index + 1}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs text-white/70 uppercase tracking-widest font-semibold mb-1">
                    {t(`${cardKey}.label` as string)}
                  </p>
                  <p className="text-white font-serif text-lg font-bold leading-tight">
                    {t(`${cardKey}.text` as string)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
