'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import RegisterModal from '@/components/auth/RegisterModal';
import LoginModal from '@/components/auth/LoginModal';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';
import {
  Menu,
  X,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Search,
  PlusCircle,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Award,
  Settings,
  MessageCircle,
  LogOut,
  ChevronRight,
  User,
  LogIn,
  UserPlus
} from 'lucide-react';

import { CENTRAL_AFRICA_COUNTRIES } from '@/lib/geo/countries';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const {
    isLoggedIn,
    currentUser,
    logout,
    openLoginModal,
    openRegisterModal,
    selectedCountry,
    setCountryByCode
  } = useAuth();

  const { cartCount } = useCart();

  // Fermer le menu lors du changement d'URL
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Empêcher le scroll quand le menu coulissant est ouvert
  useEffect(() => {
    if (isMenuOpen && isLoggedIn) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isLoggedIn]);

  const handleLogoutClick = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== '/') {
      router.push(`/?search=${encodeURIComponent(searchVal)}#marche`);
    } else {
      const el = document.getElementById('marche');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* NAVBAR PRINCIPALE ULTRA-ÉPURÉE & MODERNE */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* 1. LOGO ET TITRE ZARÉN */}
          <Link
            href="/"
            className="flex items-center gap-2.5 select-none group transition-transform active:scale-95 shrink-0"
            title="Accueil ZARÉN"
          >
            <div className="h-9 px-2.5 py-1 rounded-xl bg-[#111827] border border-gray-800 shadow-sm flex items-center justify-center group-hover:border-[#008A45] transition-colors">
              <img src="/logo.png" alt="ZARÉN Logo" className="h-6 w-auto object-contain" />
            </div>
            <span className="font-black italic text-xl tracking-tight text-[#111111]">
              ZARÉN
            </span>
          </Link>

          {/* 2. BARRE DE RECHERCHE CENTRALE */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg mx-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un article, une marque, un quartier..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100/90 rounded-full text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#008A45]/30 focus:bg-white transition border border-transparent focus:border-[#008A45] shadow-2xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          {/* 3. RACCOURCIS DROITE : FAVORIS, PANIER & MENU / AUTH */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* FAVORIS (CŒUR) */}
            <Link
              href="/saved"
              className="p-2.5 rounded-full text-gray-700 hover:text-rose-600 hover:bg-rose-50 relative transition active:scale-95"
              title="Articles sauvegardés"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* PANIER D'ACHAT AVEC BADGE ANIMÉ */}
            <Link
              href="/cart"
              className="p-2.5 rounded-full text-gray-700 hover:text-[#008A45] hover:bg-emerald-50 relative transition active:scale-95"
              title="Mon Panier d'achat"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#008A45] text-white font-black text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* SI CONNECTÉ : BOUTON MENU HAMBURGER AVEC AVATAR */}
            {isLoggedIn ? (
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Ouvrir le menu coulissant ZARÉN"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition active:scale-95 cursor-pointer border border-gray-200"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt="Profil"
                  className="w-6 h-6 rounded-full object-cover border border-[#008A45]"
                />
                <span className="text-xs font-bold hidden sm:inline max-w-[70px] truncate">
                  {currentUser?.name?.split(' ')[0]}
                </span>
                <Menu className="w-4 h-4 text-gray-600" />
              </button>
            ) : (
              /* SI NON CONNECTÉ : BOUTON ÉPURÉ CONNEXION / INSCRIPTION SANS MENU COULISSANT */
              <div className="flex items-center gap-1.5">
                <button
                  onClick={openLoginModal}
                  className="px-3.5 py-2 rounded-full border border-gray-300 hover:border-[#008A45] hover:text-[#008A45] transition text-xs font-bold text-gray-700 cursor-pointer"
                >
                  Connexion
                </button>
                <button
                  onClick={openRegisterModal}
                  className="px-4 py-2 rounded-full bg-[#008A45] hover:bg-[#007339] text-white transition text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer active:scale-95"
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* MENU COULISANT (RÉSERVÉ EXCLUSIVEMENT AUX UTILISATEURS CONNECTÉS) */}
      {isMenuOpen && isLoggedIn && currentUser && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in font-sans">
          
          {/* Backdrop semi-transparent */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Panneau coulissant */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-50 overflow-hidden animate-slide-in">
            
            {/* EN-TÊTE DU MENU COULISSANT */}
            <div className="p-4 bg-[#111827] text-white border-b border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                    <img src="/logo.png" alt="ZARÉN" className="h-5 w-auto object-contain" />
                  </div>
                  <span className="font-black italic text-base tracking-tight">
                    ZARÉN
                  </span>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CARTE UTILISATEUR PROFIL */}
              <div className="p-3.5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-[#008A45] shadow-xs shrink-0">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black italic text-white truncate">
                        {currentUser.name}
                      </h4>
                      <span className="p-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {currentUser.account_tier === 'PRO' ? <Award className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono block truncate">
                      {currentUser.username || '@vendeur'} • {currentUser.city || 'Libreville'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      {currentUser.account_tier === 'PRO' ? '⭐ Pass Pro (4 500 FCFA/mois)' : currentUser.account_tier === 'STANDARD' ? '⚡ Vendeur Standard (500 FCFA/acte)' : '🛡️ Acheteur Simple'}
                    </span>
                  </div>
                </div>

                {/* Accès direct Profil & Modification */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800">
                  <Link
                    href={`/profile/${currentUser.id || 'me'}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 px-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-center"
                  >
                    <User className="w-3.5 h-3.5 text-[#008A45]" />
                    <span>Mon Profil</span>
                  </Link>

                  <Link
                    href="/profile/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 px-2.5 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-center shadow-xs"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Modifier profil</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* CORPS DU MENU COULISSANT (SANS "COMMENT ÇA MARCHE" ET SANS "SÉCURITÉ ESCROW") */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              
              {/* RUBRIQUES DE NAVIGATION ESSENTIELLES */}
              <div className="space-y-1">
                <span className="text-[10px] font-black italic uppercase tracking-wider text-gray-400 px-2 block mb-1">
                  Navigation Rapide
                </span>

                {/* 1. LE MARCHÉ */}
                <Link
                  href="/#marche"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl font-bold text-gray-900 hover:bg-gray-100 transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#008A45] flex items-center justify-center group-hover:scale-105 transition">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900">Le Marché</span>
                      <span className="text-[10px] text-gray-500 font-normal">Flux direct de tous les articles et dressings</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition" />
                </Link>

                {/* 2. CARTE BOUTIQUES */}
                <Link
                  href="/map"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl font-bold text-gray-900 hover:bg-gray-100 transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900">Carte Boutiques</span>
                      <span className="text-[10px] text-gray-500 font-normal">Géolocalisation par quartier et lieu-dit</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition" />
                </Link>

                {/* 3. ESPACE VENDEUR */}
                <Link
                  href="/seller/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl font-bold text-gray-900 hover:bg-gray-100 transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900">Espace Vendeur</span>
                      <span className="text-[10px] text-gray-500 font-normal">Gestion des ventes, dressing et solde</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition" />
                </Link>

                {/* 4. MON PANIER */}
                <Link
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl font-bold text-gray-900 hover:bg-gray-100 transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#008A45] flex items-center justify-center group-hover:scale-105 transition">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900">Mon Panier ({cartCount})</span>
                      <span className="text-[10px] text-gray-500 font-normal">Commandes en attente de validation séquestre</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition" />
                </Link>

                {/* 5. MESSAGERIE & NÉGOCIATIONS */}
                <Link
                  href="/messages"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl font-bold text-gray-900 hover:bg-gray-100 transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900">Messagerie & Négociations</span>
                      <span className="text-[10px] text-gray-500 font-normal">Discussions directes avec les acheteurs</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>

              {/* BOUTON D'ACTION DIRECTE + VENDRE */}
              <div className="pt-2">
                <Link
                  href="/seller/new"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition active:scale-98 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Vendre un article (500 FCFA)</span>
                </Link>
              </div>

              {/* SÉLECTEUR DE PAYS DANS LE MENU */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <span className="text-[10px] font-black italic uppercase tracking-wider text-gray-400 px-2 block">
                  Pays & Zone CEMAC (FCFA)
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {CENTRAL_AFRICA_COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setCountryByCode(c.code)}
                      className={`p-2 rounded-xl text-left text-xs flex items-center gap-2 transition cursor-pointer border ${
                        selectedCountry?.code === c.code
                          ? 'border-[#008A45] bg-emerald-50 text-[#008A45] font-bold'
                          : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-base">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* RÉGLAGES DU PROFIL */}
              <div className="pt-3 border-t border-gray-100 space-y-1">
                <Link
                  href="/profile/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl font-bold text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span>Réglages du Profil</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>

            </div>

            {/* PIED DU MENU COULISSANT : DÉCONNEXION */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleLogoutClick}
                className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>DÉCONNEXION</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODALES D'AUTHENTIFICATION ÉPURÉES */}
      <LoginModal />
      <RegisterModal />
      <ForgotPasswordModal />
    </>
  );
}
