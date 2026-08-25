'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import StandardProfileView from '@/components/profile/StandardProfileView';
import {
  Store,
  ShieldCheck,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  PlusCircle,
  Share2,
  ArrowRight,
  TrendingUp,
  Wallet,
  AlertCircle,
  Award,
  Eye,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Filter,
  DollarSign,
  ArrowUpRight,
  Zap,
  Users,
  MessageCircle,
  Check,
  X,
  RefreshCw,
  Sliders,
  Calendar,
  BarChart3
} from 'lucide-react';
import { zarenStore } from '@/db/store';
import { Order, Product, SellerProfile, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import ShareButton from '@/components/product/ShareButton';

import { useAuth } from '@/context/AuthContext';

const PERIODS = [
  { id: '7d', label: '7 derniers jours' },
  { id: '30d', label: '30 derniers jours' },
  { id: 'year', label: 'Année 2026' }
];

const SALES_CHART_DATA = [
  { day: 'Lun', amount: 85000, orders: 2, height: '45%' },
  { day: 'Mar', amount: 140000, orders: 3, height: '65%' },
  { day: 'Mer', amount: 95000, orders: 2, height: '50%' },
  { day: 'Jeu', amount: 220000, orders: 4, height: '85%' },
  { day: 'Ven', amount: 310000, orders: 6, height: '100%' },
  { day: 'Sam', amount: 260000, orders: 5, height: '90%' },
  { day: 'Dim', amount: 130000, orders: 3, height: '60%' }
];

export default function SellerDashboardPage() {
  const { currentUser, upgradeToPro } = useAuth();
  const isPro = currentUser ? (currentUser.account_tier === 'PRO' || currentUser.plan === 'PRO') : true;

  const [seller, setSeller] = useState<SellerProfile>(zarenStore.getSellerProfile());
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ORDERS' | 'PRODUCTS' | 'ANALYTICS'>('OVERVIEW');
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  
  // Modale de retrait Mobile Money
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('150000');
  const [payoutProvider, setPayoutProvider] = useState<'AIRTEL' | 'MOOV'>('AIRTEL');
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Solde disponible retirable
  const [availableBalance, setAvailableBalance] = useState(758000);

  const refreshData = () => {
    setOrders(zarenStore.getOrders());
    setProducts(zarenStore.getProducts());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAdvanceStatus = (orderId: string, nextStatus: OrderStatus) => {
    try {
      zarenStore.updateOrderStatus(orderId, nextStatus);
      refreshData();
    } catch (err) {
      alert('Action non autorisée sur cette commande.');
    }
  };

  // Calculs financiers
  const escrowLockedAmount = orders
    .filter((o) => ['PAID', 'PREPARING', 'IN_TRANSIT', 'DELIVERED', 'DISPUTED'].includes(o.status))
    .reduce((sum, o) => sum + (o.totalAmount - o.platformFee), 0) || 482000;

  const totalRevenue = 1240000;

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(payoutAmount, 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Veuillez saisir un montant valide');
      return;
    }
    if (amountNum > availableBalance) {
      alert('Le montant demandé dépasse votre solde retirable disponible.');
      return;
    }

    setAvailableBalance((prev) => prev - amountNum);
    setPayoutSuccessMsg(`✅ Virement de ${formatPrice(amountNum)} envoyé avec succès sur votre compte ${payoutProvider === 'AIRTEL' ? 'Airtel Money' : 'Moov Money'} !`);
    setTimeout(() => {
      setPayoutSuccessMsg(null);
      setIsPayoutModalOpen(false);
    }, 2500);
  };

  // Filtrage des commandes
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ACTIVE') return ['PAID', 'PREPARING', 'IN_TRANSIT', 'DELIVERED'].includes(o.status);
    if (orderFilter === 'COMPLETED') return o.status === 'COMPLETED';
    return true;
  });

  // SI VENDEUR STANDARD (STYLE VINTED MOBILE-FIRST) : AFFICHAGE ÉPURÉ
  if (!isPro) {
    return (
      <div className="min-h-screen bg-[#F8F8F8]">
        <Navbar />
        <StandardProfileView
          user={{
            id: currentUser?.id || 'usr_seller_standard',
            name: currentUser?.name || 'Marlène Obame',
            username: currentUser?.username || '@marlene_dressing',
            avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            city: currentUser?.city || 'Libreville',
            district: currentUser?.district || 'Quartier Louis',
            ratingAvg: currentUser?.ratingAvg || 4.9,
            ratingCount: currentUser?.ratingCount || 12,
            completedSalesCount: currentUser?.completedSalesCount || 24,
            escrowBalance: availableBalance,
          }}
          products={products}
          reviews={zarenStore.getReviews()}
          orders={orders}
          isOwner={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#111111] flex flex-col">
      {/* 1. NAVBAR GLOBALE AVEC MENU HAMBURGER PRO */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-28">
        
        {/* ========================================================================= */}
        {/* 1. EN-TÊTE DU VENDEUR PRO & ACTIONS RAPIDES */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E5E5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Identité Boutique */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#008A45] shadow-sm bg-neutral-100 shrink-0">
              <img
                src={seller.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt="Logo Boutique"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#008A45] border-2 border-white"></span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-black italic text-[#111111] tracking-tight">
                  {seller.businessName || 'Marlène Dressing & High-Tech'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black italic bg-emerald-50 text-[#008A45] border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> VÉRIFIÉ
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black italic bg-neutral-900 text-white font-mono">
                  <Award className="w-3 h-3 text-[#008A45]" /> PASS PRO
                </span>
              </div>

              <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-2 flex-wrap">
                <span>📍 Libreville (Louis)</span>
                <span>•</span>
                <span className="text-[#d97706] font-bold">★ 4.9 (84 avis)</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">142 ventes validées</span>
              </p>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <Link
              href="/shop/marlene-dressing"
              className="flex-1 sm:flex-none py-2.5 px-3.5 bg-[#F8F8F8] hover:bg-neutral-100 border border-[#E5E5E5] text-[#111111] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Eye className="w-4 h-4 text-[#008A45]" />
              <span>Voir ma Vitrine</span>
            </Link>

            <Link
              href="/profile/settings"
              className="flex-1 sm:flex-none py-2.5 px-3.5 bg-[#F8F8F8] hover:bg-neutral-100 border border-[#E5E5E5] text-[#111111] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Settings className="w-4 h-4 text-gray-700" />
              <span>Paramètres</span>
            </Link>

            <Link
              href="/seller/new"
              className="flex-1 sm:flex-none py-2.5 px-4 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Vendre un article</span>
            </Link>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. CARTES KPI FINANCIÈRES & MÉTRIQUES CLÉS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* CARTE 1 : CHIFFRE D'AFFAIRES ENCAISSÉ */}
          <div className="p-5 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs space-y-2 hover:border-[#008A45] transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Chiffre d'Affaires
              </span>
              <span className="text-[10px] font-black text-[#008A45] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +28.4%
              </span>
            </div>
            <div className="text-2xl font-black italic text-[#111111] font-mono">
              {formatPrice(totalRevenue)}
            </div>
            <p className="text-[10px] text-gray-500 font-medium">
              Total débloqué et transféré vers Mobile Money
            </p>
          </div>

          {/* CARTE 2 : SÉQUESTRE EN COURS */}
          <div className="p-5 rounded-3xl bg-[#111827] text-white shadow-md space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#008A45] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Séquestre en cours
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400">
                100% GARANTI
              </span>
            </div>
            <div className="text-2xl font-black italic text-white font-mono">
              {formatPrice(escrowLockedAmount)}
            </div>
            <p className="text-[10px] text-gray-300 font-medium">
              Fonds consignés en attente de livraison
            </p>
          </div>

          {/* CARTE 3 : SOLDE RETIRABLE INSTANTANÉ */}
          <div className="p-5 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs space-y-2 hover:border-[#008A45] transition flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" /> Solde Retirable
              </span>
              <span className="text-[10px] font-bold text-gray-600">Dispo 24/7</span>
            </div>
            <div className="text-2xl font-black italic text-[#008A45] font-mono">
              {formatPrice(availableBalance)}
            </div>
            <button
              onClick={() => setIsPayoutModalOpen(true)}
              className="w-full py-2 px-3 bg-[#008A45] hover:bg-[#007339] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Retrait Express</span>
            </button>
          </div>

          {/* CARTE 4 : PERFORMANCE & CONFIANCE */}
          <div className="p-5 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs space-y-2 hover:border-[#008A45] transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Taux de Succès
              </span>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                0 Litige
              </span>
            </div>
            <div className="text-2xl font-black italic text-[#111111] font-mono">
              100%
            </div>
            <p className="text-[10px] text-gray-500 font-medium">
              142/142 commandes finalisées avec succès
            </p>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. SYSTÈME D'ONGLETS DU TABLEAU DE BORD */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 border-b border-[#E5E5E5] bg-white p-2 rounded-2xl shadow-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-2.5 px-4 rounded-xl text-xs font-black italic uppercase tracking-wider transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'bg-[#111111] text-white shadow-sm'
                : 'text-gray-600 hover:bg-neutral-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#008A45]" />
            <span>Vue Générale & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`py-2.5 px-4 rounded-xl text-xs font-black italic uppercase tracking-wider transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ORDERS'
                ? 'bg-[#111111] text-white shadow-sm'
                : 'text-gray-600 hover:bg-neutral-100'
            }`}
          >
            <Package className="w-4 h-4 text-[#008A45]" />
            <span>Commandes & Séquestres ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`py-2.5 px-4 rounded-xl text-xs font-black italic uppercase tracking-wider transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'PRODUCTS'
                ? 'bg-[#111111] text-white shadow-sm'
                : 'text-gray-600 hover:bg-neutral-100'
            }`}
          >
            <Store className="w-4 h-4 text-[#008A45]" />
            <span>Mon Catalogue ({products.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 4. CONTENU ONGLET 1 : VUE GÉNÉRALE & ANALYTICS AVANCÉES */}
        {/* ========================================================================= */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* GRAPHIQUE D'ÉVOLUTION DU CHIFFRE D'AFFAIRES & VENTES */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5E5E5] shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm sm:text-base font-black italic uppercase tracking-tight text-[#111111] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#008A45]" />
                    <span>Évolution du Chiffre d'Affaires sous Séquestre</span>
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">Revenus validés par jour sur la semaine en cours</p>
                </div>

                {/* Sélecteur de période */}
                <div className="flex items-center gap-1.5 p-1 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5]">
                  {PERIODS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPeriod(p.id)}
                      className={`py-1.5 px-3 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        selectedPeriod === p.id
                          ? 'bg-white text-[#111111] shadow-xs border border-[#E5E5E5]'
                          : 'text-gray-500 hover:text-[#111111]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Histogramme des ventes interactif */}
              <div className="h-64 pt-6 flex items-end justify-between gap-2 sm:gap-6 border-b border-gray-100 pb-4">
                {SALES_CHART_DATA.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    
                    {/* Infobulle au survol */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#111111] text-white text-[10px] font-bold py-1 px-2 rounded-lg shadow-lg pointer-events-none mb-1 text-center whitespace-nowrap">
                      <div>{formatPrice(item.amount)}</div>
                      <div className="text-emerald-400 font-normal">{item.orders} ventes</div>
                    </div>

                    {/* Barre de l'histogramme */}
                    <div
                      className="w-full max-w-[48px] bg-emerald-100 group-hover:bg-[#008A45] rounded-xl transition-all duration-300 relative overflow-hidden"
                      style={{ height: item.height }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#008A45] to-emerald-400 opacity-80 group-hover:opacity-100"></div>
                    </div>

                    {/* Libellé du jour */}
                    <span className="text-xs font-bold text-gray-500 group-hover:text-[#111111]">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Statistiques clés de la période */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center sm:text-left">
                <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Vente Record</span>
                  <span className="text-sm font-black text-[#111111]">310 000 FCFA</span>
                </div>
                <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Panier Moyen</span>
                  <span className="text-sm font-black text-[#008A45]">135 000 FCFA</span>
                </div>
                <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Commandes Semaine</span>
                  <span className="text-sm font-black text-[#111111]">25 commandes</span>
                </div>
                <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Délai Déblocage Moyen</span>
                  <span className="text-sm font-black text-emerald-700">1h 45min</span>
                </div>
              </div>

            </div>

            {/* TUNNEL DE CONVERSION & ACQUISITION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* CARTE TUNNEL DE CONVERSION */}
              <div className="bg-white rounded-3xl p-6 border border-[#E5E5E5] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black italic uppercase tracking-wider text-[#111111] flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#008A45]" />
                    <span>Tunnel de Conversion Visibilité → Ventes</span>
                  </h3>
                  <span className="text-[10px] font-mono text-gray-500 font-bold">30 derniers jours</span>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Étape 1 : Vues */}
                  <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>1. Vues des fiches produits</span>
                      </span>
                      <span className="font-mono text-[#111111]">4 850 vues (100%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-full"></div>
                    </div>
                  </div>

                  {/* Étape 2 : Partages WhatsApp */}
                  <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <Share2 className="w-3.5 h-3.5 text-[#008A45]" />
                        <span>2. Clics sur liens WhatsApp & Réseaux</span>
                      </span>
                      <span className="font-mono text-[#111111]">620 clics (12.8%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#008A45] rounded-full w-[45%]"></div>
                    </div>
                  </div>

                  {/* Étape 3 : Commandes Séquestre */}
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-[#008A45]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>3. Achats Séquestre Finalisés</span>
                      </span>
                      <span className="font-mono text-emerald-950 font-black">142 ventes (2.9%)</span>
                    </div>
                    <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#008A45] rounded-full w-[25%]"></div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-neutral-900 text-white rounded-2xl text-[11px] font-medium flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Votre taux de conversion est <strong>+35% supérieur</strong> à la moyenne des vendeurs informels.</span>
                </div>
              </div>

              {/* RÉPARTITION PAR CANAL */}
              <div className="bg-white rounded-3xl p-6 border border-[#E5E5E5] shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black italic uppercase tracking-wider text-[#111111] flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-[#008A45]" />
                    <span>Origine des Ventes & Canaux d'Acquisition</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">💬</span>
                        <div>
                          <span className="text-xs font-bold text-[#111111] block">WhatsApp Status & Groupes</span>
                          <span className="text-[10px] text-gray-500">Templates SellerCoach générés</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-[#008A45]">58% des ventes</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🛍️</span>
                        <div>
                          <span className="text-xs font-bold text-[#111111] block">Grand Marché ZARÉN</span>
                          <span className="text-[10px] text-gray-500">Recherche & flux direct</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-blue-600">28% des ventes</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📱</span>
                        <div>
                          <span className="text-xs font-bold text-[#111111] block">Facebook & Telegram</span>
                          <span className="text-[10px] text-gray-500">Partages viraux ZARÉN</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-purple-600">14% des ventes</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/seller/new"
                  className="w-full py-3 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition text-center"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Créer un lien de partage viral</span>
                </Link>
              </div>

            </div>

            {/* CONSEILS VENDEUR SELLERCOACH (IA) */}
            <div className="p-5 bg-gradient-to-r from-emerald-950 to-neutral-900 text-white rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-[#008A45] text-white shadow-md shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black italic uppercase tracking-wider text-emerald-400">
                    Conseil SellerCoach Pro du Jour
                  </h4>
                  <p className="text-xs text-gray-200 font-medium leading-relaxed">
                    Les articles dotés d'une <strong>vidéo de démonstration HD</strong> génèrent 2,4x plus de commandes instantanées. Pensez à filmer vos nouveaux arrivages de mode !
                  </p>
                </div>
              </div>

              <Link
                href="/seller/new"
                className="py-2 px-4 rounded-xl bg-white text-[#111111] hover:bg-emerald-50 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition active:scale-95 shadow-xs"
              >
                Appliquer le conseil →
              </Link>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. CONTENU ONGLET 2 : GESTION DES COMMANDES & SÉQUESTRES */}
        {/* ========================================================================= */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Filtres de commandes */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      orderFilter === filter
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-[#E5E5E5]'
                    }`}
                  >
                    {filter === 'ALL' && `Toutes (${orders.length})`}
                    {filter === 'ACTIVE' && 'En cours sous séquestre'}
                    {filter === 'COMPLETED' && 'Clôturées & Payées'}
                  </button>
                ))}
              </div>

              <span className="text-xs text-gray-500 font-medium">
                {filteredOrders.length} commande(s) affichée(s)
              </span>
            </div>

            {/* Liste des commandes */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-[#E5E5E5] space-y-3">
                  <Package className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="text-sm font-bold text-[#111111]">Aucune commande trouvée</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Partagez vos articles sur WhatsApp et vos réseaux pour recevoir vos premières commandes sous séquestre !
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-white rounded-3xl border border-[#E5E5E5] shadow-xs space-y-4 hover:border-[#008A45] transition"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-black text-[#111111] bg-gray-100 px-2.5 py-1 rounded-lg">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-gray-400">• {formatDate(order.createdAt)}</span>
                      </div>

                      {/* Statut Badge */}
                      <span
                        className={`text-[10px] font-black italic px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          order.status === 'PAID'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : order.status === 'PREPARING'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : order.status === 'IN_TRANSIT'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : order.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : order.status === 'COMPLETED'
                            ? 'bg-neutral-900 text-white'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {order.status === 'PAID' && '💳 Payé (Séquestre ZARÉN)'}
                        {order.status === 'PREPARING' && '📦 En préparation'}
                        {order.status === 'IN_TRANSIT' && '🚚 En cours de livraison'}
                        {order.status === 'DELIVERED' && '📍 Livré (Attente validation)'}
                        {order.status === 'COMPLETED' && '✓ Clôturé & Débloqué'}
                        {order.status === 'DISPUTED' && '⚠️ Litige ouvert'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
                      <div>
                        <h4 className="text-sm font-black italic text-[#111111]">
                          {order.product?.title || 'Article ZARÉN'}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span>👤 Acheteur : {order.buyer?.fullName || order.deliveryAddress?.fullName || 'Client Vérifié'}</span>
                          <span>•</span>
                          <span>📍 {order.deliveryAddress.city} ({order.deliveryAddress.district})</span>
                          <span>•</span>
                          <span>📞 {order.deliveryAddress.phone}</span>
                        </div>
                      </div>

                      <div className="text-right sm:text-right w-full sm:w-auto">
                        <span className="text-base font-black text-[#008A45] font-mono block">
                          {formatPrice(order.totalAmount)}
                        </span>
                        <span className="text-[10px] text-gray-400">Montant sous séquestre</span>
                      </div>
                    </div>

                    {/* Actions de statut vendeur */}
                    <div className="pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                      {order.status === 'PAID' && (
                        <button
                          onClick={() => handleAdvanceStatus(order.id, 'PREPARING')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Commencer la préparation
                        </button>
                      )}

                      {order.status === 'PREPARING' && (
                        <button
                          onClick={() => handleAdvanceStatus(order.id, 'IN_TRANSIT')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Marquer expédié / En cours de livraison
                        </button>
                      )}

                      {order.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => handleAdvanceStatus(order.id, 'DELIVERED')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Confirmer le colis livré au client
                        </button>
                      )}

                      <a
                        href={`https://wa.me/${order.deliveryAddress.phone.replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(order.buyer?.fullName || order.deliveryAddress?.fullName || 'Cher Client')}%2C%20je%20suis%20votre%20vendeur%20ZAREN%20pour%20votre%20commande%20${order.orderNumber}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#008A45] font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Client</span>
                      </a>

                      <Link
                        href={`/orders/${order.id}`}
                        className="py-2.5 px-4 rounded-xl bg-[#F8F8F8] hover:bg-gray-200 text-[#111111] font-bold text-xs transition"
                      >
                        Détails séquestre →
                      </Link>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. CONTENU ONGLET 3 : MON CATALOGUE & GESTION DES ARTICLES */}
        {/* ========================================================================= */}
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-4 animate-fade-in">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {products.length} articles en vitrine
              </span>

              <Link
                href="/seller/new"
                className="py-2 px-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Ajouter un article</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl p-4 border border-[#E5E5E5] shadow-xs space-y-3 hover:border-[#008A45] transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100">
                      <img
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                        alt={prod.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#008A45] text-white text-[9px] font-black uppercase tracking-wider">
                        SÉQUESTRE
                      </span>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-base font-black text-[#111111] font-mono">
                          {formatPrice(prod.price)}
                        </span>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          En Stock
                        </span>
                      </div>
                      <h3 className="text-xs font-black italic text-[#111111] line-clamp-2">
                        {prod.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {prod.viewsCount} vues • {prod.sharesCount} partages
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                    <ShareButton product={prod} />

                    <Link
                      href={`/p/${prod.shortCode}`}
                      className="flex-1 py-2 px-3 bg-[#F8F8F8] hover:bg-neutral-100 text-[#111111] text-xs font-bold rounded-xl border border-[#E5E5E5] text-center transition"
                    >
                      Voir la fiche
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 7. MODALE DE RETRAIT EXPRESS MOBILE MONEY */}
      {/* ========================================================================= */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E5E5E5] space-y-5 animate-scale-in">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-[#008A45]">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black italic uppercase text-[#111111]">
                    Demande de Retrait Express
                  </h3>
                  <span className="text-[10px] text-gray-500 font-medium">Virement instantané sous 15 minutes</span>
                </div>
              </div>

              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#111111] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {payoutSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-bounce">
                <Check className="w-8 h-8 text-[#008A45] mx-auto" />
                <p className="text-xs font-bold text-emerald-950">{payoutSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="space-y-4">
                
                {/* Solde disponible */}
                <div className="p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Solde retirable disponible :</span>
                  <span className="text-sm font-black text-[#008A45] font-mono">{formatPrice(availableBalance)}</span>
                </div>

                {/* Choix de l'opérateur */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase text-gray-600">
                    Opérateur Mobile Money *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayoutProvider('AIRTEL')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        payoutProvider === 'AIRTEL'
                          ? 'border-[#008A45] bg-emerald-50/60 text-[#008A45]'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span>🔴 Airtel Money</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutProvider('MOOV')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        payoutProvider === 'MOOV'
                          ? 'border-[#008A45] bg-emerald-50/60 text-[#008A45]'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span>🔵 Moov Money</span>
                    </button>
                  </div>
                </div>

                {/* Montant à retirer */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase text-gray-600">
                    Montant du virement (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min={5000}
                    max={availableBalance}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full text-sm font-mono font-black p-3.5 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden"
                  />
                  
                  {/* Boutons rapides */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {[50000, 100000, 200000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPayoutAmount(String(amt))}
                        className="py-1 px-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[10px] font-mono font-bold text-gray-700 transition cursor-pointer"
                      >
                        {formatPrice(amt)}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPayoutAmount(String(availableBalance))}
                      className="py-1 px-2.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-[10px] font-bold text-emerald-800 transition cursor-pointer"
                    >
                      Tout retirer
                    </button>
                  </div>
                </div>

                {/* Numéro récepteur */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-gray-600">
                    Numéro de réception
                  </label>
                  <input
                    type="tel"
                    readOnly
                    value="+241 07 45 88 12 (Marlène Obame)"
                    className="w-full text-xs font-mono font-bold p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Confirmer le Virement Express</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
