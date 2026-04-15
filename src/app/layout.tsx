import type { Metadata } from 'next';
import { Manrope, Oswald } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Oswald({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://wildora.com'),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f7f3ec" />
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
      </head>
      <body>
        {children}

        {/* Google Analytics 4 */}
        {GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: true
                });
                ${GADS_ID ? `gtag('config', '${GADS_ID}');` : ''}
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
