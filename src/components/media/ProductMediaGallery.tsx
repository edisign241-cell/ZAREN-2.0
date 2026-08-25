'use client';

import React, { useState } from 'react';
import { MediaItem } from '@/types';

interface ProductMediaGalleryProps {
  images?: string[];
  videos?: string[];
  media?: MediaItem[];
  title?: string;
}

export default function ProductMediaGallery({
  images = [],
  videos = [],
  media = [],
  title = 'Article'
}: ProductMediaGalleryProps) {
  // Combiner les sources d'images et vidéos
  const items: { type: 'IMAGE' | 'VIDEO'; url: string; id: string }[] = [];

  if (media && media.length > 0) {
    media.forEach((m) => {
      items.push({ type: m.type, url: m.url, id: m.id });
    });
  } else {
    images.forEach((img, idx) => {
      items.push({ type: 'IMAGE', url: img, id: `img_${idx}` });
    });
    videos.forEach((vid, idx) => {
      items.push({ type: 'VIDEO', url: vid, id: `vid_${idx}` });
    });
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] || items[0];

  if (!activeItem) {
    return (
      <div className="aspect-[3/4] bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400">
        Pas de média disponible
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Grand Visuel Principal (Image ou Lecteur Vidéo) */}
      <div className="relative aspect-[3/4] max-h-[600px] w-full bg-neutral-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
        {activeItem.type === 'VIDEO' ? (
          <video
            src={activeItem.url}
            controls
            playsInline
            autoPlay
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <img
            src={activeItem.url}
            alt={title}
            className="w-full h-full object-cover object-center"
          />
        )}

        {/* Badge Type de Média */}
        <div className="absolute top-3 left-3 bg-[#065f46]/90 text-white text-[10px] font-black italic uppercase px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1.5">
          <span>{activeItem.type === 'VIDEO' ? '🎥 Vidéo Démo' : '📷 Photo HD'}</span>
        </div>
      </div>

      {/* Miniatures Défilantes */}
      {items.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative ${
                activeIndex === idx
                  ? 'border-[#065f46] ring-2 ring-[#065f46]'
                  : 'border-neutral-200 opacity-75 hover:opacity-100'
              }`}
            >
              {item.type === 'VIDEO' ? (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center relative">
                  <span className="text-white text-xs">▶</span>
                  <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-black/80 text-white px-1 rounded">
                    Vidéo
                  </span>
                </div>
              ) : (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
