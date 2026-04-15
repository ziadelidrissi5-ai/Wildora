'use client';

import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/types';

interface FooterProps {
  locale: Locale;
}

const columns = {
  company: [
    { label: 'Company profile', labelFr: 'Profil de la marque', href: '/a-propos' },
    { label: 'Responsibility', labelFr: 'Responsabilite', href: '/a-propos' },
    { label: 'Our location', labelFr: 'Notre adresse', href: '/contact' },
  ],
  services: [
    { label: 'FAQs / Products', labelFr: 'FAQs / Produits', href: '/produits' },
    { label: 'Warranty / Registration', labelFr: 'Garantie / Enregistrement', href: '/contact' },
    { label: 'Catalogue', labelFr: 'Catalogue', href: '/produits' },
    { label: 'Quality policy', labelFr: 'Politique qualite', href: '/a-propos' },
  ],
  support: [
    { label: 'Orders and availability', labelFr: 'Commandes et disponibilite', href: '/contact' },
    { label: 'Delivery', labelFr: 'Livraison', href: '/contact' },
    { label: 'Payment', labelFr: 'Paiement', href: '/contact' },
    { label: 'Customer service', labelFr: 'Service client', href: '/contact' },
  ],
};

export default function Footer({ locale }: FooterProps) {
  const isFr = locale === 'fr';

  return (
    <footer className="autohome-footer">
      <div className="autohome-footer__grid">
        <div>
          <h3>COMPANY</h3>
          {columns.company.map((item) => (
            <Link key={item.label} href={`/${locale}${item.href}`} className="autohome-footer__link">
              {isFr ? item.labelFr : item.label}
            </Link>
          ))}
        </div>
        <div>
          <h3>SERVICES</h3>
          {columns.services.map((item) => (
            <Link key={item.label} href={`/${locale}${item.href}`} className="autohome-footer__link">
              {isFr ? item.labelFr : item.label}
            </Link>
          ))}
        </div>
        <div>
          <h3>CUSTOMER SERVICE</h3>
          {columns.support.map((item) => (
            <Link key={item.label} href={`/${locale}${item.href}`} className="autohome-footer__link">
              {isFr ? item.labelFr : item.label}
            </Link>
          ))}
        </div>
        <div className="autohome-footer__stamp">
          <div>OFFICIAL BEST SELLER</div>
          <div>16 SET. 1998</div>
        </div>
      </div>

      <div className="autohome-footer__actions">
        <div>
          <h3>NEWSLETTER</h3>
          <p>{isFr ? 'Recevez nos expeditions, lancements et offres.' : 'Receive launches, expeditions and offers.'}</p>
          <Link href={`/${locale}/contact`} className="autohome-footer__btn">JOIN</Link>
        </div>
        <div>
          <h3>FIND STORES</h3>
          <p>{isFr ? 'Trouver le point de vente Wildora le plus proche.' : 'Find the closest Wildora point of sale.'}</p>
          <Link href={`/${locale}/contact`} className="autohome-footer__btn">STORE LOCATOR</Link>
        </div>
        <div>
          <h3>{isFr ? 'CENTRE D APPEL WILDORA' : 'WILDORA CALL CENTER'}</h3>
          <Link href={`/${locale}/contact`} className="autohome-footer__contact">
            info@wildora.com
          </Link>
          <Link href="tel:0033600000000" className="autohome-footer__phone">
            0033 6 00 00 00 00
          </Link>
        </div>
      </div>
    </footer>
  );
}
