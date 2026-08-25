'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Zap,
  ShoppingBag,
  Store,
  Eye,
  EyeOff,
  Mail,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const GABON_CITIES = [
  'Libreville',
  'Port-Gentil',
  'Franceville',
  'Oyem',
  'Moanda',
  'Mouila',
  'Lambaréné',
  'Tchibanga',
  'Koulamoutou',
  'Bitam'
];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAuthLoaded, register, login, setSelectedPlan, selectedPlan } = useAuth();
  
  const [tab, setTab] = useState<'REGISTER' | 'LOGIN'>('REGISTER');
  const [accountType, setAccountType] = useState<'PRO' | 'STANDARD'>('PRO');
  
  // Champs Inscription
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [city, setCity] = useState('Libreville');
  const [district, setDistrict] = useState('Quartier Louis');

  // Champs Connexion
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Si l'authentification n'a pas encore chargé le localStorage, on affiche un loader minimal
  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#008A45] text-white flex items-center justify-center font-black text-xl animate-bounce shadow-xl">
          Z
        </div>
        <p className="mt-4 text-xs font-bold text-gray-400 tracking-wider uppercase animate-pulse">
          Chargement de ZARÉN 2.0...
        </p>
      </div>
    );
  }

  // Si l'utilisateur est déjà connecté, afficher l'application normalement
  if (isLoggedIn) {
    return <>{children}</>;
  }

  // Traitement Inscription obligatoire
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Veuillez renseigner votre nom complet ou nom commercial.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Veuillez renseigner votre numéro de téléphone (Airtel ou Moov).');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsLoading(true);
    try {
      register({
        name: name.trim(),
        email: email.trim() || undefined,
        password,
        phone: phone.trim(),
        country: 'Gabon 🇬🇦',
        city,
        district: district.trim() || 'Centre-ville',
        plan: accountType,
        isPhoneVerified: true
      });

      // Animation confetti de bienvenue
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de la création de votre compte.');
    } finally {
      setIsLoading(false);
    }
  };

  // Traitement Connexion
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginIdentifier.trim()) {
      setErrorMsg('Veuillez saisir votre numéro de téléphone ou email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login({
        identifier: loginIdentifier.trim(),
        phone: loginIdentifier.trim(),
        password: loginPassword
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}
      setIsLoading(false);
    }, 400);
  };

  // Connexion Démo Rapide
  const handleDemoLogin = (role: 'PRO' | 'STANDARD') => {
    setIsLoading(true);
    if (role === 'PRO') {
      login({
        identifier: '+24107458812',
        phone: '+24107458812',
        name: 'Marlène Obame (Vendeuse Pro)'
      });
    } else {
      login({
        identifier: '+241062334455',
        phone: '+241062334455',
        name: 'Patrick Nguema (Client)'
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-neutral-900 to-black text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Halo lumineux d'arrière-plan */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#008A45]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#008A45]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-4 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#008A45] to-[#4ade80] flex items-center justify-center shadow-lg shadow-emerald-900/50">
            <span className="font-black italic text-xl text-white tracking-tighter">Z</span>
          </div>
          <div>
            <h1 className="text-lg font-black italic tracking-wider text-white flex items-center gap-2">
              ZARÉN <span className="text-[#4ade80] text-xs font-bold not-italic px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">2.0 GABON 🇬🇦</span>
            </h1>
            <p className="text-[10px] text-gray-400">Le Commerce Social Sécurisé par Séquestre Mobile Money</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-[#4ade80]" />
          <span>Fonds 100% garantis à la livraison</span>
        </div>
      </header>

      {/* Main Container / Auth Wall */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 py-6 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* Colonne Gauche : Présentation & Avantages */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#008A45]/20 border border-[#008A45]/40 text-[#4ade80] text-xs font-black italic">
            <Sparkles className="w-4 h-4" />
            <span>ACCÈS OBLIGATOIRE MEMBRES & MARCHANDS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tight leading-tight text-white">
            Achetez et Vendez au Gabon en toute sécurité.
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Pour accéder au Grand Marché ZARÉN, à la carte des boutiques de Libreville et publier vos annonces avec séquestre Mobile Money, <strong className="text-white">veuillez créer votre compte ou vous connecter ci-contre</strong>.
          </p>

          {/* 3 piliers de confiance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#4ade80] flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-white">Séquestre ZARÉN</h4>
              <p className="text-[11px] text-gray-400 mt-1">L'argent reste bloqué jusqu'à vérification du colis.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-white">Mobile Money</h4>
              <p className="text-[11px] text-gray-400 mt-1">Paiements & retraits instantanés Airtel & Moov.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                <Store className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-white">Carte Interactive</h4>
              <p className="text-[11px] text-gray-400 mt-1">Localisez les boutiques réelles à Libreville.</p>
            </div>
          </div>

          {/* Boutons d'accès démo rapide */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              ⚡ Découverte rapide (1 clic pour tester) :
            </span>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('PRO')}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>⭐ Tester comme Vendeuse Pro (Marlène)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('STANDARD')}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>🛒 Tester comme Acheteur (Patrick)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Colonne Droite : Formulaire d'Inscription / Connexion */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white text-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            
            {/* Onglets Créer mon compte / Se connecter */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => { setTab('REGISTER'); setErrorMsg(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                  tab === 'REGISTER'
                    ? 'bg-[#008A45] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Créer un compte
              </button>
              <button
                type="button"
                onClick={() => { setTab('LOGIN'); setErrorMsg(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                  tab === 'LOGIN'
                    ? 'bg-[#008A45] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Se connecter
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* FORMULAIRE INSCRIPTION */}
            {tab === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                
                {/* Choix formule Pro vs Standard */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => { setAccountType('PRO'); setSelectedPlan('PRO'); }}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer transition text-left ${
                      accountType === 'PRO'
                        ? 'border-[#008A45] bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">⭐ Compte Pro</span>
                      <span className="text-[10px] bg-[#008A45] text-white px-1.5 py-0.2 rounded font-bold">Top</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">Commerçants, boutiques</p>
                  </div>

                  <div
                    onClick={() => { setAccountType('STANDARD'); setSelectedPlan('STANDARD'); }}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer transition text-left ${
                      accountType === 'STANDARD'
                        ? 'border-[#008A45] bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">🛍️ Standard</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">Acheteurs & dressings</p>
                  </div>
                </div>

                {/* Nom */}
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>Nom complet ou Nom Boutique *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Marlène Obame ou Chic Store LBV"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] focus:ring-2 focus:ring-[#008A45]/20 text-xs font-medium outline-hidden transition bg-gray-50/50"
                  />
                </div>

                {/* Téléphone & Ville */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>Téléphone (Airtel/Moov) *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+241 07 45 88 12"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] font-mono text-xs font-bold outline-hidden transition bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>Ville *</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-medium outline-hidden transition bg-gray-50/50"
                    >
                      {GABON_CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quartier & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>Quartier</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : Quartier Louis, Glass..."
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-medium outline-hidden transition bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>Email (optionnel)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="contact@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-medium outline-hidden transition bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Créer un mot de passe *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-medium outline-hidden transition bg-gray-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition cursor-pointer disabled:opacity-50 mt-2 active:scale-98"
                >
                  {isLoading ? (
                    <span>Création du compte en cours...</span>
                  ) : (
                    <>
                      <span>Créer mon compte & Entrer sur ZARÉN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORMULAIRE CONNEXION */}
            {tab === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>Numéro de téléphone ou Email *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+241 07 45 88 12 ou email@exemple.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-medium outline-hidden transition bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Mot de passe</span>
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-medium outline-hidden transition bg-gray-50/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition cursor-pointer disabled:opacity-50 mt-2 active:scale-98"
                >
                  {isLoading ? (
                    <span>Connexion en cours...</span>
                  ) : (
                    <>
                      <span>Me connecter & Accéder au Marché</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400">
              🛡️ Vos données sont protégées et synchronisées en direct avec Supabase.
            </div>

          </div>
        </div>

      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full px-4 py-4 border-t border-white/10 text-center text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 ZARÉN 2.0 Gabon — Tous droits réservés.</span>
        <span>Séquestre Mobile Money certifié pour marchands et acheteurs.</span>
      </footer>

    </div>
  );
}
