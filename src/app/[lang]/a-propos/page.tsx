import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isValidLocale, getTranslations } from '@/lib/i18n';
import type { Locale } from '@/types';

interface AboutPageProps {
  params: { lang: string };
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  if (!isValidLocale(params.lang)) return {};
  const { t } = getTranslations(params.lang as Locale);
  return {
    title: t('meta.aboutTitle'),
    description: t('meta.aboutDescription'),
    alternates: {
      canonical: `/${params.lang}/a-propos`,
      languages: { fr: '/fr/a-propos', en: '/en/a-propos' },
    },
  };
}

export default function AboutPage({ params }: AboutPageProps) {
  if (!isValidLocale(params.lang)) notFound();

  const locale = params.lang as Locale;
  const { t, tArray } = getTranslations(locale);

  const values = tArray<{ title: string; description: string }>('about.values.items');

  return (
    <article>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=2000&q=80"
            alt={t('about.hero.headline')}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        </div>

        <div className="container-wide relative z-10 pb-section pt-[calc(var(--header-height)+4rem)]">
          <p className="section-label text-sand mb-6 animate-fade-up">
            {t('about.hero.label')}
          </p>
          <h1 className="font-serif text-display-xl text-white mb-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
            {t('about.hero.headline')}<br />
            <span className="text-sand italic">{t('about.hero.headlineAccent')}</span>
          </h1>
          <p className="text-white/75 text-xl max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: '350ms' }}>
            {t('about.hero.subheadline')}
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="section-padding bg-off">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="section-label">{t('about.story.label')}</p>
              <h2 className="font-serif text-display-md text-primary">
                {t('about.story.headline')}
              </h2>
              <p className="text-warm text-lg leading-relaxed">
                {t('about.story.paragraph1')}
              </p>
              <p className="text-warm leading-relaxed">
                {t('about.story.paragraph2')}
              </p>
              <p className="text-warm leading-relaxed font-medium">
                {t('about.story.paragraph3')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  src: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
                  alt: 'Van Wildora en pleine nature',
                  className: 'col-span-2 aspect-[16/9]',
                },
                {
                  src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
                  alt: 'Tente de toit Wildora',
                  className: 'aspect-square',
                },
                {
                  src: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=600&q=80',
                  alt: 'Aventurier Wildora',
                  className: 'aspect-square',
                },
              ].map((img) => (
                <div
                  key={img.src}
                  className={`relative rounded-2xl overflow-hidden image-zoom ${img.className}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-primary">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="section-label text-sand justify-center mb-4">
              {t('about.values.label')}
            </p>
            <h2 className="font-serif text-display-lg text-white">
              {t('about.values.headline')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="p-8 rounded-2xl border border-white/8 hover:border-sand/30 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-sand/15 flex items-center justify-center text-sand mb-5 group-hover:bg-sand group-hover:text-white transition-all duration-300">
                  <span className="font-serif font-bold text-xl leading-none">{i + 1}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-white/60 leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Parallax Image */}
      <section className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=2000&q=80"
          alt="Paysage montagneux — Wildora"
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <blockquote className="text-center px-6">
            <p className="font-serif text-2xl md:text-4xl text-white italic max-w-2xl leading-relaxed">
              {locale === 'fr'
                ? '"La liberté, c\'est de choisir où planter sa tente."'
                : '"Freedom is choosing where to pitch your tent."'}
            </p>
            <cite className="block text-white/60 text-sm mt-4 not-italic">— Wildora</cite>
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-cream">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-display-md text-primary mb-4">
            {t('about.cta.headline')}
          </h2>
          <p className="text-warm text-lg mb-8">
            {t('about.cta.text')}
          </p>
          <Link href={`/${locale}/produits`} className="btn-primary text-base py-4 px-10">
            {t('about.cta.button')}
            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>
    </article>
  );
}
