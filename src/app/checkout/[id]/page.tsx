'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowLeft,
  Truck,
  Building,
  User,
  Phone,
  MapPin,
  Lock,
  CheckCircle2,
  AlertCircle,
  Handshake,
  Tag
} from 'lucide-react';
import { zarenStore } from '@/db/store';
import { Product, PaymentGateway, DeliveryMode } from '@/types';
import { formatPrice } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = params.id as string;
  const offerPriceParam = searchParams.get('offerPrice');
  const offerPrice = offerPriceParam ? Number(offerPriceParam) : undefined;

  const [product, setProduct] = useState<Product | null>(null);
  const [buyerName, setBuyerName] = useState('Patrick Nguema');
  const [buyerPhone, setBuyerPhone] = useState('+241 06 23 34 45');
  const [city, setCity] = useState('Libreville');
  const [district, setDistrict] = useState('Quartier Louis');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('SELLER_DELIVERY');
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('AIRTEL_MONEY');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (productId) {
      const prod = zarenStore.getProductById(productId);
      if (prod) {
        setProduct(prod);
        setCity(prod.city);
        if (prod.district) setDistrict(prod.district);
      }
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="font-bold text-sm text-slate-800">Chargement du produit...</h2>
      </div>
    );
  }

  const unitPrice = offerPrice || product.price;
  const deliveryFee = deliveryMode === 'PICKUP' ? 0 : product.deliveryFee;
  const totalAmount = unitPrice + deliveryFee;

  const handlePay = () => {
    if (!buyerName.trim() || !buyerPhone.trim() || !district.trim()) {
      alert('Veuillez remplir toutes vos coordonnées.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const order = zarenStore.createOrder({
          productId: product.id,
          buyerName,
          buyerPhone,
          city,
          district,
          deliveryMode,
          buyerNotes,
          quantity: 1,
          customPrice: offerPrice
        });

        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.5 }
          });
        } catch (e) {}

        router.push(`/orders/${order.id}`);
      } catch (err) {
        alert('Erreur lors du paiement.');
        setIsProcessing(false);
      }
    }, 1200);
  };

  return (
    <div className="p-4 pb-28 animate-fade-in max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href={`/p/${product.shortCode}`}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-black text-slate-900 text-base">Finaliser ma commande sous Séquestre</h1>
      </div>

      {/* Bannière Prix Négocié si applicable */}
      {offerPrice && (
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 mb-4 flex items-center gap-3">
          <Handshake className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs">
            <span className="font-black text-amber-900 block">Offre négociée et acceptée !</span>
            <span className="text-amber-700">
              Le prix unitaire est ajusté à <strong>{formatPrice(offerPrice)}</strong> (au lieu de {formatPrice(product.price)}).
            </span>
          </div>
        </div>
      )}

      {/* Item Summary Card */}
      <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
          alt={product.title}
          className="w-16 h-16 rounded-xl object-cover border border-slate-200"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-bold text-slate-900 truncate">{product.title}</h2>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-base font-black text-[#008A45] font-mono">
              {formatPrice(unitPrice)}
            </span>
            {offerPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500">Vendu par {product.seller?.businessName || 'iStore Libreville'}</span>
        </div>
      </div>

      {/* 1. Coordonnées de réception */}
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>1. Coordonnées de livraison</span>
        </h2>
        <div className="space-y-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-hidden focus:border-zaren-500 font-medium"
              placeholder="Ex: Moussa Touré"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Numéro de téléphone (WhatsApp pour suivi)
            </label>
            <input
              type="tel"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-hidden focus:border-zaren-500 font-medium"
              placeholder="Ex: +225 07 12 34 56 78"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-hidden focus:border-zaren-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Quartier / Repère</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-hidden focus:border-zaren-500 font-medium"
                placeholder="Ex: Cocody Angré"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mode de remise */}
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-slate-500" />
          <span>2. Mode de récupération</span>
        </h2>
        <div className="space-y-2">
          <label
            onClick={() => setDeliveryMode('SELLER_DELIVERY')}
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              deliveryMode === 'SELLER_DELIVERY'
                ? 'border-zaren-600 bg-zaren-50/40 text-zaren-900 font-bold'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="delivery"
                checked={deliveryMode === 'SELLER_DELIVERY'}
                onChange={() => setDeliveryMode('SELLER_DELIVERY')}
                className="text-zaren-600 focus:ring-zaren-500"
              />
              <span className="text-xs">Livraison à domicile</span>
            </div>
            <span className="text-xs font-bold">{formatPrice(product.deliveryFee)}</span>
          </label>

          {product.pickupAvailable && (
            <label
              onClick={() => setDeliveryMode('PICKUP')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                deliveryMode === 'PICKUP'
                  ? 'border-zaren-600 bg-zaren-50/40 text-zaren-900 font-bold'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMode === 'PICKUP'}
                  onChange={() => setDeliveryMode('PICKUP')}
                  className="text-zaren-600 focus:ring-zaren-500"
                />
                <span className="text-xs">Retrait direct chez le vendeur</span>
              </div>
              <span className="text-xs font-bold text-emerald-600">Gratuit</span>
            </label>
          )}
        </div>
      </div>

      {/* 3. Moyen de paiement Mobile Money */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>3. Paiement Mobile Money</span>
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPaymentGateway('WAVE')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
              paymentGateway === 'WAVE'
                ? 'border-sky-500 bg-sky-50/80 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-sky-500 text-white font-black text-[10px] flex items-center justify-center">
              W
            </div>
            <span className="text-xs font-bold text-slate-900">Wave</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentGateway('ORANGE_MONEY')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
              paymentGateway === 'ORANGE_MONEY'
                ? 'border-orange-500 bg-orange-50/80 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-orange-500 text-white font-black text-[10px] flex items-center justify-center">
              OM
            </div>
            <span className="text-xs font-bold text-slate-900">Orange</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentGateway('MTN_MOMO')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
              paymentGateway === 'MTN_MOMO'
                ? 'border-amber-500 bg-amber-50/80 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-900 font-black text-[10px] flex items-center justify-center">
              MTN
            </div>
            <span className="text-xs font-bold text-slate-900">MoMo</span>
          </button>
        </div>
      </div>

      {/* Escrow Guarantee Box */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-900">Paiement 100% Séquestré</span>
        </div>
        <p className="text-[11px] text-emerald-800 leading-relaxed">
          Vos {formatPrice(totalAmount)} restent protégés par Zarén. Le vendeur n'est payé qu'après votre confirmation de bonne réception.
        </p>
      </div>

      {/* Price Recap */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span>Prix de l'article</span>
          <span>{formatPrice(product.price)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>Frais de livraison</span>
          <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : 'Gratuit'}</span>
        </div>
        <div className="flex items-center justify-between text-emerald-600 font-semibold">
          <span>Garantie Escrow Zarén</span>
          <span>Offerte</span>
        </div>
        <div className="flex items-center justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
          <span>Total à payer sous séquestre</span>
          <span className="text-zaren-700">{formatPrice(totalAmount)}</span>
        </div>
      </div>

      {/* Sticky Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg">
        <div className="max-w-md mx-auto">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full h-12 rounded-xl bg-zaren-600 hover:bg-zaren-700 text-white font-bold text-xs shadow-md shadow-zaren-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Sécurisation des fonds...'
                : `Payer ${formatPrice(totalAmount)} par ${paymentGateway}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
