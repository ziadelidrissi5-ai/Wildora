import type { ShopifyProduct, ShopifyCart } from '@/types';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const apiVersion = '2024-04';

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

// ─── Fragments ────────────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    tags
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        quantityAvailable
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
      }
    }
    seo { title description }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            product {
              id
              title
              handle
              featuredImage { url altText width height }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
          amountPerQuantity { amount currencyCode }
        }
      }
    }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
  }
`;

// ─── Product Queries ───────────────────────────────────────────────────────────

export async function getProducts(first = 12): Promise<ShopifyProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        nodes { ...ProductFields }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(query, { first });
    return data.products.nodes;
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) { ...ProductFields }
    }
  `;

  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, { handle });
    return data.product;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.handle === handle) || MOCK_PRODUCTS[0];
  }
}

export async function getFeaturedProduct(): Promise<ShopifyProduct | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetFeaturedProduct {
      products(first: 1, sortKey: BEST_SELLING) {
        nodes { ...ProductFields }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(query);
    return data.products.nodes[0] || null;
  } catch {
    return MOCK_PRODUCTS[0];
  }
}

// ─── Cart Mutations ────────────────────────────────────────────────────────────

export async function createCart(): Promise<ShopifyCart> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartCreate {
      cartCreate {
        cart { ...CartFields }
      }
    }
  `;

  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>(mutation);
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<ShopifyCart> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>(mutation, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });

  if (data.cartLinesAdd.userErrors?.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return data.cartLinesAdd.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>(mutation, {
    cartId,
    lineIds,
  });

  return data.cartLinesRemove.cart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>(mutation, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  return data.cartLinesUpdate.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
  `;

  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(query, { cartId });
  return data.cart;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatMoney(amount: string, currencyCode: string): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function getDiscountPercentage(price: string, compareAtPrice: string): number {
  const p = parseFloat(price);
  const c = parseFloat(compareAtPrice);
  if (!c || c <= p) return 0;
  return Math.round(((c - p) / c) * 100);
}

// ─── Mock Data (shown when Shopify is not configured) ─────────────────────────

export const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'gid://shopify/Product/1',
    handle: 'wildora-explorer-pro',
    title: 'Wildora Explorer Pro',
    description:
      'La tente de toit premium pour les aventuriers exigeants. Conçue pour 4 saisons, installation en 60 secondes.',
    descriptionHtml:
      '<p>La tente de toit premium pour les aventuriers exigeants. Conçue pour 4 saisons, installation en 60 secondes.</p>',
    tags: ['bestseller', 'featured', 'rooftop-tent'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80',
      altText: 'Wildora Explorer Pro — Tente de toit premium',
      width: 1200,
      height: 800,
    },
    images: {
      nodes: [
        {
          url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80',
          altText: 'Wildora Explorer Pro',
          width: 1200,
          height: 800,
        },
        {
          url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
          altText: 'Wildora Explorer Pro — Vue intérieure',
          width: 1200,
          height: 800,
        },
        {
          url: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=1200&q=80',
          altText: 'Wildora Explorer Pro — En situation',
          width: 1200,
          height: 800,
        },
        {
          url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80',
          altText: 'Wildora Explorer Pro — Nuit étoilée',
          width: 1200,
          height: 800,
        },
      ],
    },
    priceRange: {
      minVariantPrice: { amount: '1290.00', currencyCode: 'EUR' },
      maxVariantPrice: { amount: '1590.00', currencyCode: 'EUR' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '1590.00', currencyCode: 'EUR' },
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/1',
          title: 'Gris Ardoise — 140×240',
          availableForSale: true,
          quantityAvailable: 5,
          price: { amount: '1290.00', currencyCode: 'EUR' },
          compareAtPrice: { amount: '1590.00', currencyCode: 'EUR' },
          selectedOptions: [
            { name: 'Couleur', value: 'Gris Ardoise' },
            { name: 'Taille', value: '140×240' },
          ],
        },
        {
          id: 'gid://shopify/ProductVariant/2',
          title: 'Sable Doré — 140×240',
          availableForSale: true,
          quantityAvailable: 3,
          price: { amount: '1290.00', currencyCode: 'EUR' },
          compareAtPrice: { amount: '1590.00', currencyCode: 'EUR' },
          selectedOptions: [
            { name: 'Couleur', value: 'Sable Doré' },
            { name: 'Taille', value: '140×240' },
          ],
        },
        {
          id: 'gid://shopify/ProductVariant/3',
          title: 'Noir Obsidienne — 160×240',
          availableForSale: true,
          quantityAvailable: 8,
          price: { amount: '1590.00', currencyCode: 'EUR' },
          compareAtPrice: { amount: '1890.00', currencyCode: 'EUR' },
          selectedOptions: [
            { name: 'Couleur', value: 'Noir Obsidienne' },
            { name: 'Taille', value: '160×240' },
          ],
        },
      ],
    },
    seo: {
      title: 'Wildora Explorer Pro — Tente de toit premium 4 saisons',
      description: 'Tente de toit Wildora Explorer Pro. Installation 60 secondes, confort 4 saisons, toile 600D imperméable. Garantie 3 ans.',
    },
  },
  {
    id: 'gid://shopify/Product/2',
    handle: 'wildora-summit-lite',
    title: 'Wildora Summit Lite',
    description: 'La tente de toit ultra-légère pour les aventuriers minimalistes.',
    descriptionHtml: '<p>La tente de toit ultra-légère pour les aventuriers minimalistes.</p>',
    tags: ['rooftop-tent', 'lightweight'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
      altText: 'Wildora Summit Lite',
      width: 1200,
      height: 800,
    },
    images: {
      nodes: [
        {
          url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
          altText: 'Wildora Summit Lite',
          width: 1200,
          height: 800,
        },
      ],
    },
    priceRange: {
      minVariantPrice: { amount: '890.00', currencyCode: 'EUR' },
      maxVariantPrice: { amount: '890.00', currencyCode: 'EUR' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '1090.00', currencyCode: 'EUR' },
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/4',
          title: 'Forêt — 120×200',
          availableForSale: true,
          quantityAvailable: 12,
          price: { amount: '890.00', currencyCode: 'EUR' },
          compareAtPrice: { amount: '1090.00', currencyCode: 'EUR' },
          selectedOptions: [{ name: 'Couleur', value: 'Forêt' }],
        },
      ],
    },
    seo: {
      title: 'Wildora Summit Lite — Tente de toit ultra-légère',
      description: 'Tente de toit légère pour solo ou duo. Idéale pour les longs road trips.',
    },
  },
];
