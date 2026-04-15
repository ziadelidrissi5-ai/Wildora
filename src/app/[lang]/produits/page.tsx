import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isValidLocale, getTranslations } from '@/lib/i18n';
import { getProducts, formatMoney, MOCK_PRODUCTS } from '@/lib/shopify';
import type { Locale } from '@/types';

interface CollectionPageProps {
  params: { lang: string };
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  if (!isValidLocale(params.lang)) return {};
  const locale = params.lang as Locale;
  const title =
    locale === 'fr'
      ? 'Collection Wildora — Tentes de Toit & Équipement Vanlife Premium'
      : 'Wildora Collection — Premium Rooftop Tents & Vanlife Gear';
  const description =
    locale === 'fr'
      ? 'Explorez toute la collection Wildora : tentes de toit, accessoires vanlife et équipements outdoor premium. Livraison gratuite, garantie 3 ans.'
      : 'Explore the full Wildora collection: rooftop tents, vanlife accessories and premium outdoor gear. Free shipping, 3-year warranty.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/produits`,
      languages: { fr: '/fr/produits', en: '/en/produits' },
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  if (!isValidLocale(params.lang)) notFound();

  const locale = params.lang as Locale;
  const { t } = getTranslations(locale);
  const products = await getProducts(24).catch(() => MOCK_PRODUCTS);

  const heading =
    locale === 'fr' ? 'Notre Collection' : 'Our Collection';
  const subheading =
    locale === 'fr'
      ? 'Des équipements conçus pour ceux qui refusent les limites.'
      : 'Gear designed for those who refuse limits.';

  return (
    <>
      {/* Header */}
      <div className="pt-[calc(var(--header-height)+3rem)] pb-12 bg-off">
        <div className="container-wide">
          <p className="section-label mb-4 animate-fade-up">
            {locale === 'fr' ? 'Tous nos produits' : 'All products'}
          </p>
          <h1 className="font-serif text-display-lg text-primary animate-fade-up" style={{ animationDelay: '150ms' }}>
            {heading}
          </h1>
          <p className="text-warm text-lg mt-3 animate-fade-up" style={{ animationDelay: '250ms' }}>
            {subheading}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <section className="pb-section bg-off">
        <div className="container-wide">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-warm-light text-lg">{t('common.loading')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const price = product.priceRange.minVariantPrice;
                const compareAt = product.compareAtPriceRange?.minVariantPrice;
                const img = product.featuredImage;
                const isBestseller = product.tags.includes('bestseller');

                return (
                  <Link
                    key={product.handle}
                    href={`/${locale}/produits/${product.handle}`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
                    aria-label={product.title}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden image-zoom bg-cream">
                      {img && (
                        <Image
                          src={img.url}
                          alt={img.altText || product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                          loading="lazy"
                        />
                      )}
                      {isBestseller && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-sand text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                          Bestseller
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h2 className="font-serif text-lg font-bold text-primary mb-1 group-hover:text-sand transition-colors duration-200">
                        {product.title}
                      </h2>
                      <p className="text-sm text-warm-light line-clamp-2 mb-3">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-primary">
                            {t('featured.from')} {formatMoney(price.amount, price.currencyCode)}
                          </span>
                          {compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount) && (
                            <span className="text-sm text-warm-light line-through">
                              {formatMoney(compareAt.amount, compareAt.currencyCode)}
                            </span>
                          )}
                        </div>
                        <div className="stars text-sm">★★★★★</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
