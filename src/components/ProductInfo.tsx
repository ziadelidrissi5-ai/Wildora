'use client';

import React, { useState, useEffect } from 'react';
import type { Locale, ShopifyProduct, ShopifyProductVariant } from '@/types';
import { getTranslations } from '@/lib/i18n';
import { useCart } from '@/context/CartContext';
import { formatMoney, getDiscountPercentage } from '@/lib/shopify';
import { trackAddToCart } from '@/lib/analytics';
import FAQ from './FAQ';

interface ProductInfoProps {
  product: ShopifyProduct;
  locale: Locale;
}

type Tab = 'description' | 'specs' | 'reviews' | 'shipping';

export default function ProductInfo({ product, locale }: ProductInfoProps) {
  const { t } = getTranslations(locale);
  const { addToCart, isLoading } = useCart();
  const [adding, setAdding] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant>(
    product.variants.nodes[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<Tab>('description');
  const [added, setAdded] = useState(false);

  const variants = product.variants.nodes;
  const price = selectedVariant.price;
  const compareAt = selectedVariant.compareAtPrice;
  const discount = compareAt
    ? getDiscountPercentage(price.amount, compareAt.amount)
    : 0;

  // Group options by name
  const optionMap: Record<string, string[]> = {};
  variants.forEach((v) => {
    v.selectedOptions.forEach(({ name, value }) => {
      if (!optionMap[name]) optionMap[name] = [];
      if (!optionMap[name].includes(value)) optionMap[name].push(value);
    });
  });

  const selectedOptions: Record<string, string> = Object.fromEntries(
    selectedVariant.selectedOptions.map(({ name, value }) => [name, value])
  );

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    const match = variants.find((v) =>
      v.selectedOptions.every((o) => newOptions[o.name] === o.value)
    );
    if (match) setSelectedVariant(match);
  };

  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);
    try {
      await addToCart(selectedVariant.id, quantity);
      trackAddToCart({
        id: product.id,
        name: product.title,
        variantId: selectedVariant.id,
        price: parseFloat(price.amount),
        currency: price.currencyCode,
        quantity,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } finally {
      setAdding(false);
    }
  };

  const isAvailable = selectedVariant.availableForSale;
  const isLowStock = isAvailable && selectedVariant.quantityAvailable <= 8;

  const TABS: { id: Tab; label: string }[] = [
    { id: 'description', label: t('product.tabs.description') },
    { id: 'specs', label: t('product.tabs.specs') },
    { id: 'reviews', label: t('product.tabs.reviews') },
    { id: 'shipping', label: t('product.tabs.shipping') },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Rating */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="font-serif text-display-md text-primary leading-tight">
            {product.title}
          </h1>
          {product.tags.includes('bestseller') && (
            <span className="flex-shrink-0 px-3 py-1 bg-sand text-white text-xs font-bold rounded-full">
              Bestseller
            </span>
          )}
        </div>

        {/* Stars */}
        <div className="flex items-center gap-2">
          <div className="stars text-base">★★★★★</div>
          <span className="text-sm text-warm-light">(4.9) — 2 147 {t('featured.reviews')}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-3xl font-bold text-primary">
          {formatMoney(price.amount, price.currencyCode)}
        </span>
        {compareAt && (
          <span className="text-xl text-warm-light line-through">
            {formatMoney(compareAt.amount, compareAt.currencyCode)}
          </span>
        )}
        {discount > 0 && (
          <span className="text-sm font-bold text-white bg-sand px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isAvailable ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-700">
              {isLowStock
                ? t('product.lowStock', { count: String(selectedVariant.quantityAvailable) })
                : t('product.inStock')}
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-sm font-medium text-red-600">{t('product.noStock')}</span>
          </>
        )}
        <span className="text-warm-light text-sm">·</span>
        <span className="text-sm text-sand font-medium flex items-center gap-1">
          <TruckIcon className="w-3.5 h-3.5" />
          {t('product.freeShipping')}
        </span>
      </div>

      {/* Variant Options */}
      {Object.entries(optionMap).map(([name, values]) => (
        <div key={name}>
          <p className="text-sm font-semibold text-primary mb-3">
            {name === 'Couleur' || name === 'Color' ? t('product.variant') : t('product.size')}
            : <span className="text-warm font-normal">{selectedOptions[name]}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const variantForOption = variants.find((v) =>
                v.selectedOptions.some((o) => o.name === name && o.value === value)
              );
              const isSelected = selectedOptions[name] === value;
              const isUnavailable = !variantForOption?.availableForSale;

              return (
                <button
                  key={value}
                  onClick={() => handleOptionChange(name, value)}
                  disabled={isUnavailable}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : isUnavailable
                        ? 'border-warm-pale text-warm-light line-through cursor-not-allowed opacity-50'
                        : 'border-warm-pale text-warm hover:border-primary hover:text-primary'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quantity */}
      <div>
        <p className="text-sm font-semibold text-primary mb-3">{t('product.quantity')}</p>
        <div className="inline-flex items-center border border-warm-pale rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Diminuer"
            className="w-11 h-11 flex items-center justify-center text-warm hover:bg-warm-pale transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <span className="w-12 text-center text-base font-bold text-primary">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Augmenter"
            className="w-11 h-11 flex items-center justify-center text-warm hover:bg-warm-pale transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>

      {/* CTA Buttons — Sticky on mobile */}
      <div className="sticky bottom-0 -mx-4 px-4 pb-4 pt-3 bg-white/95 backdrop-blur-sm md:static md:mx-0 md:px-0 md:pb-0 md:pt-0 md:bg-transparent md:backdrop-blur-none space-y-3 z-20 border-t border-warm-pale md:border-none">
        {!isAvailable ? (
          <button disabled className="btn-primary w-full py-4 text-base opacity-50 cursor-not-allowed">
            {t('product.outOfStock')}
          </button>
        ) : added ? (
          <button className="btn-sand w-full py-4 text-base">
            <CheckIcon className="w-5 h-5" />
            {locale === 'fr' ? 'Ajouté au panier !' : 'Added to cart!'}
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={adding || isLoading}
            className="btn-primary w-full py-4 text-base disabled:opacity-60"
          >
            {adding ? (
              <span className="flex items-center gap-2">
                <SpinnerIcon className="w-4 h-4 animate-spin" />
                {t('product.addingToCart')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CartIcon className="w-5 h-5" />
                {t('product.addToCart')}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="pt-4">
        <div className="flex border-b border-warm-pale overflow-x-auto scrollbar-hide">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px ${
                tab === id
                  ? 'text-primary border-primary'
                  : 'text-warm-light border-transparent hover:text-warm'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="pt-6">
          {tab === 'description' && (
            <div
              className="prose prose-sm prose-warm max-w-none text-warm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml || `<p>${product.description}</p>` }}
            />
          )}

          {tab === 'specs' && (
            <div className="space-y-3">
              {[
                { label: locale === 'fr' ? 'Dimensions ouvert' : 'Open dimensions', value: '140 × 240 cm' },
                { label: locale === 'fr' ? 'Dimensions fermé' : 'Closed dimensions', value: '140 × 130 × 25 cm' },
                { label: locale === 'fr' ? 'Poids total' : 'Total weight', value: '42 kg' },
                { label: locale === 'fr' ? 'Charge maximale' : 'Max load capacity', value: '200 kg (statique)' },
                { label: locale === 'fr' ? 'Matériau coque' : 'Shell material', value: 'Aluminium 5052-H32' },
                { label: locale === 'fr' ? 'Matériau toile' : 'Canvas material', value: 'Polycoton 600D' },
                { label: locale === 'fr' ? 'Résistance eau' : 'Water resistance', value: '3 000mm (grade 4)' },
                { label: locale === 'fr' ? 'Matelas' : 'Mattress', value: locale === 'fr' ? 'Mousse haute densité 65mm' : 'High-density foam 65mm' },
                { label: locale === 'fr' ? 'Temps d\'installation' : 'Setup time', value: '< 60 secondes' },
                { label: locale === 'fr' ? 'Saisons' : 'Seasons', value: locale === 'fr' ? '4 saisons' : '4-season' },
              ].map((spec) => (
                <div key={spec.label} className="flex justify-between py-2 border-b border-warm-pale">
                  <span className="text-sm text-warm-light">{spec.label}</span>
                  <span className="text-sm font-semibold text-primary">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-cream rounded-xl">
                <div className="text-center">
                  <p className="font-serif text-4xl font-bold text-primary">4.9</p>
                  <div className="stars text-sm mt-1">★★★★★</div>
                  <p className="text-xs text-warm-light mt-1">2 147 {t('product.reviewsTitle')}</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 88 : star === 4 ? 9 : star === 3 ? 2 : 1;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs w-2 text-warm-light">{star}</span>
                        <div className="flex-1 h-1.5 bg-warm-pale rounded-full overflow-hidden">
                          <div className="h-full bg-sand rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-warm-light w-6">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <FAQ locale={locale} />
            </div>
          )}

          {tab === 'shipping' && (
            <div className="space-y-6">
              {[
                { title: t('product.shipping.deliveryTitle'), content: t('product.shipping.delivery') },
                { title: t('product.shipping.returnsTitle'), content: t('product.shipping.returns') },
                { title: t('product.shipping.warrantyTitle'), content: t('product.shipping.warranty') },
              ].map(({ title, content }) => (
                <div key={title}>
                  <h3 className="font-semibold text-primary text-sm mb-2">{title}</h3>
                  <p className="text-sm text-warm leading-relaxed whitespace-pre-line">{content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CartIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
}
function CheckIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function SpinnerIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
}
function TruckIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
}
