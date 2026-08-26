'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Phone, MapPin, X, ArrowRight, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

import { CENTRAL_AFRICA_COUNTRIES } from '@/lib/geo/countries';

interface BuyerFastOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  redirectTo?: string;
}

export default function BuyerFastOnboardingModal({
  isOpen,
  onClose,
  product,
  redirectTo,
}: BuyerFastOnboardingModalProps) {
  const router = useRouter();
  const { register, selectedCountry } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(selectedCountry?.code || 'GA');
  const activeCountry = CENTRAL_AFRICA_COUNTRIES.find(c => c.code === countryCode) || selectedCountry;
  const [city, setCity] = useState(activeCountry.defaultCity);
  const [district, setDistrict] = useState(activeCountry.defaultDistrict || 'Centre');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCountrySelect = (code: string) => {
    setCountryCode(code);
    const countryObj = CENTRAL_AFRICA_COUNTRIES.find(c => c.code === code) || CENTRAL_AFRICA_COUNTRIES[0];
    if (countryObj.cities.length > 0) {
      setCity(countryObj.cities[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Création du compte Acheteur Simple (100% gratuit)
      register({
        name: fullName.trim(),
        phone: phone.trim(),
        country: `${activeCountry.name} ${activeCountry.flag}`,
        countryCode: activeCountry.code,
        city,
        district,
        account_tier: 'BUYER',
        plan: 'FREE',
        isPhoneVerified: true,
      });

      // Sauvegarde de l'article dans la session / localStorage pour préservation du panier
      if (product) {
        try {
          localStorage.setItem('zaren_last_viewed_product', JSON.stringify(product));
        } catch (e) {}
      }

      onClose();

      // Redirection immédiate et fluide vers le checkout sécurisé
      const targetUrl = redirectTo || (product ? `/checkout/${product.id}` : '/');
      router.push(targetUrl);
    } catch (err: any) {
      setErrorMsg('Une erreur est survenue lors de la création du compte.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer" />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 animate-scale-in">
        
        {/* Header Invitation */}
        <div className="p-6 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#4ade80] text-[10px] font-black italic tracking-wide mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>COMMANDE SÉCURISÉE SOUS SÉQUESTRE</span>
          </div>

          <h2 className="text-lg font-black italic">
            Finalisez votre commande
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Créez votre compte Acheteur <strong className="text-white">100% gratuit</strong> en 10 secondes pour suivre votre livraison.
          </p>

          {/* Mini récapitulatif produit */}
          {product && (
            <div className="mt-3 p-2.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-3">
              <img
                src={product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                alt={product.title}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{product.title}</h4>
                <span className="text-xs font-black text-[#4ade80] font-mono">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Formulaire Express */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Nom & Prénom */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-gray-600 block flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#008A45]" />
              <span>Nom complet & Prénom *</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Jean-Marc Nguema"
              className="w-full text-xs font-semibold px-3.5 py-2.5 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
            />
          </div>

          {/* Pays & Téléphone */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-gray-600 block">Pays</label>
              <select
                value={countryCode}
                onChange={(e) => handleCountrySelect(e.target.value)}
                className="w-full text-xs font-semibold px-2 py-2.5 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] rounded-xl outline-hidden"
              >
                {CENTRAL_AFRICA_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-[11px] font-bold uppercase text-gray-600 block flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#008A45]" />
                <span>Téléphone Mobile Money *</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={`Ex: ${activeCountry.phonePrefix} 07 45 88 12`}
                className="w-full text-xs font-mono font-bold px-3.5 py-2.5 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
              />
            </div>
          </div>

          {/* Ville & Quartier */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-gray-600 block">Ville</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] rounded-xl outline-hidden"
              >
                {activeCountry.cities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-gray-600 block">Quartier</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Ex: Louis, Akwa, Centre"
                className="w-full text-xs font-semibold px-3 py-2.5 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] rounded-xl outline-hidden"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
            <span>Compte Acheteur 100% gratuit avec protection acheteur 48h.</span>
          </div>

          {/* Bouton de confirmation */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <span>Initialisation de votre commande...</span>
            ) : (
              <>
                <span>Continuer vers le paiement</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
