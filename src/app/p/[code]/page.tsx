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
  Handshake
} from 'lucide-react';
import { zarenStore } from '@/db/store';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import ProductGallery from '@/components/product/ProductGallery';
import ShareButton from '@/components/product/ShareButton';
import MakeOfferModal from '@/components/product/MakeOfferModal';

export default function ProductViewPage() {
  const params = useParams();
  const router = useRouter();
  const shortCode = params.code as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState(zarenStore.getReviews());
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

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
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
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
    <div className="pb-28 animate-fade-in">
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

      {/* Gallery */}
      <div className="relative">
        <ProductGallery images={product.images} title={product.title} />
        <div className="absolute top-3 right-3 z-20">
          <ShareButton product={product} />
        </div>
      </div>

      {/* Main Info */}
      <div className="p-4 bg-white">
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <h1 className="text-lg font-black text-slate-900 leading-tight flex-1">
            {product.title}
          </h1>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-black text-emerald-700">
            {formatPrice(product.price)}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            (Paiement bloqué jusqu'à livraison)
          </span>
        </div>

        {/* Bouton Proposer une Offre */}
        <div className="mb-4">
          <button
            onClick={() => setIsOfferModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Handshake className="w-4 h-4 text-amber-600" />
            <span>🤝 Faire une offre de prix au vendeur</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">{product.city}, {product.district || 'Centre'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>En stock ({product.stockQuantity})</span>
          </div>
        </div>

        {/* Seller Card (Clic = Profil Vendeur & Avis) */}
        <Link
          href={`/profile/${product.sellerId || 'usr_seller_1'}`}
          className="block p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 mb-5 transition group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img
              src={seller.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={seller.businessName}
              className="w-11 h-11 rounded-full object-cover border border-slate-200"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {seller.businessName}
                  </h3>
                  {seller.isVerified && (
                    <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full font-bold">
                      ✓ Vérifié
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600">
                  Voir profil & avis →
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {seller.ratingAvg || 4.9}
                </span>
                <span>•</span>
                <span>{seller.totalSalesCount || 230} ventes</span>
                <span>•</span>
                <span className="text-slate-600 flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  ~{seller.responseTimeMinutes || 15} min
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Description */}
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Description de l'article
          </h2>
          <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 font-sans">
            {product.description}
          </div>
        </div>

        {/* Delivery Options */}
        <div className="mb-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
          <h2 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-slate-600" />
            <span>Options de livraison disponibles</span>
          </h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span>• Livraison à domicile ({product.city})</span>
              <span className="font-bold">{formatPrice(product.deliveryFee)}</span>
            </div>
            {product.pickupAvailable && (
              <div className="flex items-center justify-between text-slate-700">
                <span>• Retrait en mains propres chez le vendeur</span>
                <span className="font-bold text-emerald-600">Gratuit</span>
              </div>
            )}
          </div>
        </div>

        {/* How Escrow Works */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-emerald-900">Comment fonctionne la garantie ?</h3>
          </div>
          <ol className="text-[11px] text-emerald-800 space-y-1.5 pl-2 list-decimal list-inside">
            <li>Vous commandez et payez par Mobile Money (Wave, Orange, MTN, Airtel, Moov).</li>
            <li><strong>L'argent est conservé sous séquestre par Zarén.</strong></li>
            <li>Le vendeur vous livre l'article.</li>
            <li>Vous vérifiez le colis et validez : <strong>le vendeur est alors payé</strong>.</li>
          </ol>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Avis clients récents ({reviews.length})
              </h2>
              <Link
                href={`/profile/${product.sellerId || 'usr_seller_1'}`}
                className="text-xs font-bold text-[#008A45] hover:underline"
              >
                Tous les avis →
              </Link>
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
      </div>

      {/* Sticky Bottom Buy Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-2">
          
          {/* Bouton Chat Messagerie Interne */}
          <Link
            href="/messages"
            className="h-12 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex flex-col items-center justify-center text-[10px] font-semibold transition-colors shrink-0"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>Chat</span>
          </Link>

          {/* Bouton Faire une Offre */}
          <button
            onClick={() => setIsOfferModalOpen(true)}
            className="h-12 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 flex flex-col items-center justify-center text-[10px] font-bold transition-colors shrink-0 cursor-pointer"
          >
            <Handshake className="w-5 h-5 text-amber-600" />
            <span>Offre</span>
          </button>

          {/* Bouton Achat Direct Séquestre */}
          <Link
            href={`/checkout/${product.id}`}
            className="flex-1 h-12 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-between px-3.5 transition-all"
          >
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Acheter Sécurisé</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-black">{formatPrice(product.price)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* Modale Faire une Offre */}
      <MakeOfferModal
        product={product}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
      />

    </div>
  );
}

