'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Send,
  MessageCircle,
  Tag
} from 'lucide-react';
import { zarenStore } from '@/db/store';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface MakeOfferModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function MakeOfferModal({ product, isOpen, onClose }: MakeOfferModalProps) {
  const router = useRouter();
  const { currentUser, isLoggedIn, openLoginModal } = useAuth();

  const [customPrice, setCustomPrice] = useState<number>(Math.round(product.price * 0.9));
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleQuickDiscount = (percent: number) => {
    const discounted = Math.round(product.price * (1 - percent / 100));
    setCustomPrice(discounted);
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      onClose();
      openLoginModal();
      return;
    }

    if (!customPrice || customPrice <= 0) {
      alert('Veuillez saisir un montant valide pour votre offre.');
      return;
    }

    if (customPrice >= product.price) {
      alert('Votre offre doit être inférieure au prix initial.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      zarenStore.createOffer({
        productId: product.id,
        productTitle: product.title,
        productImage: product.images[0],
        originalPrice: product.price,
        offeredPrice: customPrice,
        currency: product.currency,
        buyerId: currentUser?.id || 'usr_buyer_1',
        buyerName: currentUser?.name || 'Patrick Nguema',
        buyerPhone: currentUser?.phone || '+241 06 23 34 45',
        sellerId: product.sellerId,
        sellerName: product.seller?.businessName || 'Vendeur ZARÉN',
        notes: notes.trim() || undefined
      });

      setIsSubmitting(false);
      onClose();
      router.push('/messages');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Boîte Modale */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 animate-slide-in">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-br from-[#111827] to-[#1F2937] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black italic mb-2">
            <span>🤝 NÉGOCIATION SÉCURISÉE</span>
          </div>

          <h3 className="text-base font-black italic">
            Faire une Offre de Prix
          </h3>
          <p className="text-xs text-gray-300 mt-0.5">
            Proposez votre prix directement au vendeur sous garantie séquestre.
          </p>
        </div>

        {/* Info Produit */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-12 h-12 rounded-xl object-cover border border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-gray-900 truncate">{product.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">Prix affiché :</span>
              <span className="text-xs font-black text-gray-900 font-mono">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmitOffer} className="p-5 space-y-4">
          
          {/* Suggestions rapides de réduction */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-2 block">
              Suggestions de remises rapides :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((pct) => {
                const discounted = Math.round(product.price * (1 - pct / 100));
                const isSelected = customPrice === discounted;

                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleQuickDiscount(pct)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      isSelected
                        ? 'bg-[#008A45] text-white border-[#008A45]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-[10px] font-black">-{pct}%</span>
                    <span className="text-[11px] font-mono">{discounted.toLocaleString()} F</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saisie Montant Proposé */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
              <span>Votre offre (FCFA) *</span>
              {customPrice > 0 && (
                <span className="text-[11px] text-[#008A45] font-black">
                  Économie de {(product.price - customPrice).toLocaleString()} FCFA
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min={1000}
                max={product.price - 500}
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
                className="w-full pl-4 pr-16 py-3 rounded-xl border border-gray-200 focus:border-[#008A45] focus:ring-2 focus:ring-[#008A45]/20 text-base font-black font-mono outline-none transition"
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400">
                FCFA
              </span>
            </div>
          </div>

          {/* Message optionnel */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">
              Message d'accompagnement (optionnel)
            </label>
            <input
              type="text"
              placeholder="Ex : Paiement immédiat Mobile Money aujourd'hui."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs outline-none transition font-medium"
            />
          </div>

          {/* Rappel Garantie */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-[#008A45] shrink-0" />
            <span>Si le vendeur accepte, vos fonds restent 100% protégés sous séquestre jusqu'à livraison.</span>
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition cursor-pointer"
            >
              {isSubmitting ? (
                <span>Envoi de l'offre...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer la proposition</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
