'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import RegisterModal from '@/components/auth/RegisterModal';
import LoginModal from '@/components/auth/LoginModal';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';
import {
  Menu,
  X,
  Store,
  PlusCircle,
  TrendingUp,
  MapPin,
  Heart,
  Wallet,
  ShieldCheck,
  Award,
  Sparkles,
  Settings,
  ShoppingBag,
  MessageCircle,
  LogOut,
  ChevronRight,
  ExternalLink,
  Zap,
  LogIn,
  UserCheck,
  Phone,
  ArrowRight,
  Lock,
  Handshake,
  Star,
  User
} from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, currentUser, logout, isLoginModalOpen, openLoginModal, openRegisterModal } = useAuth();

  // Fermer le menu lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Empêcher le scroll quand le menu est ouvert
  useEffect(() => {
    if (isMenuOpen || isLoginModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isLoginModalOpen]);

  const handleLogoutClick = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Ouvrir le menu principal"
                className="p-2.5 rounded-xl bg-[#F8F8F8] hover:bg-neutral-100 border border-[#E5E5E5] text-[#111111] hover:text-[#008A45] transition active:scale-95 flex items-center gap-2 group cursor-pointer"
              >
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Menu
                </span>
              </button>
            )}

            <Link
              href="/"
              className="flex items-center gap-2.5 select-none group transition-transform active:scale-95"
              title={isLoggedIn ? 'Aller sur Le Marché ZARÉN' : 'Accueil ZARÉN'}
            >
              <div className="h-9 px-2.5 py-1 rounded-xl bg-[#111827] border border-gray-800 shadow-sm flex items-center justify-center group-hover:border-[#008A45] transition-colors">
                <img src="/logo.png" alt="ZARÉN Logo" className="h-6 w-auto object-contain" />
              </div>
              <span className="font-black italic text-lg tracking-tight text-[#111111]">
                ZARÉN
              </span>
            </Link>
          </div>

          {/* Côté Droit : Messagerie, Statut Séquestre & Bouton Connexion si non connecté */}
          <div className="flex items-center gap-2.5">
            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={openRegisterModal}
                  className="px-3 py-2 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition active:scale-95 cursor-pointer"
                >
                  S'inscrire
                </button>
                <button
                  onClick={openLoginModal}
                  className="px-4 py-2 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Connexion</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Raccourci Messagerie Interne avec indicateur */}
                <Link
                  href="/messages"
                  aria-label="Messagerie sécurisée"
                  className="p-2.5 rounded-xl bg-[#F8F8F8] hover:bg-neutral-100 border border-[#E5E5E5] text-[#111111] hover:text-[#008A45] transition relative flex items-center gap-1.5 cursor-pointer"
                  title="Messagerie Interne & Négociations"
                >
                  <MessageCircle className="w-4 h-4 text-[#008A45]" />
                  <span className="text-xs font-bold hidden sm:inline">Messages</span>
                  <span className="w-2 h-2 rounded-full bg-[#008A45] absolute top-1.5 right-1.5"></span>
                </Link>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black italic bg-emerald-50 text-[#008A45] border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">SÉQUESTRE 100% SÉCURISÉ</span>
                  <span className="sm:hidden">SÉQUESTRE</span>
                </span>
              </div>
            )}
          </div>

        </div>
      </header>

      {isMenuOpen && isLoggedIn && (
        <div className="fixed inset-0 z-50 flex animate-fade-in">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-50 overflow-hidden animate-slide-in">
            
            <div className="p-5 bg-[#111827] text-white border-b border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                    <img src="/logo.png" alt="ZARÉN" className="h-5 w-auto object-contain" />
                  </div>
                  <span className="font-black italic text-base tracking-tight">
                    {currentUser?.plan === 'PRO' ? 'ZARÉN PASS PRO ⭐' : 'ZARÉN SÉQUESTRE 🛡️'}
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

              {/* Carte Profil selon état d'authentification */}
              {isLoggedIn && currentUser && (
                <div className="p-3.5 bg-neutral-900/90 rounded-2xl border border-neutral-700/80 space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#008A45] shadow-xs shrink-0">
                        <img
                          src={currentUser.avatar}
                          alt="Profil"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#008A45] border border-black"></span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black italic text-white truncate">
                            {currentUser.account_tier === 'PRO' ? currentUser.businessName : currentUser.name}
                          </h4>
                          <span className="p-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            {currentUser.account_tier === 'PRO' ? <Award className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{currentUser.ratingAvg || 4.9} / 5 ({currentUser.ratingCount || 12} avis)</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block truncate">
                          {currentUser.account_tier === 'PRO'
                            ? '⭐ Pass Pro (4 500 FCFA/mois)'
                            : `👗 ${currentUser.username || '@dressing'} • 500 FCFA / acte`}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/profile/${currentUser.id || 'usr_seller_1'}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-[10px] font-black uppercase flex items-center gap-1 shrink-0 transition cursor-pointer"
                    >
                      <span>Profil</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Solde Séquestre :</span>
                    <span className="text-[#008A45] font-black italic font-mono">
                      🔒 {new Intl.NumberFormat('fr-FR').format(currentUser.escrowBalance)} FCFA
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 divide-y divide-gray-100 text-xs">
              
              {isLoggedIn && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-black italic uppercase tracking-wider text-[#008A45] px-2 block">
                    {currentUser?.account_tier === 'PRO' ? '📊 Espace Vendeur Pro & Boutique' : '👗 Espace Vendeur Standard (Style Vinted)'}
                  </span>

                  {/* LIEN 1 : PROFIL PUBLIC / DRESSING */}
                  <Link
                    href={`/profile/${currentUser?.id || 'usr_seller_1'}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-[#008A45]" />
                      <div>
                        <span className="block font-bold">
                          {currentUser?.account_tier === 'PRO' ? 'Mon Profil Public, Avis & Étoiles' : 'Mon Dressing Public & Avis Reçus'}
                        </span>
                        <span className="text-[10px] text-gray-500 font-normal">
                          {currentUser?.account_tier === 'PRO' ? 'Vitrine officielle, avis certifiés & transactions' : 'Grille 2 colonnes, articles personnels & réputation'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>

                  {/* LIEN 2 : MESSAGERIE INTERNE */}
                  <Link
                    href="/messages"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 text-[#008A45]" />
                      <div>
                        <span className="block font-bold">Messagerie Interne & Négociations</span>
                        <span className="text-[10px] text-gray-500 font-normal">Discussions directes, offres de prix et suivi</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-100 text-[#008A45] px-2 py-0.5 rounded-full">Chat</span>
                  </Link>
                  
                  {/* LIEN 3 : TABLEAU DE BORD (ADAPTÉ AU TIER) */}
                  <Link
                    href="/seller/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between p-2.5 rounded-xl font-bold transition ${pathname === '/seller/dashboard' ? 'bg-emerald-50 text-[#008A45]' : 'text-[#111111] hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-[#008A45]" />
                      <div>
                        <span className="block font-bold">
                          {currentUser?.account_tier === 'PRO' ? 'Tableau de Bord Pro & Analytics' : 'Mes Ventes, Dressing & Séquestre'}
                        </span>
                        <span className="text-[10px] text-gray-500 font-normal">
                          {currentUser?.account_tier === 'PRO' ? 'Performances, ventes, graphiques et retraits' : 'Suivi des colis, déblocage des fonds & dressing'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>

                  {/* LIEN 4 : + VENDRE UN ARTICLE */}
                  <Link
                    href="/seller/new"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <PlusCircle className="w-4 h-4 text-[#008A45]" />
                      <div>
                        <span className="block font-bold">
                          {currentUser?.account_tier === 'PRO' ? 'Publier un Nouvel Article (+ Vendre)' : '+ Vendre un article (500 FCFA)'}
                        </span>
                        <span className="text-[10px] text-gray-500 font-normal">Choix pays, ville, quartier et lieu-dit</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>

                  {/* LIEN 5 : SELLERCOACH (PRO ONLY) OU BANNIERE PASSER EN PRO (STANDARD) */}
                  {currentUser?.account_tier === 'PRO' ? (
                    <Link
                      href="/seller/new"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <div>
                          <span className="block font-bold">SellerCoach — Assistant IA Invisible</span>
                          <span className="text-[10px] text-gray-500 font-normal">Rédaction magique & templates WhatsApp viraux</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">IA</span>
                    </Link>
                  ) : (
                    <Link
                      href="/profile/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl font-bold bg-linear-to-r from-neutral-900 to-neutral-800 text-white hover:opacity-95 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <div>
                          <span className="block font-bold text-xs text-white">⭐ Passer au Pass Pro (4 500 FCFA/mois)</span>
                          <span className="text-[10px] text-gray-300 font-normal">0% commission, vitrine HD & IA illimitée</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-400" />
                    </Link>
                  )}
                </div>
              )}

              {/* SECTION 2 : LE MARCHÉ & NAVIGATION */}
              <div className="space-y-1.5 pt-3">
                <span className="text-[10px] font-black italic uppercase tracking-wider text-gray-500 px-2 block">
                  🛍️ Navigation & Marché
                </span>

                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-gray-700" />
                    <span>Le Grand Marché (Flux en Direct)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  href="/map"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#008A45]" />
                    <span>Carte Interactive des Boutiques</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  href="/saved"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Articles Sauvegardés (Coups de cœur)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>

              {/* SECTION 3 : SÉQUESTRE & PAIEMENTS MOBILE MONEY */}
              <div className="space-y-1.5 pt-3">
                <span className="text-[10px] font-black italic uppercase tracking-wider text-gray-500 px-2 block">
                  💳 Séquestre & Portefeuille Mobile Money
                </span>

                {isLoggedIn && (
                  <Link
                    href="/seller/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-4 h-4 text-[#008A45]" />
                      <div>
                        <span className="block font-bold">Retraits Express & Solde Disponible</span>
                        <span className="text-[10px] text-gray-500 font-normal">Airtel Money & Moov Money instantané</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                )}

                <Link
                  href="/#securite"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="block font-bold">Garantie & Fonctionnement Séquestre</span>
                      <span className="text-[10px] text-gray-500 font-normal">Protection totale vendeur et acheteur</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  href="/#tarifs"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <div>
                      <span className="block font-bold">Abonnement Pass Pro (4 500 FCFA/mois)</span>
                      <span className="text-[10px] text-gray-500 font-normal">0% commission & boost de visibilité</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>

              {/* SECTION 4 : PARAMÈTRES DU COMPTE & GESTION */}
              <div className="space-y-1.5 pt-3">
                <span className="text-[10px] font-black italic uppercase tracking-wider text-gray-500 px-2 block">
                  ⚙️ Paramétrages & Support
                </span>

                {isLoggedIn && (
                  <Link
                    href="/profile/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 text-gray-700" />
                      <div>
                        <span className="block font-bold">Paramètres du Profil & Boutique</span>
                        <span className="text-[10px] text-gray-500 font-normal">Bannière, horaires, adresse et Mobile Money</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                )}

                <a
                  href="https://wa.me/24107458812?text=Bonjour%20Support%20ZAREN%2C%20j%27ai%20besoin%20d%27assistance."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="block font-bold">Assistance WhatsApp 24/7 (Support)</span>
                      <span className="text-[10px] text-gray-500 font-normal">Arbitrage SupportResolver & aide en direct</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>

                {isLoggedIn ? (
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Se déconnecter</span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      openLoginModal();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#008A45] hover:bg-emerald-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <LogIn className="w-4 h-4 text-[#008A45]" />
                      <span>Se connecter</span>
                    </div>
                  </button>
                )}
              </div>

            </div>

            {/* 3. PIED DU MENU HAMBURGER */}
            <div className="p-4 bg-[#F8F8F8] border-t border-[#E5E5E5] flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-bold">
                ZARÉN • Commerce Sécurisé par Séquestre
              </span>
              <span className="text-[10px] font-black text-[#008A45] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Séquestre Garanti
              </span>
            </div>

          </div>
        </div>
      )}

      {/* MODALES D'AUTHENTIFICATION & SÉCURITÉ */}
      <LoginModal />
      <RegisterModal />
      <ForgotPasswordModal />
    </>
  );
}
