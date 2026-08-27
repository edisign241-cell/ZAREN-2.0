'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Store,
  MapPin,
  Zap,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { zarenStore } from '@/db/store';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal } = useCart();
  const { isLoggedIn, currentUser, openLoginModal, openRegisterModal } = useAuth();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '+241 07 45 88 12');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.district ? `${currentUser.city}, ${currentUser.district}` : 'Libreville, Gabon');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (err) {}

      let createdOrder;
      if (cart.length > 0) {
        const firstItem = cart[0];
        createdOrder = zarenStore.createOrder({
          productId: firstItem.id,
          buyerName: currentUser?.name || 'Acheteur ZARÉN',
          buyerPhone: buyerPhone,
          city: currentUser?.city || 'Libreville',
          district: deliveryAddress,
          deliveryMode: 'SELLER_DELIVERY',
          buyerNotes: `Commande Panier (${cart.length} articles : ${cart.map(c => `${c.quantity}x ${c.title}`).join(', ')})`,
          quantity: firstItem.quantity,
          customPrice: cartTotal
        });
      }
      const targetId = createdOrder ? createdOrder.id : ('ord_' + Date.now());
      clearCart();
      setIsCheckoutModalOpen(false);
      router.push(`/orders/${targetId}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F8] relative overflow-hidden font-sans">
      <Navbar />

      {/* ARRIÈRE-PLAN ANIMÉ SPECTACULAIRE AVEC LOGO ZARÉN EN FOND */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Cercles de lueur radiale émeraude */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-400/10 via-[#008A45]/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />

        {/* Grand Logo ZARÉN en filigrane flottant et animé */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.035] flex flex-col items-center justify-center select-none scale-125 transition-transform">
          <img
            src="/logo.png"
            alt="ZARÉN Logo Watermark"
            className="w-96 h-96 object-contain animate-spin-slow"
            style={{ animationDuration: '60s' }}
          />
          <span className="font-black italic text-8xl tracking-widest text-emerald-950 mt-4">
            ZARÉN
          </span>
        </div>
      </div>

      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
        
        {/* En-tête de la page Panier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition shadow-2xs"
                title="Retour au Marché"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black italic text-[#111111] tracking-tight flex items-center gap-2">
                <span>Mon Panier Sécurisé</span>
                <span className="text-[#008A45] font-mono">({cartCount})</span>
              </h1>
            </div>
            <p className="text-xs text-gray-500 font-medium pl-10">
              Commandes protégées par le Tiers de Confiance et Séquestre Mobile Money ZARÉN
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#008A45] text-xs font-black border border-emerald-200/80 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#008A45]" />
              <span>SÉQUESTRE 100% GARANTI</span>
            </span>
          </div>
        </div>

        {/* CONTENU DU PANIER : SI ARTICLES OU VIDE */}
        {cart.length === 0 ? (
          /* PANIER VIDE ATTRACTIF AVEC ANIMATION DU LOGO */
          <div className="p-12 sm:p-16 bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200/90 shadow-lg text-center space-y-6 max-w-xl mx-auto my-8 relative overflow-hidden animate-scale-in">
            
            {/* Lueur d'ambiance centrale */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-transparent to-transparent pointer-events-none" />

            <div className="relative">
              {/* Badge animé avec Logo */}
              <div className="w-24 h-24 rounded-3xl bg-emerald-50 border-2 border-emerald-200/80 flex items-center justify-center mx-auto shadow-inner relative group">
                <img
                  src="/logo.png"
                  alt="ZARÉN"
                  className="w-14 h-14 object-contain animate-bounce"
                  style={{ animationDuration: '3s' }}
                />
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#008A45] text-white flex items-center justify-center text-xs font-black shadow-md">
                  0
                </span>
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <h2 className="text-xl sm:text-2xl font-black italic text-gray-900">
                Votre panier est vide pour le moment
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
                Explorez le Grand Marché ZARÉN et découvrez des milliers d'articles vérifiés par nos marchands. Tous vos achats sont protégés par séquestre jusqu'à la remise en main propre.
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <Link
                href="/#marche"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-700/20 transition active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explorer le Grand Marché ZARÉN →</span>
              </Link>
            </div>
          </div>
        ) : (
          /* PANIER AVEC ARTICLES */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne Gauche : Liste des Articles */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-xs divide-y divide-gray-100">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    {/* Détails Produit */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="relative w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0 shadow-2xs">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <Link
                          href={`/p/${item.shortCode}`}
                          className="text-sm font-black italic text-gray-900 line-clamp-1 hover:text-[#008A45] transition"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Store className="w-3.5 h-3.5 text-gray-400" />
                            <strong className="text-gray-700">{item.sellerName}</strong>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <MapPin className="w-3 h-3 text-[#008A45]" />
                            <span>{item.city}</span>
                          </span>
                        </div>
                        <div className="text-sm font-black text-[#008A45] font-mono">
                          {new Intl.NumberFormat('fr-FR').format(item.price)} FCFA
                        </div>
                      </div>
                    </div>

                    {/* Contrôleur Quantité & Suppression */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/80 p-1 shadow-inner">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
                          title="Diminuer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-black font-mono text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
                          title="Augmenter"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <span className="text-xs font-black text-gray-900 font-mono block">
                          {new Intl.NumberFormat('fr-FR').format(item.price * item.quantity)} FCFA
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Retirer du panier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Barre d'action Panier */}
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={clearCart}
                  className="text-gray-500 hover:text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  Vider tout le panier
                </button>

                <Link
                  href="/#marche"
                  className="text-[#008A45] font-black hover:underline inline-flex items-center gap-1"
                >
                  <span>Continuer mes achats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Carte Garantie Séquestre */}
              <div className="p-4 rounded-3xl bg-emerald-50/90 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#008A45]" />
                  <span>Comment fonctionne votre séquestre ZARÉN ?</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  1. Votre paiement Mobile Money est consigné sur un compte séquestre sécurisé.
                  <br />
                  2. Le vendeur reçoit la notification pour expédier ou vous remettre l'article.
                  <br />
                  3. Les fonds sont débloqués uniquement après votre confirmation de conformité.
                </p>
              </div>
            </div>

            {/* Colonne Droite : Récapitulatif de Commande */}
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200 p-6 shadow-md space-y-5 sticky top-24">
                <h3 className="text-base font-black italic text-gray-900 border-b border-gray-100 pb-3">
                  Récapitulatif de Commande
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Nombre d'articles</span>
                    <span className="font-bold font-mono text-gray-900">{cartCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Sous-total articles</span>
                    <span className="font-bold font-mono text-gray-900">
                      {new Intl.NumberFormat('fr-FR').format(cartTotal)} FCFA
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Lock className="w-3 h-3 text-[#008A45]" />
                      <span>Protection Séquestre Mobile Money</span>
                    </span>
                    <span className="text-[#008A45] font-black uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      OFFERT (0 FCFA)
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between">
                    <span className="text-sm font-black italic text-gray-900">Total à payer</span>
                    <div className="text-right">
                      <span className="text-xl font-black italic text-[#008A45] font-mono">
                        {new Intl.NumberFormat('fr-FR').format(cartTotal)}
                      </span>
                      <span className="text-xs font-black text-[#008A45] ml-1">FCFA</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-4 px-4 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition active:scale-98 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Commander sous Séquestre →</span>
                </button>

                <div className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-2">
                  <span>Airtel Money</span>
                  <span>•</span>
                  <span>Moov Money</span>
                  <span>•</span>
                  <span>Orange / MTN</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODALE VALIDATION COMMANDE PANIER SÉQUESTRÉE */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#008A45] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black italic text-gray-900">
                  Validation du Séquestre ZARÉN
                </h3>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
              <span className="text-emerald-900 font-bold">Total à consigner :</span>
              <span className="text-base font-black italic text-[#008A45] font-mono">
                {new Intl.NumberFormat('fr-FR').format(cartTotal)} FCFA
              </span>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Numéro Mobile Money pour le débit *
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+241 07 XX XX XX"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold font-mono focus:border-[#008A45] outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Ville & Quartier de livraison *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Ex : Libreville, Batterie IV..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#008A45] outline-hidden"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1">
                🔒 <strong>Garantie Anti-Arnaque :</strong> Vous recevrez une invitation de paiement USSD sur votre téléphone. L'argent restera bloqué sous séquestre jusqu'à votre feu vert.
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Consignation du séquestre en cours...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Payer {new Intl.NumberFormat('fr-FR').format(cartTotal)} FCFA sous Séquestre →</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
