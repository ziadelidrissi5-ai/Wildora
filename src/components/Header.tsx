'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/types';
import { getAlternateLocale, getLocalizedPath } from '@/lib/i18n';
import { useCart } from '@/context/CartContext';
import Logo from './Logo';

interface HeaderProps {
  locale: Locale;
  heroMode?: boolean;
}

export default function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const { openCart, cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const altLocale = getAlternateLocale(locale);
  const cartCount = cart?.totalQuantity || 0;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = [
    { label: 'SHOP', href: `/${locale}/produits` },
    { label: 'SINCE 1998', href: `/${locale}/a-propos` },
    { label: 'EXPERIENCE', href: `/${locale}/blog` },
    { label: 'CATALOGUE', href: `/${locale}/produits` },
  ];

  return (
    <>
      <header className="wildora-header">
        <div className="wildora-header__inner">
          <nav className="wildora-header__nav" aria-label="Main navigation">
            {navLinks.slice(0, 2).map((link) => (
              <Link key={link.label} href={link.href} className="wildora-header__link">
                {link.label}
              </Link>
            ))}
          </nav>

          <Logo locale={locale} variant="light" size="md" />

          <div className="wildora-header__actions">
            {navLinks.slice(2).map((link) => (
              <Link key={link.label} href={link.href} className="wildora-header__link wildora-header__link--right">
                {link.label}
              </Link>
            ))}
            <Link href={getLocalizedPath(pathname, altLocale)} className="wildora-header__lang">
              {altLocale.toUpperCase()}
            </Link>
            <button onClick={openCart} className="wildora-header__icon" aria-label="Cart">
              <CartIcon />
              {cartCount > 0 ? <span className="wildora-header__count">{cartCount}</span> : null}
            </button>
            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="wildora-header__icon wildora-header__menu"
              aria-label="Menu"
            >
              <BurgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="wildora-mobile-menu">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="wildora-mobile-menu__link" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href={`/${locale}/contact`} className="wildora-mobile-menu__link" onClick={() => setMenuOpen(false)}>
            CONTACT
          </Link>
        </div>
      ) : null}
    </>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39A2 2 0 009.64 16H19a2 2 0 001.95-1.57L23 6H6" />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </>
      )}
    </svg>
  );
}
