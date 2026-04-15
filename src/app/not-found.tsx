import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-off px-6 text-center">
      <p className="text-sand font-bold text-7xl font-serif mb-4">404</p>
      <h1 className="font-serif text-3xl font-bold text-primary mb-4">Page introuvable</h1>
      <p className="text-warm mb-8 max-w-sm">
        Cette page n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil pour continuer votre aventure.
      </p>
      <Link href="/fr" className="btn-primary py-3 px-8">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
