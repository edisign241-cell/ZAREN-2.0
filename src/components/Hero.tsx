'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, ArrowRight, Check, MapPin, ExternalLink, Sparkles, Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { partnerAdService } from '@/lib/partners';
import { PartnerAd } from '@/types';

export default function Hero() {
  const [phone, setPhone] = useState('');
  const { isLoggedIn, openRegisterModal } = useAuth();
  const router = useRouter();

  const [activeAds, setActiveAds] = useState<PartnerAd[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const ads = partnerAdService.getActiveAds();
    setActiveAds(ads);
  }, []);

  // Rotation automatique de la pub partenaire toutes les 6 secondes
  useEffect(() => {
    if (activeAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeAds]);

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
    window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNextAd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
  };

  const handlePrevAd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentAdIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  };

  return (
    <section id="vendre" className="py-8 md:py-16 overflow-hidden border-b border-[#E5E5E5] bg-[#F8F8F8] font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Texte Hero & CTA Vendeur */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#008A45] text-xs font-black italic tracking-wide uppercase shadow-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Zéro arnaque • 100 % Garanti par Séquestre</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tight leading-[1.12] text-[#111111]">
              Le moyen <span className="text-[#008A45]">simple et sécurisé</span> de vendre en ligne, même sans boutique.
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Publiez votre article en 30 secondes, partagez le lien sur WhatsApp et réseaux sociaux. L'argent est sécurisé jusqu'à la livraison confirmée.
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
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium flex-wrap">
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

          {/* Smartphone Mockup Flottant : ESPACE PUBLICITÉ & PARTENARIATS */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-center justify-center space-y-3"
          >
            <div className="w-full max-w-[340px] bg-white rounded-[2.5rem] p-4 shadow-2xl border-2 border-emerald-500/30 relative animate-float-phone">
              
              {/* Notch */}
              <div className="w-28 h-3.5 bg-[#111827]/10 rounded-full mx-auto mb-3" />
              
              {/* Mockup Header avec Petite Icône ZARÉN & Badge Partenaire */}
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-md bg-[#111827] border border-gray-800 flex items-center justify-center p-0.5 shadow-xs">
                    <img src="/logo.png" alt="Z" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black italic text-xs tracking-tight text-[#111111]">ZARÉN</span>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  <span>Sponsorisé</span>
                </div>
              </div>

              {/* Contenu Dynamique de la Publicité Partenaire */}
              {currentAd ? (
                <div className="mt-3 relative group">
                  <div className="bg-[#F8F8F8] rounded-2xl p-3 border border-[#E5E5E5] group-hover:border-[#008A45] transition-all">
                    
                    {/* Média Publicitaire */}
                    <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden relative mb-2.5 shadow-inner">
                      <img 
                        src={currentAd.mediaUrl} 
                        alt={currentAd.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      
                      {/* Badge Partenaire Officiel */}
                      <div className="absolute top-2 left-2 bg-[#111827]/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 shadow-xs border border-white/10">
                        <Megaphone className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{currentAd.partnerName}</span>
                      </div>

                      {/* Indicateur de carrousel */}
                      {activeAds.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                          {currentAdIndex + 1} / {activeAds.length}
                        </div>
                      )}

                      {/* Boutons flèches carrousel au hover */}
                      {activeAds.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevAd}
                            aria-label="Publicité précédente"
                            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleNextAd}
                            aria-label="Publicité suivante"
                            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Titre & Slogan de l'annonce */}
                    <div className="mb-2">
                      <h3 className="font-black italic text-xs text-[#111111] leading-tight">
                        {currentAd.title}
                      </h3>
                      <p className="text-[10px] text-gray-600 line-clamp-2 mt-1 leading-snug font-medium">
                        {currentAd.tagline}
                      </p>
                    </div>
                    
                    {/* Bouton Redirection Vers le Site Partenaire */}
                    <button 
                      onClick={() => handleAdClick(currentAd)}
                      className="w-full py-2.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <span>{currentAd.ctaText || 'Visiter le site partenaire'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center space-y-2">
                  <Megaphone className="w-8 h-8 text-[#008A45] mx-auto" />
                  <h4 className="text-xs font-bold text-gray-800">Espace Publicité Partenaire</h4>
                  <p className="text-[10px] text-gray-500">Diffusez votre marque ici auprès de milliers d'acheteurs et vendeurs actifs.</p>
                </div>
              )}

              {/* Trust pill */}
              <div className="mt-3 p-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#008A45] shrink-0" />
                <p className="text-[9px] text-emerald-950 leading-tight font-medium">
                  Partenaire vérifié par ZARÉN Séquestre Central Africa.
                </p>
              </div>
            </div>

            {/* Lien direct pour Devenir Partenaire & Créer sa campagne */}
            <Link
              href="/partners/advertise"
              className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-white hover:bg-emerald-50 text-[#008A45] border border-emerald-300 text-xs font-bold shadow-xs hover:shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>📢 Vous êtes une entreprise ? Diffusez votre pub ici →</span>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
