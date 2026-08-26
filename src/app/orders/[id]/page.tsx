'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Truck,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { zarenStore } from '@/db/store';
import { Order } from '@/types';
import { formatPrice, formatDate, getHoursRemaining } from '@/lib/utils';
import EscrowStatusTimeline from '@/components/order/EscrowStatusTimeline';
import ConfirmDeliveryModal from '@/components/order/ConfirmDeliveryModal';
import DisputeModal from '@/components/order/DisputeModal';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  useEffect(() => {
    if (orderId) {
      let ord = zarenStore.getOrderById(orderId);
      if (!ord) {
        // Crée une commande dynamique liée à l'article pour permettre le suivi
        const products = zarenStore.getProducts();
        const prod = products[0];
        if (prod) {
          ord = zarenStore.createOrder({
            productId: prod.id,
            buyerName: 'Client Acheteur',
            buyerPhone: '+241 07 00 00 00',
            city: prod.city || 'Libreville',
            district: prod.district || 'Centre',
            deliveryMode: 'SELLER_DELIVERY',
            buyerNotes: 'Livraison express sous séquestre',
            quantity: 1
          });
        }
      }
      if (ord) {
        setOrder(ord);
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <Package className="w-12 h-12 text-slate-300 mb-3" />
        <h2 className="text-base font-bold text-slate-800">Commande introuvable</h2>
        <Link href="/" className="mt-3 text-xs text-zaren-600 font-bold">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const hoursLeft = order.autoReleaseAt ? getHoursRemaining(order.autoReleaseAt) : null;

  return (
    <div className="p-4 pb-28 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Accueil</span>
        </Link>
        <span className="text-xs font-mono font-bold text-slate-500">{order.orderNumber}</span>
      </div>

      {/* Main Status Hero Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl mb-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-zaren-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-semibold text-zaren-400 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Séquestre Actif • {formatPrice(order.totalAmount)}</span>
        </div>

        <h1 className="text-lg font-black tracking-tight mb-1">
          {order.status === 'PAID' && 'Paiement Séquestré & Garanti'}
          {order.status === 'PREPARING' && 'Colis en cours de préparation'}
          {order.status === 'IN_TRANSIT' && 'Colis en cours de livraison'}
          {order.status === 'DELIVERED' && 'Colis Livré - Action Requise'}
          {order.status === 'COMPLETED' && 'Transaction Clôturée avec Succès'}
          {order.status === 'DISPUTED' && 'Litige Ouvert - Fonds Gelés'}
        </h1>

        <p className="text-xs text-slate-300 leading-relaxed">
          {order.status === 'PAID' && 'Le vendeur a été notifié et prépare l\'expédition de votre commande.'}
          {order.status === 'PREPARING' && 'Le vendeur finalise l\'emballage de votre article.'}
          {order.status === 'IN_TRANSIT' && 'Votre colis est en route. Vous pourrez le vérifier dès réception.'}
          {order.status === 'DELIVERED' && `Vérifiez votre colis. Sans contestation de votre part, les fonds seront automatiquement débloqués dans ${hoursLeft ?? 48}h.`}
          {order.status === 'COMPLETED' && 'Vous avez validé la réception. Le vendeur a reçu son paiement.'}
          {order.status === 'DISPUTED' && 'Notre service client Zarén étudie votre réclamation sous 24h.'}
        </p>

        {order.status === 'DELIVERED' && hoursLeft !== null && (
          <div className="mt-4 flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Déblocage automatique des fonds dans <strong>{hoursLeft} heures</strong></span>
          </div>
        )}
      </div>

      {/* Article Detail */}
      {order.product && (
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5">
          <img
            src={order.product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
            alt={order.product.title}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-slate-900 truncate">{order.product.title}</h3>
            <span className="text-xs font-black text-zaren-700 block mt-0.5">
              {formatPrice(order.totalAmount)}
            </span>
            <span className="text-[10px] text-slate-500">
              Livraison : {order.deliveryAddress.district}, {order.deliveryAddress.city}
            </span>
          </div>
        </div>
      )}

      {/* Escrow Timeline */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Avancement de la commande
        </h2>
        <EscrowStatusTimeline
          status={order.status}
          createdAt={order.createdAt}
          paidAt={order.paidAt}
          preparingAt={order.preparingAt}
          inTransitAt={order.inTransitAt}
          deliveredAt={order.deliveredAt}
          autoReleaseAt={order.autoReleaseAt}
          completedAt={order.completedAt}
          disputedAt={order.disputedAt}
        />
      </div>

      {/* Buyer Actions & Post-purchase Discovery */}
      <div className="space-y-2.5">
        {order.status === 'DELIVERED' && (
          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Confirmer la bonne réception (Libérer les fonds)</span>
          </button>
        )}

        {/* Action Recommander cet article */}
        {order.product && (
          <Link
            href={`/p/${order.product.shortCode || order.product.id}`}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 border border-gray-200 shadow-xs transition"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Recommander cet article / Voir la fiche</span>
          </Link>
        )}

        {/* Bouton Voir le Grand Marché */}
        <Link
          href="/"
          className="w-full py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
        >
          <Package className="w-4 h-4 text-emerald-400" />
          <span>Explorer le Grand Marché ZARÉN</span>
        </Link>

        {['PAID', 'PREPARING', 'IN_TRANSIT', 'DELIVERED'].includes(order.status) && (
          <button
            onClick={() => setShowDisputeModal(true)}
            className="w-full py-2.5 px-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-gray-200 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Signaler un problème / Ouvrir un litige</span>
          </button>
        )}
      </div>

      {/* Confirmation & Dispute Modals */}
      <ConfirmDeliveryModal
        order={order}
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onSuccess={(updated) => setOrder(updated)}
      />

      <DisputeModal
        order={order}
        isOpen={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        onSuccess={(updated) => setOrder(updated)}
      />
    </div>
  );
}
