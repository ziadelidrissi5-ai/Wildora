'use client';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const ADD_TO_CART_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_ADD_TO_CART_LABEL;
const CHECKOUT_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CHECKOUT_LABEL;

function isAnalyticsReady(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

// ─── Page Views ────────────────────────────────────────────────────────────────

export function trackPageView(url: string, title?: string): void {
  if (!isAnalyticsReady() || !GA4_ID) return;
  window.gtag('config', GA4_ID, {
    page_path: url,
    page_title: title,
  });
}

// ─── E-commerce Events ────────────────────────────────────────────────────────

export function trackViewItem(product: {
  id: string;
  name: string;
  price: number;
  currency: string;
  category?: string;
}): void {
  if (!isAnalyticsReady()) return;

  // GA4
  if (GA4_ID) {
    window.gtag('event', 'view_item', {
      currency: product.currency,
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          item_category: product.category || 'Rooftop Tent',
          quantity: 1,
        },
      ],
    });
  }
}

export function trackAddToCart(product: {
  id: string;
  name: string;
  variantId: string;
  price: number;
  currency: string;
  quantity: number;
}): void {
  if (!isAnalyticsReady()) return;

  // GA4
  if (GA4_ID) {
    window.gtag('event', 'add_to_cart', {
      currency: product.currency,
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_variant: product.variantId,
          price: product.price,
          quantity: product.quantity,
        },
      ],
    });
  }

  // Google Ads
  if (GADS_ID && ADD_TO_CART_LABEL) {
    window.gtag('event', 'conversion', {
      send_to: `${GADS_ID}/${ADD_TO_CART_LABEL}`,
      value: product.price * product.quantity,
      currency: product.currency,
    });
  }
}

export function trackBeginCheckout(value: number, currency: string, itemCount: number): void {
  if (!isAnalyticsReady()) return;

  // GA4
  if (GA4_ID) {
    window.gtag('event', 'begin_checkout', {
      currency,
      value,
      num_items: itemCount,
    });
  }

  // Google Ads
  if (GADS_ID && CHECKOUT_LABEL) {
    window.gtag('event', 'conversion', {
      send_to: `${GADS_ID}/${CHECKOUT_LABEL}`,
      value,
      currency,
    });
  }
}

export function trackRemoveFromCart(product: {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
}): void {
  if (!isAnalyticsReady() || !GA4_ID) return;

  window.gtag('event', 'remove_from_cart', {
    currency: product.currency,
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
}

// ─── Custom Events ─────────────────────────────────────────────────────────────

export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (!isAnalyticsReady() || !GA4_ID) return;
  window.gtag('event', eventName, params);
}
