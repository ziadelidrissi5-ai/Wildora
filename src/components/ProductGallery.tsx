'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { ShopifyImage } from '@/types';

interface ProductGalleryProps {
  images: ShopifyImage[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const safeImages = images.length > 0 ? images : [
    {
      url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80',
      altText: title,
      width: 1200,
      height: 800,
    },
  ];

  const prev = () => setActive((a) => (a > 0 ? a - 1 : safeImages.length - 1));
  const next = () => setActive((a) => (a < safeImages.length - 1 ? a + 1 : 0));

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div
        className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream group cursor-zoom-in"
        onClick={() => setZoom(true)}
      >
        <Image
          key={safeImages[active].url}
          src={safeImages[active].url}
          alt={safeImages[active].altText || title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
          priority={active === 0}
        />

        {/* Navigation Arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white"
            >
              <ChevronIcon className="w-4 h-4 rotate-180" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white"
            >
              <ChevronIcon className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image count */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-3 right-3 glass rounded-full px-3 py-1 text-white text-xs font-medium">
            {active + 1}/{safeImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Voir image ${i + 1}`}
              className={`gallery-thumb relative aspect-square rounded-lg overflow-hidden ${
                i === active ? 'active ring-2 ring-sand' : ''
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${title} — ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {zoom && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setZoom(false)}
        >
          <button
            onClick={() => setZoom(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white z-10"
          >
            <XIcon className="w-5 h-5" />
          </button>
          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white"
              >
                <ChevronIcon className="w-5 h-5 rotate-180" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white"
              >
                <ChevronIcon className="w-5 h-5" />
              </button>
            </>
          )}
          <div
            className="relative w-full max-w-3xl max-h-[90vh] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={safeImages[active].url}
              alt={safeImages[active].altText || title}
              width={1200}
              height={900}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
}
function XIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;
}
