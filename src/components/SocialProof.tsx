'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';

interface SocialProofProps {
  locale: Locale;
}

interface Review {
  author: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export default function SocialProof({ locale }: SocialProofProps) {
  const { t, tArray } = getTranslations(locale);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reviews: Review[] = tArray<Review>('proof.reviews');

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

  // Auto-advance carousel
  useEffect(() => {
    if (!Array.isArray(reviews) || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews]);

  const safeReviews: Review[] = Array.isArray(reviews) ? reviews : [];

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-cream"
      aria-labelledby="reviews-heading"
    >
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label justify-center mb-4 reveal">{t('proof.sectionLabel')}</p>
          <h2
            id="reviews-heading"
            className="font-serif text-display-lg text-primary mb-4 reveal reveal-delay-1"
          >
            {t('proof.headline')}
          </h2>

          {/* Overall Rating */}
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-2xl shadow-card reveal reveal-delay-2">
            <div className="stars text-2xl">★★★★★</div>
            <div className="text-left">
              <p className="font-serif text-2xl font-bold text-primary leading-none">4.9</p>
              <p className="text-xs text-warm-light">{t('proof.totalReviews')}</p>
            </div>
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {safeReviews.map((review, index) => (
            <ReviewCard
              key={review.author}
              review={review}
              index={index}
            />
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-premium"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {safeReviews.map((review, i) => (
                <div key={review.author} className="w-full flex-shrink-0 px-1">
                  <ReviewCard review={review} index={i} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {safeReviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Review ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 bg-sand' : 'w-1.5 bg-warm-pale'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Marquee strip */}
        <div className="mt-16 overflow-hidden">
          <div className="marquee-track py-4 border-y border-warm-pale">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {[
                  '⭐ 4.9/5 Note globale',
                  '✓ Livraison gratuite Europe',
                  '🔒 Paiement sécurisé SSL',
                  '↩ Retours 30 jours',
                  '🛡️ Garantie 3 ans',
                  '🌍 42 pays explorés',
                  '👥 2 000+ clients satisfaits',
                  '⚡ Installation 60 secondes',
                ].map((item) => (
                  <span key={item} className="inline-flex items-center gap-8 mx-8 text-sm font-medium text-warm-light whitespace-nowrap">
                    {item}
                    <span className="text-sand-light">•</span>
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <article
      className={`bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 reveal reveal-delay-${Math.min(index + 1, 4)}`}
    >
      {/* Stars */}
      <div className="stars text-sm mb-4">
        {'★'.repeat(review.rating)}
        {'☆'.repeat(5 - review.rating)}
      </div>

      {/* Text */}
      <blockquote className="text-sm text-warm leading-relaxed mb-5">
        &ldquo;{review.text}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-primary text-sm">{review.author}</p>
          <p className="text-xs text-warm-light">{review.location}</p>
        </div>
        <div className="text-right">
          {review.verified && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sand uppercase tracking-wide">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Vérifié
            </span>
          )}
          <p className="text-[10px] text-warm-light mt-1">{review.date}</p>
        </div>
      </div>
    </article>
  );
}
