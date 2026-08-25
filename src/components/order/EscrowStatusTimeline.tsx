'use client';

import React from 'react';
import { OrderStatus } from '@/types';
import { CheckCircle2, Clock, Truck, PackageCheck, AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface EscrowStatusTimelineProps {
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  preparingAt?: string;
  inTransitAt?: string;
  deliveredAt?: string;
  autoReleaseAt?: string;
  completedAt?: string;
  disputedAt?: string;
}

export default function EscrowStatusTimeline({
  status,
  createdAt,
  paidAt,
  preparingAt,
  inTransitAt,
  deliveredAt,
  autoReleaseAt,
  completedAt,
  disputedAt,
}: EscrowStatusTimelineProps) {
  const steps = [
    {
      key: 'PAID',
      title: 'Paiement Séquestré',
      desc: 'Fonds bloqués en toute sécurité sur Zarén',
      date: paidAt || createdAt,
      done: ['PAID', 'PREPARING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(status),
      active: status === 'PAID',
      icon: ShieldCheck
    },
    {
      key: 'PREPARING',
      title: 'Préparation du Colis',
      desc: 'Le vendeur emballe et prépare l\'article',
      date: preparingAt,
      done: ['PREPARING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(status),
      active: status === 'PREPARING',
      icon: Clock
    },
    {
      key: 'IN_TRANSIT',
      title: 'En cours d\'acheminement',
      desc: 'Colis en route ou prêt pour retrait',
      date: inTransitAt,
      done: ['IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(status),
      active: status === 'IN_TRANSIT',
      icon: Truck
    },
    {
      key: 'DELIVERED',
      title: 'Colis Livré / Remis',
      desc: 'En attente de confirmation de l\'acheteur',
      date: deliveredAt,
      done: ['DELIVERED', 'COMPLETED'].includes(status),
      active: status === 'DELIVERED',
      icon: PackageCheck
    },
    {
      key: 'COMPLETED',
      title: 'Transaction Validée & Clôturée',
      desc: 'Fonds débloqués et transférés au vendeur',
      date: completedAt,
      done: status === 'COMPLETED',
      active: status === 'COMPLETED',
      icon: CheckCircle2
    }
  ];

  if (status === 'DISPUTED') {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-6">
        <div className="flex items-center gap-2.5 text-amber-800 font-bold text-sm mb-1">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Commande sous Litige & Fonds Gelés</span>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          Un litige a été ouvert. Le compte à rebours de libération automatique est suspendu. Notre équipe de médiation Zarén examine le dossier sous 24h.
        </p>
        {disputedAt && (
          <span className="text-[11px] text-amber-600 font-medium block mt-2">
            Ouvert le {formatDate(disputedAt)}
          </span>
        )}
      </div>
    );
  }

  if (status === 'CANCELLED' || status === 'REFUNDED') {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl mb-6">
        <div className="flex items-center gap-2.5 text-rose-800 font-bold text-sm mb-1">
          <XCircle className="w-5 h-5 text-rose-600" />
          <span>{status === 'REFUNDED' ? 'Commande Remboursée' : 'Commande Annulée'}</span>
        </div>
        <p className="text-xs text-rose-700">
          {status === 'REFUNDED'
            ? 'Les fonds ont été recrédités sur le compte Mobile Money de l\'acheteur.'
            : 'Cette transaction a été annulée.'}
        </p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.key} className="relative flex items-start gap-3">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.done
                    ? 'bg-zaren-600 border-zaren-600 text-white shadow-xs'
                    : step.active
                    ? 'bg-white border-zaren-600 text-zaren-600 animate-pulse'
                    : 'bg-white border-slate-300 text-slate-300'
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full ${step.active ? 'bg-zaren-600' : 'bg-slate-300'}`} />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-bold ${
                      step.active
                        ? 'text-zaren-700'
                        : step.done
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </h4>
                  {step.date && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {formatDate(step.date)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
