'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale, ShopifyProduct } from '@/types';
import { getTranslations } from '@/lib/i18n';
import { useCart } from '@/context/CartContext';
import { formatMoney, getDiscountPercentage } from '@/lib/shopify';
import { trackViewItem } from '@/lib/analytics';

interface FeaturedProductProps {
  locale: Locale;
  product: ShopifyProduct | null;
}

export default function FeaturedProduct({ locale, product }: FeaturedProductProps) {
  const { t, tArray } = getTranslations(locale);
  const { addToCart, isLoading } = useCart();
  const [adding, setAdding] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const firstVariant = product?.variants.nodes[0];
  const price = firstVariant?.price;
  const compareAt = firstVariant?.compareAtPrice;
  const discount = price && compareAt
    ? getDiscountPercentage(price.amount, compareAt.amount)
    : 0;

  useEffect(() => {
    if (!product) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && price) {
          trackViewItem({
            id: product.id,
            name: product.title,
            price: parseFloat(price.amount),
            currency: price.currencyCode,
            category: 'Rooftop Tent',
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [product, price]);

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

  const handleAddToCart = async () => {
    if (!firstVariant || adding) return;
    setAdding(true);
    try {
      await addToCart(firstVariant.id, 1);
    } finally {
      setAdding(false);
    }
  };

  const img = product?.featuredImage;

  const specs = tArray<string>('featured.specs');
  const specsList = specs;

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-off"
      aria-labelledby="featured-product-heading"
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="relative reveal">
            {/* Badge */}
            {discount > 0 && (
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-primary">
                  {t('featured.badge')}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-sand">
                  -{discount}%
                </span>
              </div>
            )}

            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden image-zoom shadow-premium-lg bg-cream">
              {img ? (
                <Image
                  src={img.url}
                  alt={img.altText || product?.title || 'Wildora Explorer Pro'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full skeleton" />
              )}
            </div>

            {/* Floating review badge */}
            <div className="absolute -bottom-4 right-6 glass-dark rounded-2xl px-4 py-3 shadow-premium-dark">
              <div className="flex items-center gap-2">
                <div className="stars text-sm">★★★★★</div>
                <div>
                  <p className="text-white text-xs font-bold leading-tight">4.9/5</p>
                  <p className="text-white/60 text-[10px]">2 147 {t('featured.reviews')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6">
            <div>
              <p className="section-label mb-4 reveal">{t('featured.sectionLabel')}</p>
              <h2
                id="featured-product-heading"
                className="font-serif text-display-lg text-primary mb-2 reveal reveal-delay-1"
              >
                {product?.title || t('featured.subheadline')}
              </h2>
              <p className="text-warm text-lg reveal reveal-delay-2">
                {t('featured.tagline')}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 reveal reveal-delay-2">
              {price && (
                <span className="font-serif text-3xl font-bold text-primary">
                  {formatMoney(price.amount, price.currencyCode)}
                </span>
              )}
              {compareAt && (
                <span className="text-xl text-warm-light line-through">
                  {formatMoney(compareAt.amount, compareAt.currencyCode)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm font-bold text-sand px-2 py-1 bg-sand-pale rounded-md">
                  {t('featured.from').replace('À partir de', '')} -{discount}%
                </span>
              )}
            </div>

            {/* Specs */}
            {specsList.length > 0 && (
              <ul className="space-y-2 reveal reveal-delay-3">
                {specsList.map((spec) => (
                  <li key={spec} className="flex items-center gap-2 text-sm text-warm">
                    <span className="w-4 h-4 flex items-center justify-center rounded-full bg-sand-pale text-sand flex-shrink-0">
                      <CheckIcon className="w-2.5 h-2.5" />
                    </span>
                    {spec}
                  </li>
                ))}
              </ul>
            )}

            {/* Stock Urgency */}
            {firstVariant && firstVariant.quantityAvailable <= 8 && (
              <div className="flex items-center gap-2 px-4 py-3 bg-sand-pale rounded-xl reveal reveal-delay-3">
                <span className="w-2 h-2 rounded-full bg-sand animate-pulse flex-shrink-0" />
                <p className="text-sm font-semibold text-sand">
                  {t('product.lowStock', { count: String(firstVariant.quantityAvailable) })}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 reveal reveal-delay-4">
              <button
                onClick={handleAddToCart}
                disabled={adding || isLoading || !firstVariant?.availableForSale}
                className="btn-primary flex-1 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {adding || isLoading ? (
                  <span className="flex items-center gap-2">
                    <SpinnerIcon className="w-4 h-4 animate-spin" />
                    {t('featured.addingToCart')}
                  </span>
                ) : !firstVariant?.availableForSale ? (
                  t('featured.outOfStock')
                ) : (
                  <>
                    <CartIcon className="w-4 h-4" />
                    {t('featured.addToCart')}
                  </>
                )}
              </button>
              <Link
                href={`/${locale}/produits/${product?.handle || 'wildora-explorer-pro'}`}
                className="btn-secondary flex-1 py-4 text-base text-center"
              >
                {t('featured.viewProduct')}
              </Link>
            </div>

            {/* Mini trust */}
            <div className="flex flex-wrap gap-4 pt-2 reveal reveal-delay-4">
              {[
                { icon: '🔒', text: locale === 'fr' ? 'Paiement sécurisé' : 'Secure payment' },
                { icon: '↩', text: locale === 'fr' ? 'Retours 30j' : '30-day returns' },
                { icon: '🛡️', text: locale === 'fr' ? 'Garantie 3 ans' : '3-year warranty' },
              ].map((b) => (
                <span key={b.text} className="flex items-center gap-1.5 text-xs text-warm-light">
                  <span>{b.icon}</span>{b.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function CartIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
}
function SpinnerIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
}
