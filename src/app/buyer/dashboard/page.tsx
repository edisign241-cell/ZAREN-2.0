'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ShieldCheck,
  Package,
  CheckCircle2,
  ArrowRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { zarenStore } from '@/db/store';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

export default function BuyerDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(zarenStore.getOrders());
  }, []);

  return (
    <div className="p-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-black text-slate-900 text-sm">Mes Achats & Suivis</h1>
            <span className="text-[10px] text-slate-500">Paiements protégés par séquestre</span>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-bold text-zaren-700 hover:text-zaren-800"
        >
          Découvrir des articles
        </Link>
      </div>

      {/* Escrow reminder banner */}
      <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 mb-5 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
        <p className="text-xs text-emerald-900 leading-snug">
          Vos achats sont 100% garantis. L'argent n'est versé au vendeur que lorsque vous avez vérifié le colis.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Vous n'avez pas encore d'achats en cours.</p>
            <Link
              href="/"
              className="inline-block mt-3 py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Parcourir les articles
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  {order.orderNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    order.status === 'PAID'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'PREPARING'
                      ? 'bg-amber-100 text-amber-800'
                      : order.status === 'IN_TRANSIT'
                      ? 'bg-purple-100 text-purple-800'
                      : order.status === 'DELIVERED'
                      ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                      : order.status === 'COMPLETED'
                      ? 'bg-slate-100 text-slate-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {order.status === 'PAID' && 'Paiement Séquestré'}
                  {order.status === 'PREPARING' && 'En préparation'}
                  {order.status === 'IN_TRANSIT' && 'En cours de livraison'}
                  {order.status === 'DELIVERED' && 'Colis Livré - Valider réception'}
                  {order.status === 'COMPLETED' && 'Clôturé & Validé'}
                  {order.status === 'DISPUTED' && 'Litige ouvert'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={order.product?.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {order.product?.title}
                  </h3>
                  <span className="text-xs font-black text-zaren-700 block mt-0.5">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {formatDate(order.createdAt)}
                </span>
                <Link
                  href={`/orders/${order.id}`}
                  className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Suivre ma commande</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
