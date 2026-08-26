'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Star,
  MapPin,
  Truck,
  Package,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Tag,
  Handshake,
  ShoppingCart
} from 'lucide-react';
import { zarenStore } from '@/db/store';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import ProductGallery from '@/components/product/ProductGallery';
import ShareButton from '@/components/product/ShareButton';
import MakeOfferModal from '@/components/product/MakeOfferModal';
import BuyerFastOnboardingModal from '@/components/auth/BuyerFastOnboardingModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function ProductViewPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const shortCode = params.code as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState(zarenStore.getReviews());
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isBuyerModalOpen, setIsBuyerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      shortCode: product.shortCode,
      title: product.title,
      price: product.price,
      image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      sellerName: product.seller?.businessName || product.seller?.name || 'Vendeur ZARÉN',
      city: product.city,
      district: product.district
    });
    setToastMessage('🛒 Article ajouté à votre panier !');
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (shortCode) {
      const prod = zarenStore.getProductByCode(shortCode);
      if (prod) {
        setProduct(prod);
        zarenStore.incrementViews(prod.id);
      }
    }
  }, [shortCode]);

  if (!product) {
    return (
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center font-sans">
        <Package className="w-12 h-12 text-slate-300 mb-3" />
        <h2 className="text-base font-bold text-slate-800">Article introuvable</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Ce lien est invalide ou l'article a été retiré de la vente.
        </p>
        <Link
          href="/"
          className="py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const seller = product.seller || zarenStore.getSellerProfile();

  return (
    <div className="pb-28 animate-fade-in font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-[#111827] text-white text-xs font-bold rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-2 animate-slide-up">
          <Sparkles className="w-4 h-4 text-[#008A45]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Escrow Safety Badge */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Achat Garanti par Séquestre Zarén</span>
        </div>
        <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-semibold">
          Protection 48h
        </span>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Navigation retour */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
          >
            ← Retour au flux
          </Link>
          <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            RÉF: {product.shortCode}
          </span>
        </div>

        {/* Galerie Photos Swipe */}
        <ProductGallery images={product.images} title={product.title} />

        {/* Fiche Info Produit (Style Vinted) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              Prix Fixe • Séquestre
            </span>
          </div>

          <h1 className="text-base font-bold text-slate-900 leading-snug">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {product.city} {product.district ? `(${product.district})` : ''}
            </span>
          </div>
        </div>

        {/* Détails & Description */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Description de l'article
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>

          <div className="pt-2 grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Catégorie</span>
              <span className="font-semibold text-slate-800">{product.category}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">État de l'article</span>
              <span className="font-semibold text-slate-800">{product.condition || 'Très bon état'}</span>
            </div>
          </div>
        </div>

        {/* Profil Vendeur & Réputation */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-emerald-500 shadow-xs">
                <img
                  src={seller.logoUrl || seller.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={seller.businessName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span>{seller.businessName}</span>
                  {seller.isVerified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] font-black">
                      ✓
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{seller.ratingAvg || 4.9}</span>
                  <span className="text-slate-400 text-[10px]">
                    ({seller.ratingCount || 12} avis)
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/profile/${product.sellerId || 'seller'}`}
              className="text-xs text-emerald-600 font-bold hover:underline"
            >
              Voir dressing →
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Répond sous 15 min
            </span>
            <span className="font-semibold text-emerald-700">
              {seller.completedSalesCount || 24} ventes réussies
            </span>
          </div>
        </div>

        {/* Section Avis Clients */}
        {reviews.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Avis Clients ({reviews.length})
              </h2>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.9 / 5</span>
              </span>
            </div>
            <div className="space-y-2.5">
              {reviews.slice(0, 3).map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{rev.authorName}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-[11px]">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Boutons Partage Viral */}
        <ShareButton product={product} />

      </div>

      {/* Barre d'Action Inférieure Sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-2">
          {/* Chat Interne */}
          <Link
            href="/messages"
            className="h-12 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex flex-col items-center justify-center text-[10px] font-semibold transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Chat</span>
          </Link>

          {/* Bouton Ajouter au Panier */}
          <button
            onClick={handleAddToCart}
            className="h-12 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 flex flex-col items-center justify-center text-[10px] font-bold transition-colors shrink-0 cursor-pointer border border-gray-200"
            title="Ajouter au panier"
          >
            <ShoppingCart className="w-4 h-4 text-[#008A45]" />
            <span>Panier</span>
          </button>

          {/* Bouton Faire une Offre */}
          <button
            onClick={() => setIsOfferModalOpen(true)}
            className="h-12 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 flex flex-col items-center justify-center text-[10px] font-bold transition-colors shrink-0 cursor-pointer"
          >
            <Handshake className="w-4 h-4 text-amber-600" />
            <span>Offre</span>
          </button>

          {/* Bouton Achat Direct Séquestre */}
          {isLoggedIn ? (
            <Link
              href={`/checkout/${product.id}`}
              className="flex-1 h-12 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-between px-3.5 transition-all"
            >
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>Acheter</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black">{formatPrice(product.price)}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ) : (
            <button
              onClick={() => setIsBuyerModalOpen(true)}
              className="flex-1 h-12 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-between px-3.5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>Commander</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black">{formatPrice(product.price)}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Modale Faire une Offre */}
      <MakeOfferModal
        product={product}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
      />

      {/* Modale Onboarding Rapide Acheteur Invité */}
      <BuyerFastOnboardingModal
        isOpen={isBuyerModalOpen}
        onClose={() => setIsBuyerModalOpen(false)}
        product={product}
        redirectTo={`/checkout/${product.id}`}
      />

    </div>
  );
}
