import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/i18n';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import type { Locale } from '@/types';

interface LangLayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

export async function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }];
}

export default function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = params;

  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;

  return (
    <CartProvider>
      <Header locale={locale} heroMode />
      <main>{children}</main>
      <Footer locale={locale} />
      <Cart locale={locale} />
    </CartProvider>
  );
}
