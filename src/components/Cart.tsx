'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import type { Locale } from '@/types';
import { getTranslations } from '@/lib/i18n';
import { useCart } from '@/context/CartContext';
import { formatMoney } from '@/lib/shopify';
import { trackBeginCheckout } from '@/lib/analytics';

interface CartProps {
  locale: Locale;
}

const FREE_SHIPPING_THRESHOLD = 99;

export default function Cart({ locale }: CartProps) {
  const { t } = getTranslations(locale);
  const { cart, isOpen, isLoading, closeCart, removeFromCart, updateQuantity } = useCart();

  const subtotal = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const currency = cart?.cost.subtotalAmount.currencyCode || 'EUR';
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    if (!cart?.checkoutUrl) return;
    trackBeginCheckout(
      parseFloat(cart.cost.totalAmount.amount),
      cart.cost.totalAmount.currencyCode,
      cart.totalQuantity
    );
    window.location.href = cart.checkoutUrl;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="cart-overlay"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="cart-drawer animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-lg font-bold text-primary">{t('cart.title')}</h2>
            {cart && cart.totalQuantity > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sand text-white text-xs font-bold">
                {cart.totalQuantity}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label={t('common.close')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-warm-pale transition-colors text-warm"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cart && cart.totalQuantity > 0 && (
          <div className="px-5 py-3 bg-sand-pale">
            {hasFreeShipping ? (
              <p className="text-xs font-semibold text-sand text-center">
                {t('cart.freeShippingBanner')}
              </p>
            ) : (
              <div>
                <p className="text-xs text-warm mb-2">
                  {t('cart.freeShippingProgress', {
                    amount: formatMoney(remaining.toFixed(2), currency),
                  })}
                </p>
                <div className="h-1 bg-sand-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sand rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Lines */}
        <div className="flex-1 overflow-y-auto">
          {!cart || cart.totalQuantity === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-warm-pale flex items-center justify-center mb-4">
                <BagIcon className="w-7 h-7 text-warm-light" />
              </div>
              <p className="font-serif text-lg font-bold text-primary mb-2">{t('cart.empty')}</p>
              <p className="text-sm text-warm-light mb-6">{t('cart.emptyDescription')}</p>
              <button onClick={closeCart} className="btn-secondary text-sm">
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 px-5 py-2">
              {cart.lines.nodes.map((line) => {
                const total = parseFloat(line.cost.totalAmount.amount);
                const img = line.merchandise.product.featuredImage;
                return (
                  <li key={line.id} className="py-4 flex gap-3">
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                      {img && (
                        <Image
                          src={img.url}
                          alt={img.altText || line.merchandise.product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary leading-snug line-clamp-2 mb-0.5">
                        {line.merchandise.product.title}
                      </p>
                      {line.merchandise.title !== 'Default Title' && (
                        <p className="text-xs text-warm-light mb-2">{line.merchandise.title}</p>
                      )}

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-warm-pale rounded-md overflow-hidden">
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity - 1)}
                            disabled={isLoading}
                            aria-label="Diminuer"
                            className="w-7 h-7 flex items-center justify-center text-warm hover:bg-warm-pale transition-colors disabled:opacity-40"
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold text-primary">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            disabled={isLoading}
                            aria-label="Augmenter"
                            className="w-7 h-7 flex items-center justify-center text-warm hover:bg-warm-pale transition-colors disabled:opacity-40"
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-bold text-primary">
                          {formatMoney(total.toFixed(2), line.cost.totalAmount.currencyCode)}
                        </p>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(line.id)}
                      disabled={isLoading}
                      aria-label={t('cart.remove')}
                      className="self-start mt-1 text-warm-light hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart && cart.totalQuantity > 0 && (
          <div className="border-t border-gray-100 px-5 pt-4 pb-6 space-y-4 bg-white">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-warm">
                <span>{t('cart.subtotal')}</span>
                <span>{formatMoney(cart.cost.subtotalAmount.amount, currency)}</span>
              </div>
              <div className="flex justify-between text-sm text-warm">
                <span>{t('cart.shipping')}</span>
                <span className={hasFreeShipping ? 'text-sand font-semibold' : ''}>
                  {hasFreeShipping ? t('cart.shippingFree') : t('cart.shippingCalculated')}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-primary pt-2 border-t border-gray-100">
                <span>{t('cart.total')}</span>
                <span>{formatMoney(cart.cost.totalAmount.amount, currency)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="btn-primary w-full text-base py-3.5 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                  {t('common.loading')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LockIcon className="w-4 h-4" />
                  {t('cart.checkout')}
                </span>
              )}
            </button>

            <p className="text-center text-xs text-warm-light flex items-center justify-center gap-1.5">
              <ShieldIcon className="w-3.5 h-3.5" />
              {t('cart.secureCheckout')}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// Icons
function XIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;
}
function BagIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
}
function MinusIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function PlusIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function TrashIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
}
function LockIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
}
function ShieldIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function SpinnerIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
}
