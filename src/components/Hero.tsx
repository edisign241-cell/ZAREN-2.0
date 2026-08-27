'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  ArrowRight,
  Check,
  ExternalLink,
  Sparkles,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { partnerAdService } from '@/lib/partners';
import { PartnerAd } from '@/types';

export default function Hero() {
  const [phone, setPhone] = useState('');
  const { isLoggedIn, openRegisterModal } = useAuth();
  const router = useRouter();

  const [activeAds, setActiveAds] = useState<PartnerAd[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const ads = partnerAdService.getActiveAds();
    setActiveAds(ads);
  }, []);

  // Rotation automatique de la bannière toutes les 6 secondes si non survolée
  useEffect(() => {
    if (activeAds.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeAds, isHovered]);

  const currentAd = activeAds[currentAdIndex] || null;

  const handleStartSelling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openRegisterModal();
    } else {
      router.push('/seller/new');
    }
  };

  const handleAdClick = (ad: PartnerAd) => {
    partnerAdService.incrementClick(ad.id);
    const targetUrl = ad.targetUrl.startsWith('http') ? ad.targetUrl : `https://${ad.targetUrl}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNextAd = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
  };

  const handlePrevAd = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentAdIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  };

  return (
    <section id="vendre" className="py-8 md:py-16 overflow-hidden border-b border-[#E5E5E5] bg-[#F8F9FA] font-sans relative">
      
      {/* Lueur d'ambiance de fond subtile */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* COLONNE GAUCHE : TEXTE HERO & CTA VENDEUR */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#008A45] text-xs font-black italic tracking-wide uppercase shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#008A45]" />
              <span>Zéro arnaque • 100 % Garanti par Séquestre</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black italic tracking-tight leading-[1.12] text-[#111111]">
              Le moyen <span className="text-[#008A45]">simple et sécurisé</span> de vendre en ligne, même sans boutique.
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Publiez votre article en 30 secondes, partagez le lien sur WhatsApp et réseaux sociaux. L'argent est sécurisé sous séquestre jusqu'à la livraison confirmée.
            </p>

            {/* Formulaire Rapide Vendeur */}
            <form onSubmit={handleStartSelling} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Votre numéro (ex: +241 07 45 88 12)"
                className="flex-1 px-4 py-3.5 bg-white rounded-xl border border-[#E5E5E5] focus:outline-hidden focus:ring-2 focus:ring-[#008A45] focus:border-transparent text-sm shadow-sm font-medium"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#008A45] hover:bg-[#007339] text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md whitespace-nowrap cursor-pointer active:scale-95"
              >
                <span>Commencer à vendre</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Badges de réassurance */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-5 text-xs text-gray-500 font-medium flex-wrap">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#008A45]" /> Sans abonnement
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#008A45]" /> Protection séquestre
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#008A45]" /> Retrait Mobile Money immédiat
              </span>
            </div>
          </motion.div>

          {/* COLONNE DROITE : GRANDE BANNIÈRE VITRINE PARTENAIRE HAUT DE GAMME */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative group rounded-3xl p-1 bg-gradient-to-br from-emerald-500/30 via-gray-200 to-emerald-600/20 shadow-2xl transition-all duration-300">
              
              {/* Carte Principale de la Bannière */}
              <div className="relative bg-[#111827] text-white rounded-[1.4rem] overflow-hidden shadow-inner flex flex-col justify-between">
                
                {/* 1. EN-TÊTE DE LA BANNIÈRE : BADGE OFFICIEL & PAGINATION */}
                <div className="p-4 sm:p-5 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <Megaphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentAd?.partnerName || 'Partenaire Officiel'}</span>
                    </div>

                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-gray-300 bg-white/10 px-2 py-0.5 rounded-full font-mono">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      Sponsorisé
                    </span>
                  </div>

                  {/* Indicateur de carrousel & Contrôles */}
                  {activeAds.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handlePrevAd}
                        aria-label="Publicité précédente"
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-xs active:scale-90"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-mono font-bold text-gray-300 px-1.5">
                        {currentAdIndex + 1}/{activeAds.length}
                      </span>
                      <button
                        onClick={handleNextAd}
                        aria-label="Publicité suivante"
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-xs active:scale-90"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. CONTENU VISUEL & MÉDIA PANORAMIQUE */}
                {currentAd ? (
                  <div className="relative min-h-[260px] sm:min-h-[300px] flex flex-col justify-end p-5 sm:p-7 overflow-hidden">
                    
                    {/* Image d'arrière-plan avec fondu cinématographique */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={currentAd.mediaUrl} 
                        alt={currentAd.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.75]" 
                      />
                      {/* Gradient sombre pour lisibilité maximale */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-transparent" />
                    </div>

                    {/* Contenu textuel sur l'image */}
                    <div className="relative z-10 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                          {currentAd.city || 'Libreville'} • {currentAd.country || 'Afrique Centrale'}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black italic tracking-tight text-white leading-tight drop-shadow-md">
                        {currentAd.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-gray-200 font-medium line-clamp-2 leading-relaxed max-w-lg drop-shadow-sm">
                        {currentAd.tagline}
                      </p>

                      {/* Barre d'action de la bannière */}
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                          onClick={() => handleAdClick(currentAd)}
                          className="py-3 px-5 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition active:scale-95 cursor-pointer"
                        >
                          <span>{currentAd.ctaText || 'Découvrir l’offre partenaire'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href="/partners/offer"
                          className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 backdrop-blur-md border border-white/15 transition cursor-pointer text-center"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>📢 Diffusez votre pub ici</span>
                        </Link>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <Megaphone className="w-10 h-10 text-[#008A45] mx-auto" />
                    <h3 className="text-base font-bold text-white">Espace Bannière Partenaires ZARÉN</h3>
                    <p className="text-xs text-gray-400">Positionnez votre entreprise au premier plan.</p>
                  </div>
                )}

                {/* 3. BAS DE BANNIÈRE : TRUST PILLS */}
                <div className="px-5 py-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Partenaire certifié ZARÉN Séquestre</span>
                  </div>

                  {/* Puces de navigation */}
                  {activeAds.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      {activeAds.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentAdIndex(idx)}
                          aria-label={`Aller à la publicité ${idx + 1}`}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            currentAdIndex === idx ? 'w-5 bg-[#008A45]' : 'w-1.5 bg-gray-600 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
