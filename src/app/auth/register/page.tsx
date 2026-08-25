'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, User, Store, ShoppingBag, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('Abidjan');
  const [district, setDistrict] = useState('Cocody');
  const [accountType, setAccountType] = useState<'SELLER' | 'BUYER' | 'BOTH'>('BOTH');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      alert('Veuillez remplir votre nom et numéro de téléphone.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/auth/verify?phone=${encodeURIComponent(phoneNumber)}&channel=WHATSAPP`);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] p-6 flex flex-col justify-between animate-fade-in bg-white">
      <div>
        <div className="text-center mb-6 pt-2">
          <span className="text-2xl font-black tracking-widest text-slate-900 uppercase block mb-1">
            ZARÉN
          </span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
            Créer un compte sécurisé
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
              Nom complet ou Nom de boutique *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Aïcha Traoré / Kicks Store"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-hidden focus:border-slate-900 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
              Numéro de téléphone (WhatsApp) *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-slate-500">🇨🇮 +225</span>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07 00 00 00 00"
                className="w-full text-xs font-bold pl-20 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-hidden focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                Ville
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                Quartier
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
              Je souhaite principalement
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('BOTH')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  accountType === 'BOTH'
                    ? 'border-slate-900 bg-slate-900 text-white font-bold'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <span className="text-[11px]">Les deux</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('SELLER')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  accountType === 'SELLER'
                    ? 'border-slate-900 bg-slate-900 text-white font-bold'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <span className="text-[11px]">Vendre</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('BUYER')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  accountType === 'BUYER'
                    ? 'border-slate-900 bg-slate-900 text-white font-bold'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <span className="text-[11px]">Acheter</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <span>{isLoading ? 'Création...' : 'Créer mon compte & Recevoir le code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      <div className="text-center pt-6 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Vous avez déjà un compte ?{' '}
          <Link href="/auth/login" className="font-bold text-slate-900 underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
