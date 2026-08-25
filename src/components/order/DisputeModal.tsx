'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { zarenStore } from '@/db/store';
import { Order, Dispute } from '@/types';

interface DisputeModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedOrder: Order) => void;
}

export default function DisputeModal({
  order,
  isOpen,
  onClose,
  onSuccess,
}: DisputeModalProps) {
  const [reason, setReason] = useState<Dispute['reason']>('NOT_AS_DESCRIBED');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Veuillez décrire le motif du problème.');
      return;
    }

    setIsSubmitting(true);
    try {
      zarenStore.openDispute(order.id, reason, description);
      const updated = zarenStore.getOrderById(order.id);
      if (updated) onSuccess(updated);
      onClose();
    } catch (err) {
      alert('Impossible d\'ouvrir le litige.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h3 className="text-center font-black text-slate-900 text-lg">
          Signaler un problème
        </h3>
        <p className="text-center text-xs text-slate-500 mt-1 mb-4">
          L'ouverture d'un litige <strong>gèle immédiatement le paiement</strong>. Le vendeur ne sera pas payé tant que la situation n'est pas résolue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Motif du litige
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as Dispute['reason'])}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-hidden focus:border-amber-500 font-medium"
            >
              <option value="NOT_AS_DESCRIBED">Article non conforme aux photos / description</option>
              <option value="DAMAGED">Article abîmé ou endommagé</option>
              <option value="WRONG_ITEM">Mauvais article reçu</option>
              <option value="ITEM_NOT_RECEIVED">Colis non reçu</option>
              <option value="OTHER">Autre problème</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Détails du problème
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expliquez ce qui ne va pas (défaut constaté, taille différente...)"
              rows={3}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isSubmitting ? 'Envoi...' : 'Geler les fonds et ouvrir le dossier'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
