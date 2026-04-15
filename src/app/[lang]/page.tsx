import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, getTranslations } from '@/lib/i18n';
import type { Locale } from '@/types';

import HomeShowcase from '@/components/HomeShowcase';

interface HomeProps {
  params: { lang: string };
}

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  if (!isValidLocale(params.lang)) return {};
  const { t } = getTranslations(params.lang as Locale);

  return {
    title: t('meta.homeTitle'),
    description: t('meta.homeDescription'),
    keywords: [
      'tente de toit',
      'rooftop tent',
      'vanlife',
      'camping',
      'car camping',
      'tente voiture',
      'équipement outdoor',
      'wildora',
    ],
    alternates: {
      canonical: `/${params.lang}`,
      languages: {
        fr: '/fr',
        en: '/en',
      },
    },
    openGraph: {
      title: t('meta.homeTitle'),
      description: t('meta.homeDescription'),
      type: 'website',
      locale: params.lang === 'fr' ? 'fr_FR' : 'en_US',
      siteName: 'Wildora',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: t('meta.homeTitle'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.homeTitle'),
      description: t('meta.homeDescription'),
    },
  };
}

export default async function HomePage({ params }: HomeProps) {
  if (!isValidLocale(params.lang)) notFound();

  const locale = params.lang as Locale;
  const { t } = getTranslations(locale);

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wildora',
    url: 'https://wildora.com',
    logo: 'https://wildora.com/logo.svg',
    description: t('meta.homeDescription'),
    sameAs: ['https://instagram.com/wildora', 'https://tiktok.com/@wildora'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeShowcase locale={locale} />
    </>
  );
}
