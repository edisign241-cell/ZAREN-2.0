'use client';

import React, { useState } from 'react';
import { ShieldCheck, Zap, X, CheckCircle2, Lock, Smartphone, CreditCard, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

import { useAuth } from '@/context/AuthContext';

interface PublishPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
  productPrice: number;
  onPaymentSuccess: () => void;
}

export default function PublishPaymentModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  productPrice,
  onPaymentSuccess,
}: PublishPaymentModalProps) {
  const { selectedCountry } = useAuth();
  const operators = selectedCountry.mobileMoneyOperators || [
    { id: 'AIRTEL_MONEY', name: 'Airtel Money', color: 'red' },
    { id: 'MOOV_MONEY', name: 'Moov Money', color: 'blue' }
  ];

  const [method, setMethod] = useState<string>(operators[0]?.id || 'AIRTEL_MONEY');
  const [phone, setPhone] = useState(`${selectedCountry.phonePrefix} 07 45 88 12`);
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/v1/products/pay-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          amount: 500,
          currency: 'FCFA',
          paymentMethod: method,
          phoneNumber: phone,
        }),
      });

      const json = await res.json();
      if (json.success) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        onPaymentSuccess();
      } else {
        setErrorMsg(json.error || 'Échec du paiement.');
      }
    } catch (err: any) {
      setErrorMsg('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer" />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 animate-scale-in">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#4ade80] text-[10px] font-black italic tracking-wide mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>VENDEUR STANDARD — FACTURATION À L'ACTE</span>
          </div>

          <h2 className="text-lg font-black italic">
            Frais de publication : 500 FCFA
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Votre article sera immédiatement visible par tous les acheteurs du Grand Marché ZARÉN.
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handlePay} className="p-6 space-y-4">
          
          {/* Récapitulatif article */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
            <div className="truncate mr-2">
              <span className="text-gray-500 block text-[10px] font-bold uppercase">Article à publier</span>
              <span className="font-bold text-gray-900 truncate block">{productTitle}</span>
            </div>
            <span className="font-black text-[#008A45] shrink-0 bg-emerald-100/60 px-2.5 py-1 rounded-xl">
              500 FCFA
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Choix du moyen de paiement */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block uppercase">
              Choisir votre moyen de paiement :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {operators.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setMethod(op.id)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    method === op.id
                      ? 'border-[#008A45] bg-emerald-50 text-[#008A45] font-black ring-2 ring-[#008A45]/20'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-[#008A45]" />
                  <span className="text-[11px] block leading-tight">{op.name}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => setMethod('CARD')}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                  method === 'CARD'
                    ? 'border-[#008A45] bg-emerald-50 text-[#008A45] font-black ring-2 ring-[#008A45]/20'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-gray-800" />
                <span className="text-[11px] block leading-tight">Carte Visa</span>
              </button>
            </div>
          </div>

          {/* Saisie Coordonnées */}
          {method !== 'CARD' ? (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Numéro Mobile Money ({operators.find(o => o.id === method)?.name || 'Mobile Money'}) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={`${selectedCountry.phonePrefix} 07 45 88 12`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-mono font-bold outline-hidden transition"
              />
              <p className="text-[10px] text-gray-400">
                Vous recevrez une notification USSD sur votre téléphone pour valider les 500 FCFA.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Numéro de carte bancaire *</label>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4000 1234 5678 9010"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-mono outline-hidden transition"
              />
            </div>
          )}

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#008A45] shrink-0" />
            <span>Paiement sécurisé crypté par séquestre bancaire ZARÉN.</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Validation du paiement en cours...</span>
            ) : (
              <>
                <span>Payer 500 FCFA & Publier l'article</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
