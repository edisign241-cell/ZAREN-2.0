'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecurityEscrow() {
  return (
    <section id="securite" className="py-16 md:py-24 bg-[#111111] text-white">
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        
        {/* Header Sécurité */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#008A45] text-xs font-black italic uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Garantie Totale Tiers de Confiance</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black italic tracking-tight text-white">
            La Sécurité Séquestre (Escrow) expliquée
          </h2>

          <p className="text-base sm:text-lg text-gray-300 font-medium leading-relaxed">
            Fini la peur de ne pas être payé ou de ne pas recevoir son colis. ZARÉN agit en intermédiaire neutre et sécurisé pour chaque transaction Mobile Money.
          </p>
        </div>

        {/* 3 Piliers du Séquestre */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 bg-[#161616] rounded-2xl border border-white/10 space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-[#008A45]/40 text-[#008A45] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-black italic text-lg text-white">1. Fonds Séquestrés</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              L'acheteur paie par Airtel Money, Moov Money, MTN ou Orange. L'argent est bloqué sur un compte de cantonnement sécurisé ZARÉN.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 bg-[#161616] rounded-2xl border border-white/10 space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-[#008A45]/40 text-[#008A45] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-black italic text-lg text-white">2. Expédition Sereine</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Le vendeur reçoit une notification certifiée garantissant que les fonds sont disponibles. Il expédie l'article sans aucun risque d'impayé.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 bg-[#161616] rounded-2xl border border-white/10 space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-[#008A45]/40 text-[#008A45] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-black italic text-lg text-white">3. Déblocage Immédiat</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Dès que l'acheteur valide la réception conforme, les fonds sont instantanément transférés sur le portefeuille Mobile Money du vendeur.
            </p>
          </motion.div>

        </div>

        {/* Protection Acheteur vs Protection Vendeur */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-lg font-black italic text-white flex items-center gap-2">
              <span className="text-[#008A45]">🛡️</span> Pour les Acheteurs
            </h3>
            <ul className="space-y-3 text-xs text-gray-300 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0 mt-0.5" />
                <span>Remboursement garanti à 100% si le colis n'est pas expédié ou s'avère non conforme à l'annonce.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0 mt-0.5" />
                <span>Délai d'inspection de 24h pour tester le produit avant confirmation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0 mt-0.5" />
                <span>Zéro frais supplémentaire pour l'acheteur lors du paiement en ligne.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-lg font-black italic text-white flex items-center gap-2">
              <span className="text-[#008A45]">🤝</span> Pour les Vendeurs
            </h3>
            <ul className="space-y-3 text-xs text-gray-300 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0 mt-0.5" />
                <span>Certitude mathématique que l'acheteur a payé avant de confier le colis au livreur.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0 mt-0.5" />
                <span>Protection contre les faux reçus de transfert Mobile Money et les annulations frauduleuses.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0 mt-0.5" />
                <span>Versement direct et automatique sans délai de retenue abusif.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
