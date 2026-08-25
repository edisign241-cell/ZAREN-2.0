'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface TierFeature {
  text: string;
  highlight?: boolean;
}

const PAY_PER_POST_FEATURES: TierFeature[] = [
  { text: "Paiement à l'acte : 500 FCFA par produit publié" },
  { text: "Lien de paiement séquestre (Escrow) sécurisé" },
  { text: "Partage direct (WhatsApp, Instagram, Telegram)" },
  { text: "Badge de confiance acheteur standard" },
  { text: "Support sous 48h en cas de litige" }
];

const PRO_SUBSCRIPTION_FEATURES: TierFeature[] = [
  { text: "Publications de produits illimitées", highlight: true },
  { text: "Génération de descriptions IA optimisées (illimitée)", highlight: true },
  { text: "Badge officiel « Vendeur Vérifié ZARÉN »", highlight: true },
  { text: "Priorité absolue sur le déblocage des fonds", highlight: true },
  { text: "Arbitrage prioritaire & support dédié 24/7" },
  { text: "Visibilité boostée sur le réseau social ZARÉN" }
];

export default function Pricing() {
  const router = useRouter();
  const { isLoggedIn, openRegisterModal, setSelectedPlan: setAuthPlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'payg' | 'pro'>('pro');
  const [sliderValue, setSliderValue] = useState(15);

  const handleChoosePlan = (plan: 'PRO' | 'PER_LISTING') => {
    setAuthPlan(plan);
    if (!isLoggedIn) {
      openRegisterModal();
    } else {
      router.push('/seller/new');
    }
  };

  return (
    <section id="tarifs" className="relative w-full bg-[#0E0E0E] text-[#F3F3F3] py-24 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans border-b border-neutral-800">
      
      {/* Texture de fond millimétrée */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        
        {/* Header de section instrumenté */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-widest text-[#8A8A8A] uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#008A45] animate-pulse" />
            Structure Tarifaire Hybride
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-xl"
          >
            Vendez sans friction. Évoluez à votre rythme.
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-[#8A8A8A] max-w-md font-normal leading-relaxed"
          >
            Choisissez entre la liberté du paiement à l’acte ou la puissance de l’illimité avec le pass Pro.
          </motion.p>
        </div>

        {/* Grille des tarifs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* Option 1 : Paiement par publication (500 FCFA) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setSelectedPlan('payg')}
            className={`relative rounded-2xl p-8 cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
              selectedPlan === 'payg' 
                ? 'bg-[#161616] border-[#008A45] shadow-[0_0_30px_rgba(0,138,69,0.12)]' 
                : 'bg-[#121212] border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">Paiement à l'acte</h3>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">Pour vendeurs occasionnels</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02]">
                  <Zap className="w-4 h-4 text-[#8A8A8A]" />
                </div>
              </div>

              {/* Prix */}
              <div className="mb-8 font-mono">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">500</span>
                  <span className="text-sm font-semibold text-[#8A8A8A]">FCFA</span>
                </div>
                <span className="text-[11px] text-[#606060] uppercase tracking-wider block mt-1">
                  par produit publié • sans engagement
                </span>
              </div>

              {/* Features */}
              <div className="space-y-3.5 pt-4 border-t border-white/[0.06]">
                {PAY_PER_POST_FEATURES.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-xs text-[#B0B0B0] leading-tight font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-6">
              <button
                onClick={() => handleChoosePlan('PER_LISTING')}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-200 border border-white/20 bg-transparent hover:bg-white/5 text-white flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                PUBLIER UN PRODUIT (500 FCFA)
              </button>
            </div>
          </motion.div>

          {/* Option 2 : Abonnement Illimité (4 500 FCFA / mois) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setSelectedPlan('pro')}
            className={`relative rounded-2xl p-8 cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
              selectedPlan === 'pro' 
                ? 'bg-[#161616] border-[#008A45] shadow-[0_0_40px_rgba(0,138,69,0.2)]' 
                : 'bg-[#121212] border-white/10 hover:border-white/20'
            }`}
          >
            {/* Badge exclusif */}
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#008A45] text-[10px] font-bold tracking-widest uppercase text-white font-mono shadow-md">
              Recommandé Commerçants
            </div>

            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-1.5">
                    Abonnement Pro <Sparkles className="w-3.5 h-3.5 text-[#008A45]" />
                  </h3>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">Pour commerçants et boutiques actives</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-[#008A45]/30 flex items-center justify-center bg-[#008A45]/10">
                  <ShieldCheck className="w-4 h-4 text-[#008A45]" />
                </div>
              </div>

              {/* Prix */}
              <div className="mb-8 font-mono">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">4 500</span>
                  <span className="text-sm font-semibold text-[#008A45]">FCFA</span>
                  <span className="text-xs text-[#8A8A8A] font-normal">/ mois</span>
                </div>
                <span className="text-[11px] text-[#008A45] uppercase tracking-wider block mt-1 font-semibold">
                  Rentable dès 10 publications / mois
                </span>
              </div>

              {/* Features */}
              <div className="space-y-3.5 pt-4 border-t border-white/[0.06]">
                {PRO_SUBSCRIPTION_FEATURES.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#008A45]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-[#008A45]" />
                    </div>
                    <span className={`text-xs leading-tight ${feature.highlight ? 'text-white font-semibold' : 'text-[#B0B0B0]'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-6">
              <button
                onClick={() => handleChoosePlan('PRO')}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-200 bg-[#008A45] hover:bg-[#007339] text-white flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,138,69,0.39)] hover:scale-[1.01] active:scale-[0.99] text-center cursor-pointer"
              >
                <span>ACTIVER LE PASS PRO (4 500 FCFA)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* Simulateur Interactif de Rentabilité */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl bg-[#141414] border border-white/10 text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black italic uppercase text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#008A45]" />
                <span>Simulateur d'Économie en Temps Réel</span>
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Ajustez votre volume mensuel d'annonces pour calculer votre formule la plus rentable.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#008A45] bg-[#008A45]/10 px-3 py-1 rounded-full border border-[#008A45]/20">
              Calcul instantané
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            <div className="md:col-span-7 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">Nombre d'annonces par mois :</span>
                <span className="text-white font-bold text-sm">{sliderValue} articles</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#008A45]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>1 article</span>
                <span>25 articles</span>
                <span>50 articles</span>
              </div>
            </div>

            <div className="md:col-span-5 p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-right">
              <div className="text-[11px] text-gray-400">
                Coût à l'acte (500 FCFA/u) : <strong className="text-white font-mono">{sliderValue * 500} FCFA</strong>
              </div>
              <div className="text-[11px] text-gray-400">
                Coût avec Pass Pro : <strong className="text-[#008A45] font-mono">4 500 FCFA</strong>
              </div>
              <div className="pt-2 border-t border-white/10 text-xs font-black italic text-white flex justify-between">
                <span>Votre économie mensuelle :</span>
                <span className={sliderValue >= 10 ? 'text-emerald-400 font-mono text-sm' : 'text-gray-400 font-mono'}>
                  {sliderValue >= 10 ? `+${(sliderValue * 500) - 4500} FCFA` : 'Formule à l\'acte idéale'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de tarification */}
        <div className="mt-12 text-center">
          <p className="text-xs font-mono text-[#606060]">
            🔒 Tous les paiements et abonnements sont gérés via Mobile Money & Séquestre ZARÉN. Aucun prélèvement surprise.
          </p>
        </div>

      </div>
    </section>
  );
}
