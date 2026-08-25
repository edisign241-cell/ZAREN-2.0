'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-slate-100 flex flex-col items-center justify-center text-slate-400">
        <ImageIcon className="w-12 h-12 stroke-[1.5]" />
        <span className="text-xs mt-2 font-medium">Aucune image</span>
      </div>
    );
  }

  const prev = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const next = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full aspect-square bg-slate-900 overflow-hidden group">
      <img
        src={images[currentIndex]}
        alt={`${title} - image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-300"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
                aria-label={`Aller à l'image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
