'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';

interface FAQProps {
  locale: Locale;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ({ locale }: FAQProps) {
  const { t, tArray } = getTranslations(locale);
  const [open, setOpen] = useState<number | null>(0);
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

  const items = tArray<FAQItem>('faq.items');
  const safeItems: FAQItem[] = Array.isArray(items) ? items : [];

  return (
    <div ref={sectionRef} className="space-y-2">
      {safeItems.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            key={index}
            className={`border rounded-xl overflow-hidden transition-all duration-300 reveal reveal-delay-${Math.min(index + 1, 4)} ${
              isOpen ? 'border-sand/40 bg-sand-pale/30' : 'border-warm-pale bg-white hover:border-sand/20'
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span className="font-semibold text-primary text-sm md:text-base pr-4">
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-300 ${
                  isOpen ? 'border-sand bg-sand text-white' : 'border-warm-pale text-warm'
                }`}
              >
                <svg
                  className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </span>
            </button>

            <div
              className="faq-answer"
              style={{
                maxHeight: isOpen ? '400px' : '0',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p className="px-6 pb-5 text-sm text-warm leading-relaxed">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
