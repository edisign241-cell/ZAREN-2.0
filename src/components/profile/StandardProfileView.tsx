'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  PlusCircle,
  Settings,
  ShoppingBag,
  Package,
  Wallet,
  ArrowRight,
  Sparkles,
  MessageCircle,
  MapPin,
  ChevronRight,
  ExternalLink,
  Tag,
  CheckCircle2,
  Lock,
  DollarSign
} from 'lucide-react';
import { Review, Product, Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface StandardProfileViewProps {
  user: {
    id: string;
    name: string;
    username?: string;
    avatar: string;
    city: string;
    district?: string;
    ratingAvg: number;
    ratingCount: number;
    completedSalesCount?: number;
    escrowBalance?: number;
  };
  products: Product[];
  reviews: Review[];
  orders: Order[];
  isOwner?: boolean;
}

export default function StandardProfileView({
  user,
  products,
  reviews,
  orders,
  isOwner = true
}: StandardProfileViewProps) {
  const { upgradeToPro } = useAuth();
  const [activeTab, setActiveTab] = useState<'DRESSING' | 'REVIEWS' | 'SALES' | 'PURCHASES'>('DRESSING');
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // État des articles du dressing
  const dressingProducts = products.map((p, idx) => ({
    ...p,
    condition: p.condition || (idx % 3 === 0 ? 'Neuf avec étiquette' : idx % 2 === 0 ? 'Très bon état' : 'Bon état'),
    size: p.size || (idx % 2 === 0 ? 'Taille M' : 'Taille L')
  }));

  const salesOrders = orders.filter(o => o.sellerId === user.id || isOwner);
  const purchaseOrders = orders.filter(o => o.buyerId === user.id);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutSuccess(false);
      setIsPayoutModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#111111] pb-24 font-sans">
      
      {/* 1. EN-TÊTE ÉPURÉ STYLE VINTED (MOBILE-FIRST) */}
      <div className="bg-white border-b border-[#E5E5E5] px-4 pt-6 pb-5 shadow-2xs">
        <div className="max-w-xl mx-auto space-y-4">
          
          {/* Avatar & Infos utilisateur */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#008A45] shadow-xs bg-gray-100 shrink-0">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-base sm:text-lg font-black italic text-[#111111] truncate">
                    {user.name}
                  </h1>
                </div>

                <p className="text-xs font-mono text-gray-500 font-semibold">
                  {user.username || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`}
                </p>

                <div className="flex items-center gap-1 text-[11px] text-gray-600 font-medium">
                  <MapPin className="w-3 h-3 text-[#008A45]" />
                  <span>{user.city} • {user.district || 'Centre'}</span>
                </div>
              </div>
            </div>

            {/* Note & Étoiles Vinted */}
            <div className="text-right shrink-0">
              <div className="flex items-center justify-end gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-gray-900 font-mono font-black">{user.ratingAvg || 4.9}</span>
                <span className="text-gray-400 text-xs font-normal">/5</span>
              </div>
              <button
                onClick={() => setActiveTab('REVIEWS')}
                className="text-[11px] text-[#008A45] hover:underline font-bold block mt-0.5 cursor-pointer"
              >
                ({user.ratingCount || reviews.length || 12} avis)
              </button>
            </div>
          </div>

          {/* Badge Formule Vendeur Standard */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-gray-700 border border-gray-200">
              <Tag className="w-3 h-3 text-gray-500" />
              <span>Formule Vendeur Standard (500 FCFA / acte)</span>
            </span>

            <span className="text-[11px] text-[#008A45] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Séquestre Garanti
            </span>
          </div>

          {/* ACTIONS RAPIDES (MOBILE-FIRST) */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <Link
              href="/seller/new"
              className="py-3 px-3 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition text-center"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Vendre un article</span>
            </Link>

            <Link
              href="/profile/settings"
              className="py-3 px-3 rounded-2xl bg-white hover:bg-neutral-50 text-[#111111] border border-[#E5E5E5] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition text-center"
            >
              <Settings className="w-4 h-4 text-gray-600" />
              <span>Modifier le profil</span>
            </Link>
          </div>

        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        
        {/* 2. BANNIÈRE DISCRÈTE "PASSER EN PRO" */}
        <div className="p-3.5 rounded-2xl bg-linear-to-r from-neutral-900 to-neutral-800 text-white flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black italic text-white">Envie de booster vos ventes ?</h4>
              <p className="text-[10px] text-gray-300">Passez au Pass Pro (4 500 FCFA/mois) : 0% commission & illimité.</p>
            </div>
          </div>

          <button
            onClick={() => {
              upgradeToPro();
              alert('⭐ Félicitations ! Votre compte a été basculé en Vendeur Pro (Pass Pro 4 500 FCFA).');
            }}
            className="px-3 py-1.5 bg-[#008A45] hover:bg-[#007339] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl shrink-0 transition active:scale-95 shadow-xs cursor-pointer"
          >
            Activer
          </button>
        </div>

        {/* 3. CARTE SOLDE SÉQUESTRE & RETRAIT RAPIDE */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">
              Solde disponible (Séquestre ZARÉN)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black italic text-[#111111] font-mono">
                {new Intl.NumberFormat('fr-FR').format(user.escrowBalance || 482000)}
              </span>
              <span className="text-xs font-bold text-[#008A45]">FCFA</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              ✓ Garanti & déblocable 24/7 sur Airtel/Moov Money
            </span>
          </div>

          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="py-2.5 px-3.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer shrink-0"
          >
            <Wallet className="w-3.5 h-3.5 text-[#008A45]" />
            <span>Retirer</span>
          </button>
        </div>

        {/* 4. ONGLETS DE NAVIGATION SIMPLE */}
        <div className="bg-white rounded-2xl p-1 border border-[#E5E5E5] grid grid-cols-4 gap-1 text-center shadow-2xs">
          <button
            onClick={() => setActiveTab('DRESSING')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'DRESSING' ? 'bg-[#111827] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Dressing ({dressingProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('SALES')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'SALES' ? 'bg-[#111827] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Mes Ventes
          </button>

          <button
            onClick={() => setActiveTab('PURCHASES')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'PURCHASES' ? 'bg-[#111827] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Mes Achats
          </button>

          <button
            onClick={() => setActiveTab('REVIEWS')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'REVIEWS' ? 'bg-[#111827] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Avis ({reviews.length})
          </button>
        </div>

        {/* 5. CONTENU SELON L'ONGLET */}
        
        {/* ONGLET 1 : DRESSING / ARTICLES EN VENTE (GRILLE 2 COLONNES STYLE VINTED) */}
        {activeTab === 'DRESSING' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-bold px-1">
              <span className="text-gray-600">Articles en vente dans le dressing</span>
              <span className="text-[#008A45] font-mono">500 FCFA / publication</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {dressingProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] shadow-2xs flex flex-col justify-between group hover:border-gray-400 transition"
                >
                  <Link href={`/p/${prod.shortCode}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={prod.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80'}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold">
                      {prod.condition}
                    </div>
                  </Link>

                  <div className="p-3 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black italic text-[#111111] font-mono">
                        {formatPrice(prod.price)}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {prod.size}
                      </span>
                    </div>

                    <Link href={`/p/${prod.shortCode}`} className="block">
                      <h3 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-[#008A45] transition">
                        {prod.title}
                      </h3>
                    </Link>

                    <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px]">
                      <span className="text-gray-500">{prod.city}</span>
                      <Link
                        href={`/p/${prod.shortCode}`}
                        className="text-[#008A45] font-black hover:underline"
                      >
                        Voir →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton Ajouter un article dans le dressing */}
            <div className="pt-2">
              <Link
                href="/seller/new"
                className="w-full py-3.5 bg-white border-2 border-dashed border-gray-300 hover:border-[#008A45] text-gray-700 hover:text-[#008A45] text-xs font-bold uppercase rounded-2xl flex items-center justify-center gap-2 transition text-center shadow-2xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Ajouter une pièce à mon dressing (500 FCFA)</span>
              </Link>
            </div>
          </div>
        )}

        {/* ONGLET 2 : MES VENTES */}
        {activeTab === 'SALES' && (
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-xs font-black uppercase text-gray-600 px-1">Historique de mes ventes</h3>
            {salesOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#E5E5E5] text-center space-y-2">
                <Package className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500 font-medium">Aucune vente enregistrée pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {salesOrders.map((ord) => (
                  <div key={ord.id} className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 font-mono">#{ord.orderNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-[#008A45] border border-emerald-200">
                        {ord.status === 'COMPLETED' ? 'LIVRÉ & PAYÉ' : ord.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate max-w-[200px]">{ord.product?.title || 'Commande ZARÉN'}</span>
                      <span className="font-mono font-bold text-gray-900">{formatPrice(ord.totalAmount)}</span>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">Paiement sous séquestre</span>
                      <Link href={`/orders/${ord.id}`} className="text-[#008A45] font-bold hover:underline">
                        Détails de la commande →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ONGLET 3 : MES ACHATS */}
        {activeTab === 'PURCHASES' && (
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-xs font-black uppercase text-gray-600 px-1">Mes commandes et achats personnels</h3>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#008A45] flex items-center justify-center font-bold text-xs">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Robe de Soirée Satin Émeraude</h4>
                    <span className="text-[10px] text-gray-400">Boutique Marlène • 45 000 FCFA</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#008A45] text-[10px] font-bold">
                  Colis Reçu
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                Paiement libéré avec succès après inspection physique sous séquestre.
              </p>
            </div>
          </div>
        )}

        {/* ONGLET 4 : AVIS CLIENTS REÇUS */}
        {activeTab === 'REVIEWS' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase text-gray-600">Avis reçus sur mes ventes ({reviews.length})</h3>
              <span className="text-[11px] text-[#008A45] font-bold">100% vérifiés</span>
            </div>

            <div className="space-y-2.5">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[11px] text-gray-700">
                        {rev.authorName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{rev.authorName}</h4>
                        <span className="text-[10px] text-gray-400">Achat sous séquestre</span>
                      </div>
                    </div>
                    <span className="text-amber-500 font-bold text-xs">★★★★★</span>
                  </div>

                  <p className="text-xs text-gray-700 italic leading-relaxed">
                    « {rev.comment || 'Vendeur rapide et produit conforme.'} »
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODALE RETRAIT MOBILE MONEY */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#E5E5E5] space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#008A45]" />
                <h3 className="font-black italic text-sm text-[#111111]">Demande de Retrait Mobile Money</h3>
              </div>
              <button onClick={() => setIsPayoutModalOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold">
                ✕
              </button>
            </div>

            {payoutSuccess ? (
              <div className="p-4 bg-emerald-50 text-[#008A45] rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <h4 className="text-xs font-bold">Retrait de 482 000 FCFA validé !</h4>
                <p className="text-[10px] text-emerald-800">Les fonds ont été transférés sur votre compte Airtel Money.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Montant à retirer (FCFA)</label>
                  <input
                    type="text"
                    defaultValue="482000"
                    className="w-full text-sm font-mono font-bold p-3 bg-gray-50 border border-[#E5E5E5] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Opérateur de réception</label>
                  <select className="w-full text-xs font-bold p-3 bg-gray-50 border border-[#E5E5E5] rounded-xl">
                    <option>🇬🇦 Airtel Money (+241 07 45 88 12)</option>
                    <option>🇬🇦 Moov Money (+241 06 23 34 45)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-xl shadow-md transition cursor-pointer"
                >
                  Confirmer le déblocage immédiat
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
