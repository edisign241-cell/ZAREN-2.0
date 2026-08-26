'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Award,
  CheckCircle2,
  Package,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  ThumbsUp,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Sparkles,
  Phone,
  Store,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import { Review, Product, Order, SellerProfile } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProProfileViewProps {
  seller: SellerProfile;
  products: Product[];
  reviews: Review[];
  orders: Order[];
  isOwner?: boolean;
}

export default function ProProfileView({
  seller,
  products,
  reviews,
  orders,
  isOwner = true
}: ProProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'REVIEWS' | 'PRODUCTS' | 'TRANSACTIONS'>('REVIEWS');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);

  const avgRating = localReviews.length > 0 
    ? (localReviews.reduce((acc, r) => acc + r.rating, 0) / localReviews.length).toFixed(1)
    : '4.9';

  const fiveStarCount = localReviews.filter(r => r.rating === 5).length;
  const fourStarCount = localReviews.filter(r => r.rating === 4).length;
  const threeStarCount = localReviews.filter(r => r.rating === 3).length;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: Review = {
      id: `rev_${Date.now()}`,
      authorId: 'usr_buyer_guest',
      authorName: 'Client Vérifié',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      targetSellerId: seller.id,
      rating: newRating,
      comment: newComment,
      productTitle: 'Achat sur Le Grand Marché ZARÉN',
      verifiedPurchase: true,
      createdAt: new Date().toISOString()
    };

    setLocalReviews([added, ...localReviews]);
    setNewComment('');
    setIsAddingReview(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 animate-fade-in font-sans">
      
      {/* BANNIÈRE HD & PROFIL MARCHAND PRO */}
      <div className="relative">
        <div className="h-48 sm:h-64 w-full bg-neutral-900 overflow-hidden relative">
          <img
            src={seller.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'}
            alt="Bannière profil"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Info Carte Profil Marchand Pro */}
        <div className="max-w-5xl mx-auto px-4 -mt-16 sm:-mt-20 relative z-10">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative">
                <img
                  src={seller.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={seller.businessName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                />
                <div className="absolute -bottom-2 -right-2 p-1 rounded-lg bg-[#008A45] text-white shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-black italic text-gray-900">
                    {seller.businessName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black italic bg-emerald-100 text-[#008A45] border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    <span>VENDEUR VÉRIFIÉ ZARÉN</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black italic bg-amber-100 text-amber-800 border border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>PASS PRO ACTIF</span>
                  </span>
                </div>

                <p className="text-xs text-gray-600 font-medium">
                  {seller.bio || 'Vêtements chics importés & Accessoires Apple d\'origine certifiée.'}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 flex-wrap font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#008A45]" />
                    {seller.address || `${seller.city || 'Libreville'}, Quartier Louis`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    Membre certifié depuis 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Rapides Pro */}
            <div className="flex items-center gap-2.5 sm:self-end md:self-center flex-wrap">
              {isOwner ? (
                <>
                  <Link
                    href="/seller/new"
                    className="px-4 py-2.5 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Vendre un article</span>
                  </Link>

                  <Link
                    href="/profile/settings"
                    className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#111111] text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer border border-gray-200"
                  >
                    <span>Modifier la vitrine</span>
                  </Link>

                  <Link
                    href="/seller/dashboard"
                    className="px-3.5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-[#008A45]" />
                    <span>Tableau de bord</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/messages"
                    className="px-4 py-2.5 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Envoyer un message</span>
                  </Link>
                  <a
                    href={`https://wa.me/${(seller.whatsapp || seller.payoutAccountNumber || '24107000000').replace(/\D/g, '')}?text=Bonjour%20${encodeURIComponent(seller.businessName)}%2C%20je%20vous%20contacte%20depuis%20votre%20profil%20ZAR%C3%89N.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* STATS DE RÉPUTATION & SCORE SÉQUESTRE */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Note Globale */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Note moyenne globale
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black italic text-gray-900 font-mono">{avgRating}</span>
              <span className="text-xs text-gray-400 font-bold">/ 5</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-[10px] text-gray-500 font-bold ml-1">({localReviews.length} avis)</span>
            </div>
          </div>

          {/* Ventes Réussies */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Transactions sous séquestre
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-black italic text-[#008A45] font-mono">
                {seller.completedSalesCount || 0}
              </span>
              <span className="text-xs text-gray-500 font-bold">ventes</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">
              ✓ 100% de conformité après livraison
            </span>
          </div>

          {/* Taux de litige */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Taux de litige
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-black italic text-gray-900 font-mono">
                {seller.disputeRatePercent || 0}%
              </span>
              <span className="text-xs text-gray-400 font-bold">très faible</span>
            </div>
            <span className="text-[10px] text-gray-500 font-bold">
              Garantie Séquestre SupportResolver
            </span>
          </div>

          {/* Rapidité expédition */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Délai moyen d'expédition
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black italic text-gray-900 font-mono">
                {seller.responseTimeMinutes ? `${seller.responseTimeMinutes} min` : '< 1h'}
              </span>
            </div>
            <span className="text-[10px] text-[#008A45] font-bold">
              ⚡ Expédition rapide
            </span>
          </div>

        </div>
      </div>

      {/* ONGLETS & CONTENU DU PROFIL MARCHAND */}
      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Navigation Onglets */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('REVIEWS')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'REVIEWS'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Avis & Évaluations Clients ({localReviews.length})
          </button>

          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'PRODUCTS'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Catalogue Produits en Vente ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('TRANSACTIONS')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'TRANSACTIONS'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Historique Séquestre Réussi ({orders.length})
          </button>
        </div>

        {/* CONTENU ONGLET 1 : AVIS & COMMENTAIRES VÉRIFIÉS */}
        {activeTab === 'REVIEWS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Colonne Gauche : Répartition des Étoiles */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 h-fit">
              <h3 className="text-xs font-black italic uppercase tracking-wider text-gray-900">
                Répartition des avis
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-12 font-bold text-gray-600">5 étoiles</span>
                  <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${(fiveStarCount / (localReviews.length || 1)) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right font-mono text-gray-500 font-bold">{fiveStarCount}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="w-12 font-bold text-gray-600">4 étoiles</span>
                  <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${(fourStarCount / (localReviews.length || 1)) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right font-mono text-gray-500 font-bold">{fourStarCount}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="w-12 font-bold text-gray-600">3 étoiles</span>
                  <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${(threeStarCount / (localReviews.length || 1)) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right font-mono text-gray-500 font-bold">{threeStarCount}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-1.5 text-[#008A45] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Avis 100% Authentiques ZARÉN</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Seuls les acheteurs ayant finalisé et validé une commande sous séquestre peuvent noter le vendeur.
                </p>
              </div>

              <button
                onClick={() => setIsAddingReview(!isAddingReview)}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                {isAddingReview ? 'Annuler' : 'Laisser un avis vérifié'}
              </button>
            </div>

            {/* Colonne Droite : Liste des Avis & Formulaire */}
            <div className="md:col-span-2 space-y-4">
              
              {/* Formulaire d'Avis */}
              {isAddingReview && (
                <form onSubmit={handleAddReview} className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-sm space-y-3 animate-scale-in">
                  <h4 className="text-xs font-bold text-gray-900 uppercase">Votre avis d'acheteur sous séquestre</h4>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 font-bold">Note :</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewRating(s)}
                          className="p-1 text-amber-400 cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${s <= newRating ? 'fill-amber-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Décrivez la rapidité d'envoi, l'état du produit et votre expérience..."
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-hidden focus:border-[#008A45]"
                  />

                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs cursor-pointer"
                  >
                    Publier l'avis certifié
                  </button>
                </form>
              )}

              {/* Liste des Avis */}
              <div className="space-y-3">
                {localReviews.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-2">
                    <Star className="w-8 h-8 text-gray-300 mx-auto" />
                    <h4 className="text-xs font-bold text-gray-800">Aucun avis pour l'instant</h4>
                    <p className="text-[11px] text-gray-500">Les évaluations certifiées des acheteurs apparaîtront ici.</p>
                  </div>
                ) : (
                  localReviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                            alt={rev.authorName}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{rev.authorName}</h4>
                            <span className="text-[10px] text-gray-400">Achat sous séquestre</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      {rev.productTitle && (
                        <div className="text-[11px] font-semibold text-gray-800 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 inline-block">
                          Article : {rev.productTitle}
                        </div>
                      )}

                      <p className="text-xs text-gray-700 leading-relaxed font-medium">
                        « {rev.comment || 'Produit parfait, vendeur exemplaire.'} »
                      </p>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                        <span className="inline-flex items-center gap-1 text-[#008A45] font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" /> Séquestre Garanti ZARÉN
                        </span>
                        <span>Libreville, Gabon</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        )}

        {/* CONTENU ONGLET 2 : CATALOGUE PRODUITS PRO */}
        {activeTab === 'PRODUCTS' && (
          <div>
            {products.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
                <Store className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-800">Aucun produit dans la boutique</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  En tant que Vendeur Pro, publiez un nombre illimité d'articles avec vitrine personnalisée sans frais unitaires.
                </p>
                {isOwner && (
                  <Link
                    href="/seller/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Ajouter un produit</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-2xs flex flex-col justify-between group hover:border-[#008A45] transition"
                  >
                    <Link href={`/p/${prod.shortCode}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80'}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase">
                        Disponible
                      </div>
                    </Link>

                    <div className="p-3.5 space-y-2">
                      <h3 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-[#008A45] transition">
                        {prod.title}
                      </h3>

                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-sm font-black italic text-[#111111] font-mono">
                          {formatPrice(prod.price)}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold">{prod.city}</span>
                      </div>

                      <Link
                        href={`/p/${prod.shortCode}`}
                        className="w-full py-2 bg-neutral-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 transition"
                      >
                        <span>Commander</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONTENU ONGLET 3 : HISTORIQUE SÉQUESTRE RÉUSSI */}
        {activeTab === 'TRANSACTIONS' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-xs font-black italic uppercase tracking-wider text-gray-900">
              Transactions & Ventes Séquestre Clôturées avec Succès
            </h3>

            {orders.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <ShieldCheck className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500 font-medium">Aucune transaction clôturée pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#008A45] flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Commande #{ord.orderNumber}</h4>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {ord.product?.title || 'Article ZARÉN'} • Livré à {ord.deliveryAddress.city}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-gray-900 font-mono block">
                        {formatPrice(ord.totalAmount)}
                      </span>
                      <span className="text-[10px] text-[#008A45] font-bold">Séquestre Débloqué</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
