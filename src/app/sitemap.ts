import type { MetadataRoute } from 'next';
import { getProducts, MOCK_PRODUCTS } from '@/lib/shopify';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wildora.com';
const LOCALES = ['fr', 'en'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts(50).catch(() => MOCK_PRODUCTS);

  const staticPages = ['', '/produits', '/a-propos', '/blog', '/contact'];

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPages.map((path) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'daily' : 'weekly',
      priority: path === '' ? 1 : 0.8,
    }))
  );

  const productEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    products.map((product) => ({
      url: `${BASE_URL}/${locale}/produits/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))
  );

  return [...staticEntries, ...productEntries];
}
