'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Megaphone,
  Scale,
  Users,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  LogOut,
  FileText,
  Lock,
  Sparkles,
  Trash2,
  Printer,
  Mail,
  KeyRound,
  ArrowRight,
  Copy,
  Check,
  Building2,
  CreditCard
} from 'lucide-react';
import { adminAuthService, SUPER_ADMIN_EMAIL } from '@/lib/adminAuth';
import { partnerAdService } from '@/lib/partners';
import { zarenStore } from '@/db/store';
import { formatPrice } from '@/lib/utils';
import { PartnerAd, Dispute, Order } from '@/types';

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Login form state (si non authentifié)
  const [email, setEmail] = useState(SUPER_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isFirstSetup, setIsFirstSetup] = useState(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'ads' | 'disputes' | 'users'>('ads');
  const [partnerAds, setPartnerAds] = useState<PartnerAd[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellerProfile, setSellerProfile] = useState(zarenStore.getSellerProfile());
  const [selectedInvoice, setSelectedInvoice] = useState<PartnerAd | null>(null);
  const [copiedOfferLink, setCopiedOfferLink] = useState(false);

  useEffect(() => {
    const isAuth = adminAuthService.isAuthenticated();
    setIsAuthenticated(isAuth);
    if (isAuth) {
      loadData();
    } else {
      setIsFirstSetup(!adminAuthService.isPasswordSet());
    }
    setIsCheckingAuth(false);
  }, []);

  const loadData = () => {
    setPartnerAds(partnerAdService.getAds());
    setDisputes(zarenStore.getDisputes());
    setOrders(zarenStore.getOrders());
    setSellerProfile(zarenStore.getSellerProfile());
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmittingLogin(true);

    setTimeout(() => {
      const res = adminAuthService.login(email, password);
      if (res.success) {
        setIsAuthenticated(true);
        loadData();
      } else {
        setLoginError(res.error || 'Identifiants invalides.');
      }
      setIsSubmittingLogin(false);
    }, 400);
  };

  const handleLogout = () => {
    adminAuthService.logout();
    setIsAuthenticated(false);
    setPassword('');
    setIsFirstSetup(!adminAuthService.isPasswordSet());
  };

  const handleCopyPartnerOfferLink = () => {
    if (typeof window !== 'undefined') {
      const offerUrl = `${window.location.origin}/partners/offer`;
      navigator.clipboard.writeText(offerUrl);
      setCopiedOfferLink(true);
      setTimeout(() => setCopiedOfferLink(false), 2500);
    }
  };

  // Actions Publicités Partenaires
  const handleToggleAdStatus = (ad: PartnerAd) => {
    const newStatus = ad.adStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    partnerAdService.updateAdStatus(ad.id, newStatus);
    loadData();
  };

  const handleDeleteAd = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette campagne publicitaire ?')) {
      partnerAdService.deleteAd(id);
      loadData();
    }
  };

  // Actions SupportResolver / Litiges
  const handleRefundBuyer = (disputeId: string) => {
    if (confirm('Confirmer le remboursement immédiat de l’acheteur par Mobile Money ?')) {
      zarenStore.resolveDispute(disputeId, 'refund', 'Remboursement validé par Super Admin Général.');
      loadData();
      alert('Acheteur remboursé avec succès. Les fonds du séquestre ont été restitués.');
    }
  };

  const handleReleaseEscrow = (disputeId: string) => {
    if (confirm('Confirmer le déblocage et virement des fonds en faveur du vendeur ?')) {
      zarenStore.resolveDispute(disputeId, 'release', 'Déblocage validé par Super Admin Général après vérification de preuve.');
      loadData();
      alert('Fonds débloqués en faveur du vendeur avec succès.');
    }
  };

  // Action Toggle Badge Vendeur Vérifié
  const handleToggleVerifiedBadge = () => {
    const updated = zarenStore.updateSellerProfile({
      isVerified: !sellerProfile.isVerified
    });
    setSellerProfile(updated);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-white font-sans">
        <div className="text-xs font-mono text-gray-400">Chargement de la console ZARÉN...</div>
      </div>
    );
  }

  // ==========================================
  // ÉCRAN 1 : FORMULAIRE DE CONNEXION ADMIN DIRECT
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md space-y-6">
          
          {/* Logo & Titre */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-[#008A45] shadow-lg shadow-emerald-950">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">
                PORTAIL DE GOUVERNANCE SÉCURISÉ
              </span>
              <h1 className="text-2xl font-black italic tracking-tight text-white mt-0.5">
                ZARÉN SUPER ADMIN
              </h1>
            </div>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Console de gestion centrale du séquestre, arbitrage des litiges et régie des partenariats.
            </p>
          </div>

          {/* Formulaire Admin */}
          <div className="bg-[#131B2A] rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-2xl space-y-5">
            {isFirstSetup && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Configuration Super Admin :</strong>
                  <span>Saisissez le mot de passe de votre choix pour <strong>{SUPER_ADMIN_EMAIL}</strong> afin d'activer et verrouiller la console.</span>
                </div>
              </div>
            )}

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {/* Email Administrateur */}
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  Identifiant Administrateur Général
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    readOnly
                    className="w-full pl-9 pr-4 py-3 bg-[#0B0F17] rounded-xl border border-gray-700 text-gray-200 font-mono text-xs focus:outline-hidden cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Mot de Passe Admin */}
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  {isFirstSetup ? 'Créez votre mot de passe administrateur' : 'Mot de passe administrateur'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-[#0B0F17] rounded-xl border border-gray-700 text-white font-mono text-xs focus:outline-hidden focus:border-[#008A45] focus:ring-1 focus:ring-[#008A45]"
                  />
                  <KeyRound className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Bouton de Connexion */}
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-3.5 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingLogin ? (
                  <span>Vérification des accès...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{isFirstSetup ? 'Activer et Déverrouiller la Console' : 'Connexion Super Admin'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Retour au site public */}
          <div className="text-center">
            <button
              onClick={() => window.open('/', '_blank')}
              className="text-xs text-gray-500 hover:text-gray-300 font-medium transition cursor-pointer"
            >
              ← Ouvrir la marketplace publique ZARÉN
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ÉCRAN 2 : CONSOLE SUPER ADMIN DASHBOARD
  // ==========================================
  const totalEscrowVolume = orders.reduce((acc, o) => acc + o.totalAmount, 750000);
  const totalAdRevenue = partnerAds.reduce((acc, a) => acc + (a.paymentStatus === 'PAID' ? a.priceFcfa : 0), 0);
  const totalCompletedOrders = orders.filter(o => o.status === 'COMPLETED').length + 14;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 font-sans pb-20">
      
      {/* 1. TOP BAR DU SUPER ADMIN */}
      <header className="sticky top-0 z-40 bg-[#131B2A]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Titre */}
          <div className="flex items-center gap-3">
            <div className="h-9 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black italic text-base tracking-tight text-white">
                  ZARÉN SUPER ADMIN
                </span>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  ROOT PRIVILEGES
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono block">
                Connecté en tant que : <strong>{SUPER_ADMIN_EMAIL}</strong>
              </span>
            </div>
          </div>

          {/* Raccourcis & Déconnexion */}
          <div className="flex items-center gap-3">
            {/* BOUTON FONCTIONNEL : VOIR LA MARKETPLACE */}
            <button
              onClick={() => window.open('/', '_blank')}
              className="py-2 px-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <span>Voir la Marketplace</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#008A45]" />
            </button>

            <button
              onClick={handleLogout}
              className="py-2 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Quitter</span>
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        {/* 2. STATISTIQUES GLOBALES & SÉQUESTRE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Métrique 1 : Volume Séquestre Total */}
          <div className="p-5 rounded-3xl bg-[#131B2A] border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Volume Séquestre Géré</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white tracking-tight font-mono">
              {formatPrice(totalEscrowVolume)}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono block">
              100% garanti sous séquestre Mobile Money
            </span>
          </div>

          {/* Métrique 2 : Revenus Régie Publicitaire */}
          <div className="p-5 rounded-3xl bg-[#131B2A] border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Revenus Régie Pub Partenaires</span>
              <Megaphone className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 tracking-tight font-mono">
              {formatPrice(totalAdRevenue)}
            </div>
            <span className="text-[10px] text-gray-400 font-mono block">
              {partnerAds.length} campagnes enregistrées
            </span>
          </div>

          {/* Métrique 3 : Litiges & Taux de Conformité */}
          <div className="p-5 rounded-3xl bg-[#131B2A] border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Arbitrages & Litiges (SupportResolver)</span>
              <Scale className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {disputes.length} <span className="text-xs text-gray-500 font-normal">dossiers</span>
            </div>
            <span className="text-[10px] text-blue-400 font-mono block">
              Taux de litige plateforme &lt; 1.2 %
            </span>
          </div>

          {/* Métrique 4 : Transactions Réussies */}
          <div className="p-5 rounded-3xl bg-[#131B2A] border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Transactions Finalisées</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {totalCompletedOrders}
            </div>
            <span className="text-[10px] text-purple-400 font-mono block">
              Fonds débloqués aux vendeurs
            </span>
          </div>

        </div>

        {/* 3. NAVIGATION PAR ONGLETS */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ads')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'ads'
                ? 'bg-[#008A45] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>1. Campagnes Publicitaires Partenaires ({partnerAds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'disputes'
                ? 'bg-[#008A45] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>2. Arbitrage Litiges & Séquestre ({disputes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'users'
                ? 'bg-[#008A45] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Vendeurs, Badges & Monétisation</span>
          </button>
        </div>

        {/* 4. CONTENU DE L'ONGLET 1 : RÉGIE PUBLICITAIRE & PARTENARIATS */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-3xl bg-[#131B2A] border border-gray-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Gestion & Modération des Annonces Smartphone Hero</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Partagez le lien d'offre aux entreprises ou activez/mettez en pause les campagnes en direct.
                </p>
              </div>

              {/* BOUTONS D'ACTIONS DE PARTAGE D'OFFRE */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleCopyPartnerOfferLink}
                  className="py-2.5 px-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-2 transition cursor-pointer active:scale-95"
                >
                  {copiedOfferLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Lien d'offre copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-blue-300" />
                      <span>Copier Lien Partenaire (WhatsApp/Mail)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.open('/partners/offer', '_blank')}
                  className="py-2.5 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ouvrir Page Offre Partenaire ↗</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {partnerAds.map((ad) => (
                <div
                  key={ad.id}
                  className="p-5 rounded-3xl bg-[#131B2A] border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Miniature & Infos */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 shrink-0 relative">
                      <img src={ad.mediaUrl} alt={ad.title} className="w-full h-full object-cover" />
                      <span className="absolute top-1 left-1 bg-black/80 text-[8px] text-white px-1.5 py-0.5 rounded font-mono">
                        {ad.mediaType}
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white truncate">{ad.partnerName}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          ad.adStatus === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {ad.adStatus === 'ACTIVE' ? '● ACTIF SUR LE SMARTPHONE' : '⏸ EN PAUSE'}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">{ad.invoiceNumber}</span>
                      </div>

                      <h3 className="text-sm font-black text-gray-200 truncate">{ad.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-1">{ad.tagline}</p>
                      
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-1 flex-wrap">
                        <span className="text-[#008A45] font-bold font-mono">Montant : {formatPrice(ad.priceFcfa)}</span>
                        <span>•</span>
                        <span>Contact : {ad.contactEmail} ({ad.contactPhone})</span>
                        <span>•</span>
                        
                        {/* BOUTON FONCTIONNEL : LIEN CIBLE PARTENAIRE */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = ad.targetUrl.startsWith('http') ? ad.targetUrl : `https://${ad.targetUrl}`;
                            window.open(url, '_blank');
                          }}
                          className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-mono font-bold cursor-pointer"
                        >
                          <span>Lien cible ↗</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Statistiques & Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <div className="text-right pr-3 border-r border-gray-800 hidden lg:block">
                      <span className="text-xs font-bold text-gray-300 block">{ad.clicksCount} clics</span>
                      <span className="text-[10px] text-gray-500 font-mono">{ad.impressionsCount} vues</span>
                    </div>

                    {/* Voir Facture */}
                    <button
                      onClick={() => setSelectedInvoice(ad)}
                      className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition cursor-pointer"
                      title="Voir Facture avec Logo"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    {/* Toggle Activer / Pause */}
                    <button
                      onClick={() => handleToggleAdStatus(ad)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        ad.adStatus === 'ACTIVE'
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {ad.adStatus === 'ACTIVE' ? 'Mettre en pause' : 'Activer sur Hero'}
                    </button>

                    {/* Supprimer */}
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                      title="Supprimer la pub"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CONTENU DE L'ONGLET 2 : ARBITRAGE LITIGES (SupportResolver IA) */}
        {activeTab === 'disputes' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-white">
                Console d'Arbitrage des Litiges & Séquestre Mobile Money
              </h2>
              <p className="text-xs text-gray-400">
                SupportResolver : Exécutez `refund_buyer` pour rembourser l'acheteur ou `release_escrow` pour débloquer les fonds au vendeur.
              </p>
            </div>

            {disputes.length === 0 ? (
              <div className="p-8 rounded-3xl bg-[#131B2A] border border-gray-800 text-center space-y-2">
                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">Aucun litige ouvert</h3>
                <p className="text-xs text-gray-400">Toutes les transactions ZARÉN se déroulent actuellement en toute conformité.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {disputes.map((d) => (
                  <div
                    key={d.id}
                    className="p-5 rounded-3xl bg-[#131B2A] border border-gray-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-xs text-white">Litige #{d.id}</span>
                        <span className="text-[10px] text-gray-400 font-mono">Commande : {d.orderId}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {d.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gray-900/60 border border-gray-800 text-xs text-gray-300 space-y-1">
                      <div className="flex items-center justify-between text-gray-400 text-[10px]">
                        <span>Motif : {d.reason}</span>
                        <span>Déclaré le : {new Date(d.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <p className="text-xs text-gray-200">{d.description}</p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleRefundBuyer(d.id)}
                        className="py-2 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer"
                      >
                        🔴 Rembourser l'acheteur (refund_buyer)
                      </button>

                      <button
                        onClick={() => handleReleaseEscrow(d.id)}
                        className="py-2 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition cursor-pointer"
                      >
                        🟢 Débloquer au vendeur (release_escrow)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. CONTENU DE L'ONGLET 3 : VENDEURS & MONÉTISATION */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-white">
                Gouvernance des Vendeurs & Badges de Confiance
              </h2>
              <p className="text-xs text-gray-400">
                Attribution du badge « Vendeur Vérifié » selon la matrice de conformité ZARÉN.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#131B2A] border border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={sellerProfile.logoUrl || sellerProfile.avatarUrl}
                    alt={sellerProfile.businessName}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">{sellerProfile.businessName}</h3>
                      {sellerProfile.isVerified && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          ✓ Vendeur Vérifié
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {sellerProfile.username} • {sellerProfile.city}, {sellerProfile.country}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleToggleVerifiedBadge}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                    sellerProfile.isVerified
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-[#008A45] hover:bg-[#007339] text-white'
                  }`}
                >
                  {sellerProfile.isVerified ? 'Retirer le badge vérifié' : 'Attribuer le badge vérifié'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-800 text-xs">
                <div className="p-3 rounded-xl bg-gray-900/60">
                  <span className="text-gray-400 block text-[10px]">Abonnement Vendeur :</span>
                  <strong className="text-emerald-400">Pass Pro (4 500 FCFA/mois)</strong>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/60">
                  <span className="text-gray-400 block text-[10px]">Moyen de Payout :</span>
                  <strong className="text-white">{sellerProfile.payoutMethod} ({sellerProfile.payoutAccountNumber})</strong>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/60">
                  <span className="text-gray-400 block text-[10px]">Note Moyenne :</span>
                  <strong className="text-amber-400">★ {sellerProfile.ratingAvg} / 5 ({sellerProfile.ratingCount} avis)</strong>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODALE D'AFFICHAGE DE FACTURE AVEC LOGO OFFICIEL ZARÉN */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl max-w-xl w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            
            {/* Header avec Logo ZARÉN */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 px-2.5 py-1 rounded-xl bg-[#111827] flex items-center justify-center shadow-xs">
                  <img src="/logo.png" alt="ZARÉN" className="h-7 w-auto object-contain" />
                </div>
                <div>
                  <strong className="text-sm font-black block text-gray-900">FACTURE PROFORMA ZARÉN</strong>
                  <span className="text-[10px] text-gray-500 font-sans">{selectedInvoice.invoiceNumber} • Régie Publicitaire</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[11px] font-sans">
              <div><strong>Client Partenaire :</strong> {selectedInvoice.partnerName} ({selectedInvoice.contactEmail})</div>
              <div><strong>Campagne :</strong> « {selectedInvoice.title} »</div>
              <div><strong>Lien Cible :</strong> <span className="text-[#008A45] font-mono">{selectedInvoice.targetUrl}</span></div>
              <div><strong>Durée / Pack :</strong> {selectedInvoice.pack}</div>
              <div><strong>Montant Net TTC :</strong> <span className="font-bold text-[#008A45] text-sm font-mono">{formatPrice(selectedInvoice.priceFcfa)}</span></div>
              <div><strong>Mode de Règlement :</strong> {selectedInvoice.paymentMethod} (Statut: <span className="text-emerald-700 font-bold">{selectedInvoice.paymentStatus}</span>)</div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 font-sans">
              <button
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
