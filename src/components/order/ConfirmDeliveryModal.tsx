'use client';

import React, { useState } from 'react';
import { ShieldCheck, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { zarenStore } from '@/db/store';
import { Order } from '@/types';

interface ConfirmDeliveryModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedOrder: Order) => void;
}

export default function ConfirmDeliveryModal({
  order,
  isOpen,
  onClose,
  onSuccess,
}: ConfirmDeliveryModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);

    try {
      // 1. Débloque les fonds et passe à COMPLETED
      const updated = zarenStore.updateOrderStatus(order.id, 'COMPLETED');

      // 2. Enregistre l'avis sur le vendeur
      if (order.sellerId) {
        zarenStore.addReview({
          orderId: order.id,
          authorId: order.buyerId,
          authorName: order.deliveryAddress?.phone || 'Acheteur Vérifié',
          targetSellerId: order.sellerId,
          rating,
          comment: comment || 'Article conforme et reçu en parfait état.',
        });
      }

      // 3. Animation de célébration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }

      onSuccess(updated);
      onClose();
    } catch (err) {
      alert('Une erreur est survenue lors de la validation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <h3 className="text-center font-black text-slate-900 text-lg">
          Confirmer la bonne réception
        </h3>
        <p className="text-center text-xs text-slate-500 mt-1 mb-5">
          Cette action confirme que vous avez inspecté et approuvé l'article. Les fonds sous séquestre seront immédiatement libérés au vendeur.
        </p>

        <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-200 text-center">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Notez votre expérience avec le vendeur
          </label>
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 text-amber-400 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Laisser un commentaire (facultatif)..."
            rows={2}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white outline-hidden focus:border-zaren-500"
          />
        </div>

        <div className="space-y-2">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-zaren-600 hover:bg-zaren-700 text-white font-bold text-sm shadow-md shadow-zaren-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Validation...' : 'Libérer les fonds au vendeur'}</span>
          </button>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Annuler et vérifier plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
