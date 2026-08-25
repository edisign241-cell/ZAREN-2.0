'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, MessageCircle, Phone, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      alert('Veuillez saisir un numéro de téléphone valide.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Redirige vers la vérification OTP avec le numéro
      router.push(`/auth/verify?phone=${encodeURIComponent(phoneNumber)}&channel=${channel}`);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] p-6 flex flex-col justify-between animate-fade-in bg-white">
      <div>
        {/* Header ASOS Minimalist */}
        <div className="text-center mb-8 pt-4">
          <span className="text-2xl font-black tracking-widest text-slate-900 uppercase block mb-1">
            ZARÉN
          </span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
            Connexion Rapide & Sécurisée
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-600 leading-snug">
            Pas de mot de passe à retenir. Connectez-vous avec votre numéro et recevez un code OTP instantané.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
              Numéro de téléphone
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-slate-500">🇨🇮 +225</span>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07 00 00 00 00"
                className="w-full text-sm font-bold pl-20 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-hidden focus:border-slate-900 focus:bg-white transition-all tracking-wider"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
              Recevoir mon code par
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setChannel('WHATSAPP')}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  channel === 'WHATSAPP'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('SMS')}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  channel === 'SMS'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>SMS classique</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <span>{isLoading ? 'Envoi du code...' : 'Recevoir mon code OTP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Footer link */}
      <div className="text-center pt-6 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Nouveau sur Zarén ?{' '}
          <Link href="/auth/register" className="font-bold text-slate-900 underline underline-offset-4">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
