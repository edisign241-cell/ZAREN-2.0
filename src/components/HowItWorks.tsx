'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Camera, Share2, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    step: 1,
    title: "1. Publier l'article",
    desc: "Ajoutez vos photos HD et vidéos de démonstration, fixez votre prix et profitez de l'assistant IA pour la description.",
    image: "https://images.unsplash.com/photo-1556742049-0a67e55722c0?auto=format&fit=crop&w=700&q=80",
    badge: "30 secondes",
    icon: Camera
  },
  {
    step: 2,
    title: "2. Partager le lien",
    desc: "Diffusez votre lien unique sur WhatsApp, Facebook, TikTok, Instagram ou Telegram pour transformer vos abonnés en acheteurs.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=700&q=80",
    badge: "Lien direct",
    icon: Share2
  },
  {
    step: 3,
    title: "3. Paiement Séquestré",
    desc: "L'acheteur règle par Mobile Money (Airtel, Moov, MTN, Orange). Les fonds sont immédiatement cantonnés et garantis par Zarén.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=700&q=80",
    badge: "Fonds bloqués",
    icon: Lock
  },
  {
    step: 4,
    title: "4. Livraison & Versement",
    desc: "L'acheteur inspecte son colis et confirme la conformité. Le vendeur reçoit automatiquement son argent sans frais cachés.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80",
    badge: "Payout instantané",
    icon: CheckCircle2
  }
];

export default function HowItWorks() {
  return (
    <section id="concept" className="py-16 md:py-24 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        
        {/* En-tête de section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#008A45] text-xs font-black italic tracking-wide uppercase border border-emerald-200 shadow-xs">
            <Sparkles className="w-4 h-4" />
            <span>Simplicité & Sécurité</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black italic text-[#111111] tracking-tight">
            Comment fonctionne ZARÉN ?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            La méthode la plus rapide d'Afrique Centrale pour vendre et acheter en toute confiance.
          </p>
        </div>

        {/* 4 Cartes d'étapes immersives avec vraies photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="card-step-hover bg-[#F8F8F8] rounded-3xl border border-[#E5E5E5] overflow-hidden flex flex-col shadow-xs"
              >
                <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#008A45] text-white font-black italic flex items-center justify-center text-xs shadow-md">
                    {item.step}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <IconComponent className="w-3 h-3" />
                    <span>{item.badge}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-black italic text-base mb-1.5 text-[#111111]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to action de bas de section */}
        <div className="text-center pt-2">
          <Link
            href="/seller/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#008A45] hover:bg-[#007339] text-white font-black italic rounded-full text-sm transition shadow-md active:scale-95"
          >
            <span>Créer mon premier produit gratuitement</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
