import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isValidLocale, getTranslations } from '@/lib/i18n';
import { getProductByHandle, getProducts, MOCK_PRODUCTS } from '@/lib/shopify';
import type { Locale } from '@/types';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import SocialProof from '@/components/SocialProof';
import TrustBadges from '@/components/TrustBadges';
import FAQ from '@/components/FAQ';

interface ProductPageProps {
  params: { lang: string; handle: string };
}

export async function generateStaticParams() {
  const products = await getProducts(20).catch(() => MOCK_PRODUCTS);
  const langs = ['fr', 'en'];
  return langs.flatMap((lang) =>
    products.map((product) => ({ lang, handle: product.handle }))
  );
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  if (!isValidLocale(params.lang)) return {};
  const locale = params.lang as Locale;
  const { t } = getTranslations(locale);
  const product = await getProductByHandle(params.handle);
  if (!product) return {};

  const title = product.seo.title || t('meta.productTitle', { name: product.title });
  const description = product.seo.description || product.description;
  const image = product.featuredImage;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/produits/${params.handle}`,
      languages: {
        fr: `/fr/produits/${params.handle}`,
        en: `/en/produits/${params.handle}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      images: image
        ? [{ url: image.url, width: image.width, height: image.height, alt: image.altText || title }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  if (!isValidLocale(params.lang)) notFound();

  const locale = params.lang as Locale;
  const { t } = getTranslations(locale);
  const product = await getProductByHandle(params.handle);

  if (!product) notFound();

  const price = product.variants.nodes[0]?.price;

  // Product structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.nodes.map((img) => img.url),
    brand: { '@type': 'Brand', name: 'Wildora' },
    offers: {
      '@type': 'Offer',
      price: price?.amount,
      priceCurrency: price?.currencyCode || 'EUR',
      availability: product.variants.nodes[0]?.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Wildora' },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2147',
      bestRating: '5',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb */}
      <div className="pt-[calc(var(--header-height)+1.5rem)] pb-4 bg-off">
        <div className="container-wide">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-sm text-warm-light">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              {locale === 'fr' ? 'Accueil' : 'Home'}
            </Link>
            <span className="text-warm-pale">›</span>
            <Link href={`/${locale}/produits`} className="hover:text-primary transition-colors">
              {t('nav.collection')}
            </Link>
            <span className="text-warm-pale">›</span>
            <span className="text-primary font-medium truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Main */}
      <section className="bg-off pb-section">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Gallery */}
            <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
              <ProductGallery images={product.images.nodes} title={product.title} />
            </div>

            {/* Info */}
            <ProductInfo product={product} locale={locale} />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges locale={locale} />

      {/* FAQ */}
      <section className="section-padding bg-cream">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="font-serif text-display-md text-primary">{t('faq.title')}</h2>
          </div>
          <FAQ locale={locale} />
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof locale={locale} />
    </>
  );
}
