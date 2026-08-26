'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Sparkles,
  Store,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag,
  Clock,
  MapPin,
  Bot
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export type SelectedTierType = 'BUYER' | 'STANDARD' | 'PRO';

interface TierSelectorProps {
  onSelectTier?: (tier: SelectedTierType) => void;
  redirectTo?: string;
}

export default function TierSelector({ onSelectTier, redirectTo }: TierSelectorProps) {
  const router = useRouter();
  const { openRegisterModal, setSelectedPlan } = useAuth();
  const [activeTier, setActiveTier] = useState<SelectedTierType>('PRO');
  const [proBillingCycle, setProBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  const handleChoose = (tier: SelectedTierType) => {
    if (onSelectTier) {
      onSelectTier(tier);
      return;
    }

    if (tier === 'BUYER') {
      setSelectedPlan('STANDARD');
      openRegisterModal();
    } else if (tier === 'STANDARD') {
      setSelectedPlan('PER_LISTING');
      openRegisterModal();
    } else {
      setSelectedPlan('PRO');
      openRegisterModal();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008A45]/10 text-[#008A45] text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Choisissez votre profil ZARÉN</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black italic text-gray-900">
          Une plateforme adaptée à chaque usage
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Rejoignez le 1er réseau de commerce sécurisé par séquestre bancaire au Gabon et en Afrique Centrale.
        </p>
      </div>

      {/* Grid des 3 Offres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        {/* 1. ACHETEUR SIMPLE (100% GRATUIT) */}
        <div
          onClick={() => setActiveTier('BUYER')}
          className={`rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
            activeTier === 'BUYER'
              ? 'bg-white border-[#008A45] shadow-xl ring-2 ring-[#008A45]/20 scale-102'
              : 'bg-white/80 border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#008A45] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gray-100 text-gray-700">
                100% GRATUIT
              </span>
            </div>

            <div>
              <h3 className="text-base font-black italic text-gray-900">Acheteur Simple</h3>
              <p className="text-xs text-gray-500">Pour commander en toute sécurité avec garantie 48h.</p>
            </div>

            <div className="pt-1 pb-2">
              <span className="text-2xl font-black text-gray-900">0 FCFA</span>
              <span className="text-xs text-gray-400"> / à vie</span>
            </div>

            <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
                <span>Paiement séquestré garanti</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
                <span>Suivi de livraison en temps réel</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
                <span>Messagerie directe avec le vendeur</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleChoose('BUYER');
            }}
            className="w-full mt-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Créer mon compte Acheteur</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. VENDEUR STANDARD (500 FCFA / ANNONCE) */}
        <div
          onClick={() => setActiveTier('STANDARD')}
          className={`rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
            activeTier === 'STANDARD'
              ? 'bg-white border-[#008A45] shadow-xl ring-2 ring-[#008A45]/20 scale-102'
              : 'bg-white/80 border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Tag className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700">
                PAY-PER-POST
              </span>
            </div>

            <div>
              <h3 className="text-base font-black italic text-gray-900">Vendeur Standard</h3>
              <p className="text-xs text-gray-500">Pour vendre occasionnellement (UX type Vinted).</p>
            </div>

            <div className="pt-1 pb-2">
              <span className="text-2xl font-black text-gray-900">500 FCFA</span>
              <span className="text-xs text-gray-400"> / par publication</span>
            </div>

            <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
                <span>0 abonnement mensuel</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
                <span>Dressing 2 colonnes & avis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
                <span>Retraits Mobile Money Airtel / Moov</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleChoose('STANDARD');
            }}
            className="w-full mt-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Démarrer en Standard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. VENDEUR MARCHAND PRO (4 500 FCFA / MOIS) */}
        <div
          onClick={() => setActiveTier('PRO')}
          className={`rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
            activeTier === 'PRO'
              ? 'bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white border-neutral-700 shadow-2xl scale-104 ring-2 ring-amber-400/40'
              : 'bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border-neutral-700'
          }`}
        >
          <div className="absolute top-0 right-0 bg-amber-400 text-neutral-950 font-black text-[9px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            ⭐ RECOMMANDÉ
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black italic text-white">Vendeur Marchand Pro</h3>
                <p className="text-[11px] text-gray-300">Boutique officielle & publications illimitées.</p>
              </div>
            </div>

            {/* Toggle Mensuel / Annuel */}
            <div className="flex items-center gap-1.5 p-1 bg-white/10 rounded-xl">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setProBillingCycle('MONTHLY');
                }}
                className={`flex-1 py-1 text-[10px] font-black rounded-lg transition ${
                  proBillingCycle === 'MONTHLY' ? 'bg-[#008A45] text-white shadow-xs' : 'text-gray-300 hover:text-white'
                }`}
              >
                Mensuel (4 500 F)
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setProBillingCycle('YEARLY');
                }}
                className={`flex-1 py-1 text-[10px] font-black rounded-lg transition ${
                  proBillingCycle === 'YEARLY' ? 'bg-amber-400 text-neutral-950 shadow-xs' : 'text-gray-300 hover:text-white'
                }`}
              >
                Annuel (-17%)
              </button>
            </div>

            <div className="pt-1 pb-2">
              <span className="text-2xl font-black text-[#4ade80]">
                {proBillingCycle === 'MONTHLY' ? '4 500 FCFA' : '45 000 FCFA'}
              </span>
              <span className="text-xs text-gray-400">
                {proBillingCycle === 'MONTHLY' ? ' / mois' : ' / an (2 mois offerts)'}
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-200 border-t border-neutral-700/80 pt-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0" />
                <span><strong>Publications illimitées</strong> (0 F/acte)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0" />
                <span>Bannière HD & Logo d'enseigne</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0" />
                <span>Badge officiel « ⭐ Vendeur Vérifié »</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0" />
                <span>Assistant IA <em>SellerCoach</em> illimité</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleChoose('PRO');
            }}
            className="w-full mt-5 py-3 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/40 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Activer le Pass Pro</span>
          </button>
        </div>

      </div>

    </div>
  );
}
