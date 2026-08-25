'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Send } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { zarenStore } from '@/db/store';

interface ShareButtonProps {
  product: Product;
}

export default function ShareButton({ product }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/p/${product.shortCode}`;
    }
    return `https://zaren.app/p/${product.shortCode}`;
  };

  const shareText = `🔥 Regarde "${product.title}" à seulement ${formatPrice(product.price)} sur Zarén ! Achat 100% garanti par séquestre :\n${getShareUrl()}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareUrl());
    zarenStore.incrementShares(product.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    zarenStore.incrementShares(product.id);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareTelegram = () => {
    zarenStore.incrementShares(product.id);
    const url = `https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-sm"
        title="Partager ce produit"
        aria-label="Partager"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Partager ce produit</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                Fermer
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Partagez ce lien direct avec vos clients sur les réseaux sociaux. Ils pourront commander en 1 clic avec paiement sécurisé.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <button
                onClick={shareWhatsApp}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold">WhatsApp</span>
              </button>

              <button
                onClick={shareTelegram}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors border border-sky-200"
              >
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold">Telegram</span>
              </button>

              <button
                onClick={copyToClipboard}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-sm">
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </div>
                <span className="text-xs font-semibold">{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="text"
                readOnly
                value={getShareUrl()}
                className="bg-transparent text-xs text-slate-600 flex-1 outline-hidden px-2 truncate"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
