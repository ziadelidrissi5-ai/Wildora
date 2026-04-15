'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';

interface UrgencyBannerProps {
  locale: Locale;
  stockCount?: number;
}

export default function UrgencyBanner({ locale, stockCount = 5 }: UrgencyBannerProps) {
  const { t } = getTranslations(locale);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 47, seconds: 32 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2520 50%, #1a1a1a 100%)',
      }}
      aria-labelledby="urgency-heading"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=2000&q=40")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="container-narrow relative z-10 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-sand/20 border border-sand/30 rounded-full text-sand text-xs font-bold uppercase tracking-widest mb-6 reveal">
          <span className="w-1.5 h-1.5 rounded-full bg-sand animate-pulse" />
          {t('urgency.badge')}
        </span>

        {/* Headline */}
        <h2
          id="urgency-heading"
          className="font-serif text-display-lg text-white mb-4 reveal reveal-delay-1"
        >
          {t('urgency.headline')}
        </h2>

        {/* Body */}
        <p className="text-white/70 text-lg mb-8 reveal reveal-delay-2 max-w-xl mx-auto">
          {t('urgency.text')}
        </p>

        {/* Stock Indicator */}
        <div className="inline-flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl px-5 py-3 mb-8 reveal reveal-delay-2">
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm transition-colors ${
                  i < stockCount ? 'bg-sand' : 'bg-white/15'
                }`}
              />
            ))}
          </div>
          <span className="text-white text-sm font-semibold">
            {t('urgency.stockText', { count: String(stockCount) })}
          </span>
        </div>

        {/* Timer */}
        <div className="mb-10 reveal reveal-delay-3">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-4">
            {t('urgency.timer.label')}
          </p>
          <div className="flex items-center justify-center gap-3">
            {[
              { value: pad(timeLeft.hours), label: t('urgency.timer.hours') },
              { value: pad(timeLeft.minutes), label: t('urgency.timer.minutes') },
              { value: pad(timeLeft.seconds), label: t('urgency.timer.seconds') },
            ].map((unit, i) => (
              <React.Fragment key={unit.label}>
                {i > 0 && <span className="text-sand text-2xl font-bold pb-4">:</span>}
                <div className="flex flex-col items-center">
                  <div className="bg-white/8 border border-white/10 rounded-xl px-5 py-3 min-w-[64px]">
                    <span className="font-serif text-3xl font-bold text-white tabular-nums">
                      {unit.value}
                    </span>
                  </div>
                  <span className="text-white/40 text-[10px] uppercase tracking-wider mt-2">
                    {unit.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal reveal-delay-4">
          <Link
            href={`/${locale}/produits/wildora-explorer-pro`}
            className="btn-sand text-base py-4 px-10 shadow-[0_8px_40px_rgba(196,153,95,0.4)]"
          >
            {t('urgency.cta')}
            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
