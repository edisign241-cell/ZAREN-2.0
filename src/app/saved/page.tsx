'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Plus, Package, ArrowRight, Share2, ShieldCheck } from 'lucide-react';
import { zarenStore } from '@/db/store';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function SavedItemsPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'BOARDS'>('ALL');
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Par défaut, affiche les produits favoris
    setSavedProducts(zarenStore.getProducts());
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24 animate-fade-in">
      {/* ASOS Top Sub-header */}
      <div className="border-b border-slate-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <button className="text-slate-900">
            <Plus className="w-5 h-5" />
          </button>
          <h1 className="text-xs font-black uppercase tracking-widest text-slate-900">
            ARTICLES SAUVEGARDÉS
          </h1>
          <button className="text-xs font-bold text-slate-500 hover:text-slate-900">
            Modifier
          </button>
        </div>

        {/* Tabs ASOS : TOUS LES ARTICLES / TABLEAUX */}
        <div className="grid grid-cols-2 text-center text-xs font-black uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'ALL'
                ? 'border-slate-900 text-slate-900 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Tous les articles ({savedProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('BOARDS')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'BOARDS'
                ? 'border-slate-900 text-slate-900 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Collections ({savedProducts.length > 0 ? '1' : '0'})
          </button>
        </div>
      </div>

      {activeTab === 'ALL' ? (
        <div className="p-3">
          {savedProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-400 space-y-2">
              <Heart className="w-12 h-12 stroke-[1] mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-bold text-slate-700">Aucun article sauvegardé pour le moment</p>
              <p className="text-[11px] text-slate-400 mb-4">Cliquez sur le cœur pour ajouter un article à vos favoris.</p>
              <Link href="/#marche" className="inline-block py-2.5 px-6 rounded-full bg-[#008A45] text-white text-xs font-bold uppercase tracking-wider">
                Explorer Le Grand Marché
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {savedProducts.map((p) => (
                <div key={p.id} className="group relative flex flex-col bg-white p-2.5 rounded-2xl border border-gray-100 shadow-2xs">
                  {/* ASOS 3:4 Portrait Image */}
                  <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-2 rounded-xl">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-rose-500 shadow-sm">
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </button>
                  </div>

                  {/* ASOS Typography Info */}
                  <div className="flex items-baseline justify-between gap-1 mb-0.5">
                    <span className="text-xs font-black text-slate-900">{formatPrice(p.price)}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight font-medium mb-2">
                    {p.title}
                  </p>

                  <Link
                    href={`/p/${p.shortCode}`}
                    className="w-full py-2 bg-[#008A45] hover:bg-[#007339] text-white text-[10px] font-black uppercase tracking-wider text-center transition-colors rounded-xl shadow-xs"
                  >
                    Acheter (Séquestre)
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Collections Tab */
        <div className="p-3 space-y-4">
          {savedProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-400 space-y-2">
              <Package className="w-12 h-12 stroke-[1] mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-bold text-slate-700">Aucune collection créée</p>
              <p className="text-[11px] text-slate-400 mb-4">Vos articles sauvegardés seront organisés ici par catégorie.</p>
              <Link href="/#marche" className="inline-block py-2.5 px-6 rounded-full bg-[#008A45] text-white text-xs font-bold uppercase tracking-wider">
                Explorer Le Grand Marché
              </Link>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
              <div className="grid grid-cols-2 gap-1.5 aspect-[16/9] overflow-hidden rounded-xl mb-2 bg-gray-100">
                {savedProducts.slice(0, 2).map((p, idx) => (
                  <img key={idx} src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                ))}
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="uppercase text-slate-900 font-black">Articles Favoris</span>
                <span className="text-[10px] text-slate-400">{savedProducts.length} article(s)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
