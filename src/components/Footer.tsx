'use client';

import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/types';

interface FooterProps {
  locale: Locale;
}

const columns = {
  company: ['Company profile', 'Responsibility', 'Our location'],
  services: ['FAQs / Products', 'Warranty / Registration', 'Catalogue', 'Quality policy'],
  support: ['Orders and availability', 'Delivery', 'Payment', 'Customer service'],
};

export default function Footer({ locale }: FooterProps) {
  return (
    <footer className="autohome-footer">
      <div className="autohome-footer__grid">
        <div>
          <h3>COMPANY</h3>
          {columns.company.map((item) => (
            <p key={item}>{locale === 'fr' ? translate(item) : item}</p>
          ))}
        </div>
        <div>
          <h3>SERVICES</h3>
          {columns.services.map((item) => (
            <p key={item}>{locale === 'fr' ? translate(item) : item}</p>
          ))}
        </div>
        <div>
          <h3>CUSTOMER SERVICE</h3>
          {columns.support.map((item) => (
            <p key={item}>{locale === 'fr' ? translate(item) : item}</p>
          ))}
        </div>
        <div className="autohome-footer__stamp">
          <div>OFFICIAL BEST SELLER</div>
          <div>16 SET. 1958</div>
        </div>
      </div>

      <div className="autohome-footer__actions">
        <div>
          <h3>NEWSLETTER</h3>
          <p>{locale === 'fr' ? 'Recevez nos expeditions, lancements et offres.' : 'Receive launches, expeditions and offers.'}</p>
          <button>JOIN</button>
        </div>
        <div>
          <h3>FIND STORES</h3>
          <p>{locale === 'fr' ? 'Trouver le point de vente Wildora le plus proche.' : 'Find the closest Wildora point of sale.'}</p>
          <button>STORE LOCATOR</button>
        </div>
        <div>
          <h3>{locale === 'fr' ? 'CENTRE D APPEL WILDORA' : 'WILDORA CALL CENTER'}</h3>
          <Link href={`/${locale}/contact`} className="autohome-footer__contact">
            info@wildora.com
          </Link>
          <div className="autohome-footer__phone">0033 6 00 00 00 00</div>
        </div>
      </div>
    </footer>
  );
}

function translate(value: string) {
  const map: Record<string, string> = {
    'Company profile': 'Profil de la marque',
    Responsibility: 'Responsabilite',
    'Our location': 'Notre adresse',
    'FAQs / Products': 'FAQs / Produits',
    'Warranty / Registration': 'Garantie / Enregistrement',
    Catalogue: 'Catalogue',
    'Quality policy': 'Politique qualite',
    'Orders and availability': 'Commandes et disponibilite',
    Delivery: 'Livraison',
    Payment: 'Paiement',
    'Customer service': 'Service client',
  };

  return map[value] || value;
}
