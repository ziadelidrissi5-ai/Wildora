'use client';

import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/types';

interface HomeShowcaseProps {
  locale: Locale;
}

const PRODUCT_CARDS = [
  {
    label: 'Best seller',
    title: 'Maggiolina',
    price: 'From 3.529 €',
    image: 'https://www.autohome-official.com/wp-content/uploads/2025/11/AUTOHOME_Tende-da-tetto_HOME-PAGE_AIR-SKY_COLORE_800x800pxls.png',
    handle: 'maggiolina',
  },
  {
    label: 'Premium',
    title: 'Airtop',
    price: 'From 2.839 €',
    image: 'https://www.autohome-official.com/wp-content/uploads/2025/11/AUTOHOME_Tende-da-tetto_HOME-PAGE_AIRTOP_COLORE_800x800pxls.png',
    handle: 'airtop',
  },
  {
    label: 'Instant opening',
    title: 'Columbus',
    price: 'From 3.619 €',
    image: 'https://www.autohome-official.com/wp-content/uploads/2025/11/AUTOHOME_Tende-da-tetto_HOME-PAGE_COLUMBUS_COLORE_800x800pxls.png',
    handle: 'columbus',
  },
  {
    label: 'Best value',
    title: 'Overland',
    price: 'From 1.909 €',
    image: 'https://www.autohome-official.com/wp-content/uploads/2025/11/AUTOHOME_Tende-da-tetto_HOME-PAGE_OVERLAND_COLORE_800x800pxls.png',
    handle: 'overland',
  },
];

export default function HomeShowcase({ locale }: HomeShowcaseProps) {
  const isFr = locale === 'fr';

  const copy = {
    heroEyebrow: isFr ? 'Tentes de toit originales depuis 1958' : 'Original rooftop tents since 1958',
    heroTitle: isFr ? 'L\'AVENTURE\nCOMMENCE ICI' : 'ADVENTURE\nSTARTS HERE',
    heroCta: isFr ? 'Voir la collection' : 'View collection',
    heroAltCta: isFr ? 'En savoir plus' : 'Learn more',
    collectionTitle: isFr ? 'NOS TENTES DE TOIT' : 'OUR ROOFTOP TENTS',
    collectionSub: isFr ? 'Ingénierie italienne, confort absolu.' : 'Italian engineering, absolute comfort.',
    collectionCta: isFr ? 'Voir toute la collection' : 'Browse all tents',
    featureTitle: isFr ? 'CONÇU POUR L\'EXTRÊME' : 'BUILT FOR THE EXTREME',
    featureText: isFr
      ? 'Chaque tente Wildora est fabriquée en Italie avec des matériaux premium. Coque rigide, isolation thermique, et montage en moins de 60 secondes.'
      : 'Every Wildora tent is manufactured in Italy with premium materials. Hard shell, thermal insulation, and setup in under 60 seconds.',
    featureCta: isFr ? 'Découvrir la technologie' : 'Discover the technology',
    strip: isFr ? 'COQUE RIGIDE · TOILE PREMIUM · AUCUN COMPROMIS · SINCE 1958' : 'HARD SHELL · PREMIUM FABRIC · NO COMPROMISE · SINCE 1958',
    storyTitle: isFr ? 'UNE HISTOIRE DEPUIS 1958' : 'A STORY SINCE 1958',
    storyText: isFr
      ? 'Wildora est né d\'une passion pour l\'exploration. Plus de 65 ans à perfectionner l\'art de dormir sous les étoiles.'
      : 'Wildora was born from a passion for exploration. Over 65 years perfecting the art of sleeping under the stars.',
    storyCta: isFr ? 'Notre histoire' : 'Our story',
    discover: isFr ? 'Découvrir' : 'Discover',
  };

  return (
    <div className="wld-page">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="wld-hero">
        <img
          src="https://www.autohome-official.com/wp-content/uploads/2025/11/AUTOHOME_Tende-da-tetto_FASCIA-HOME-PAGE_2_1920x722pxls_DESKTOP.png"
          alt={isFr ? '4x4 équipé d\'une tente de toit' : '4x4 equipped with rooftop tent'}
          className="wld-hero__bg"
        />
        <div className="wld-hero__overlay" />
        <div className="wld-hero__content">
          <p className="wld-eyebrow">{copy.heroEyebrow}</p>
          <h1 className="wld-hero__title">{copy.heroTitle}</h1>
          <div className="wld-hero__actions">
            <Link href={`/${locale}/produits`} className="wld-btn wld-btn--solid">
              {copy.heroCta}
            </Link>
            <Link href={`/${locale}/a-propos`} className="wld-btn wld-btn--outline">
              {copy.heroAltCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ticker strip ────────────────────────────────────── */}
      <div className="wld-strip">{copy.strip}</div>

      {/* ── Collection produits ─────────────────────────────── */}
      <section className="wld-collection">
        <div className="wld-collection__header">
          <div>
            <p className="wld-label">{copy.collectionTitle}</p>
            <p className="wld-collection__sub">{copy.collectionSub}</p>
          </div>
          <Link href={`/${locale}/produits`} className="wld-btn wld-btn--dark wld-btn--sm">
            {copy.collectionCta} →
          </Link>
        </div>

        <div className="wld-products">
          {PRODUCT_CARDS.map((card) => (
            <Link key={card.handle} href={`/${locale}/produits/${card.handle}`} className="wld-product-card">
              <div className="wld-product-card__img">
                <img src={card.image} alt={card.title} />
              </div>
              <div className="wld-product-card__body">
                <span className="wld-product-card__label">{card.label}</span>
                <h3 className="wld-product-card__name">{card.title}</h3>
                <span className="wld-product-card__price">{card.price}</span>
                <span className="wld-product-card__cta">{copy.discover} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Feature split ───────────────────────────────────── */}
      <section className="wld-feature">
        <div className="wld-feature__img">
          <img
            src="https://www.autohome-official.com/wp-content/uploads/2025/11/AUTOHOME_Tendina_Experience_Img_1.jpg"
            alt={isFr ? 'Expedition 4x4' : '4x4 expedition'}
          />
        </div>
        <div className="wld-feature__content">
          <p className="wld-label">{copy.featureTitle}</p>
          <p className="wld-feature__text">{copy.featureText}</p>
          <div className="wld-feature__badges">
            <span className="wld-badge">Swiss Engineering</span>
            <span className="wld-badge">Hard Shell</span>
            <span className="wld-badge">60s Setup</span>
            <span className="wld-badge">All Season</span>
          </div>
          <Link href={`/${locale}/produits`} className="wld-btn wld-btn--dark">
            {copy.featureCta}
          </Link>
        </div>
      </section>

      {/* ── Brand story ─────────────────────────────────────── */}
      <section className="wld-story">
        <div className="wld-story__inner">
          <p className="wld-label wld-label--light">{copy.storyTitle}</p>
          <p className="wld-story__text">{copy.storyText}</p>
          <Link href={`/${locale}/a-propos`} className="wld-btn wld-btn--outline wld-btn--sm">
            {copy.storyCta}
          </Link>
        </div>
      </section>

    </div>
  );
}
