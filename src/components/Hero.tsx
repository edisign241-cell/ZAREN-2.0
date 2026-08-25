'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, ArrowRight, Check, MapPin, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const [phone, setPhone] = useState('');
  const { isLoggedIn, openRegisterModal } = useAuth();
  const router = useRouter();

  const handleStartSelling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openRegisterModal();
    } else {
      router.push('/seller/new');
    }
  };

  return (
    <section id="vendre" className="py-8 md:py-16 overflow-hidden border-b border-[#E5E5E5] bg-[#F8F8F8]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Texte Hero & CTA */}
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
                className="flex-1 px-4 py-3.5 bg-white rounded-xl border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#008A45] focus:border-transparent text-sm shadow-sm font-medium"
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

          {/* Smartphone Mockup Flottant */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="w-full max-w-[340px] bg-white rounded-[2.5rem] p-4 shadow-2xl border border-[#E5E5E5] relative animate-float-phone">
              {/* Notch */}
              <div className="w-28 h-3.5 bg-[#111827]/10 rounded-full mx-auto mb-3" />
              
              {/* Mockup Header avec Petite Icône ZARÉN */}
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-md bg-[#111827] border border-gray-800 flex items-center justify-center p-0.5 shadow-xs">
                    <img src="/logo.png" alt="Z" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black italic text-xs tracking-tight text-[#111111]">ZARÉN</span>
                </div>
                <span className="text-gray-500 flex items-center gap-1 font-semibold text-[11px]">
                  <MapPin className="w-3 h-3 text-[#008A45]" /> Libreville
                </span>
              </div>

              {/* Product Card Preview */}
              <Link 
                href="/p/zrn-ip14" 
                className="block mt-3 bg-[#F8F8F8] rounded-2xl p-3 border border-[#E5E5E5] hover:border-[#008A45] transition-all group"
              >
                <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden relative mb-2.5">
                  <img 
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" 
                    alt="iPhone 14" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
                    ★ 4.9 (64)
                  </div>
                  <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-xs">
                    <span>▶</span> Vidéo HD
                  </div>
                </div>
                
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-black italic text-sm text-[#111111] truncate pr-2">iPhone 14 Pro Max</h3>
                  <span className="font-black text-sm text-[#008A45] whitespace-nowrap">480 000 FCFA</span>
                </div>
                
                <p className="text-[11px] text-gray-500 line-clamp-1 mb-2.5 font-medium">iStore • Vendeur vérifié</p>
                
                <button className="w-full py-2 bg-[#008A45] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm">
                  <Lock className="w-3.5 h-3.5" /> ACHETER EN SÉCURITÉ
                </button>
              </Link>

              {/* Trust pill */}
              <div className="mt-3 p-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#008A45] shrink-0" />
                <p className="text-[9px] text-emerald-950 leading-tight font-medium">
                  Fonds bloqués jusqu'à confirmation de conformité du colis.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
