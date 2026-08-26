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
  AlertCircle,
  Tag,
  Globe
} from 'lucide-react';
import { CENTRAL_AFRICA_COUNTRIES, CountryConfig, getCountryByCode } from '@/lib/geo/countries';
import confetti from 'canvas-confetti';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAuthLoaded, register, login } = useAuth();

  const [tab, setTab] = useState<'REGISTER' | 'LOGIN'>('REGISTER');
  const [selectedCountryCode, setSelectedCountryCode] = useState('GA');
  const [selectedTier, setSelectedTier] = useState<'BUYER' | 'STANDARD' | 'PRO'>('PRO');

  // Formulaire Inscription
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [city, setCity] = useState('Libreville');
  const [district, setDistrict] = useState('Quartier Louis');

  // Formulaire Connexion
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const country: CountryConfig = getCountryByCode(selectedCountryCode);

  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    const newCountry = getCountryByCode(code);
    setCity(newCountry.defaultCity);
    setDistrict(newCountry.defaultDistrict);
  };

  // Si l'authentification n'a pas encore chargé, écran minimal
  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-2xl bg-[#008A45] text-white flex items-center justify-center font-black text-xl animate-bounce shadow-xl">
          Z
        </div>
        <p className="mt-4 text-xs font-bold text-gray-400 tracking-wider uppercase animate-pulse">
          Chargement de ZARÉN...
        </p>
      </div>
    );
  }

  // Si l'utilisateur est connecté, affichage direct de l'application
  if (isLoggedIn) {
    return <>{children}</>;
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Veuillez renseigner votre nom complet ou nom commercial.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Veuillez renseigner votre numéro de téléphone Mobile Money.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsLoading(true);
    try {
      const plan = selectedTier === 'PRO' ? 'PRO' : selectedTier === 'STANDARD' ? 'PER_LISTING' : 'STANDARD';

      register({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.startsWith('+') ? phone.trim() : `${country.phonePrefix} ${phone.trim()}`,
        country: `${country.name} ${country.flag}`,
        city: city || country.defaultCity,
        district: district || country.defaultDistrict,
        plan,
        isPhoneVerified: true,
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    } catch (err: any) {
      setErrorMsg('Erreur lors de la création du compte. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginIdentifier.trim()) {
      setErrorMsg('Veuillez renseigner votre numéro de téléphone ou email.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Veuillez saisir votre mot de passe.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login({
        identifier: loginIdentifier.trim(),
        password: loginPassword,
      });

      if (!res.success) {
        setErrorMsg(res.message || 'Identifiants incorrects.');
      }
      setIsLoading(false);
    }, 400);
  };

  const handleDemoLogin = (role: 'PRO' | 'STANDARD') => {
    setIsLoading(true);
    if (role === 'PRO') {
      login({
        identifier: '+24107458812',
        phone: '+24107458812',
        name: 'Marlène Obame (Vendeuse Pro)',
      });
    } else {
      login({
        identifier: '+241062334455',
        phone: '+241062334455',
        name: 'Patrick Nguema (Client)',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-900 to-black text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Halos d'ambiance */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#008A45]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#008A45]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar avec Sélecteur de Pays Dynamique */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-4 pt-6 pb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#008A45] to-[#4ade80] flex items-center justify-center shadow-lg shadow-emerald-900/50 shrink-0">
            <span className="font-black italic text-xl text-white tracking-tighter">Z</span>
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-wider text-white">
              ZARÉN
            </h1>
            <p className="text-[10px] text-gray-400">Le Commerce Social Sécurisé par Séquestre Mobile Money</p>
          </div>
        </div>

        {/* Sélecteur de Pays d'Afrique Centrale */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-[#4ade80]" />
            <select
              value={selectedCountryCode}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="bg-transparent text-white text-xs font-bold outline-hidden cursor-pointer"
            >
              {CENTRAL_AFRICA_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-neutral-900 text-white">
                  {c.flag} {c.name} ({c.phonePrefix})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 py-6 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* Colonne Gauche : Présentation contextuelle au Pays */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#008A45]/20 border border-[#008A45]/40 text-[#4ade80] text-xs font-black italic">
            <Sparkles className="w-4 h-4" />
            <span>ACCÈS OBLIGATOIRE MEMBRES & MARCHANDS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tight leading-tight text-white">
            Achetez et Vendez en {country.name} {country.flag} en toute sécurité.
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Pour accéder au Grand Marché ZARÉN, à la carte des boutiques de {country.defaultCity} et publier vos annonces avec séquestre Mobile Money ({country.mobileMoneyOperators.map((o) => o.name).join(', ')}), <strong className="text-white">créez votre compte ou connectez-vous</strong>.
          </p>

          {/* 3 piliers de confiance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#4ade80] flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-white">Séquestre ZARÉN</h4>
              <p className="text-[11px] text-gray-400 mt-1">L'argent reste bloqué jusqu'à vérification de conformité.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-white">Mobile Money Local</h4>
              <p className="text-[11px] text-gray-400 mt-1">
                {country.mobileMoneyOperators.map((o) => o.name).join(' & ')}.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                <Store className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-white">Carte Interactive</h4>
              <p className="text-[11px] text-gray-400 mt-1">Boutiques et dressings à {country.defaultCity}.</p>
            </div>
          </div>

          {/* Découverte rapide */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              ⚡ Découverte rapide (1 clic pour tester) :
            </span>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('PRO')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/15 transition cursor-pointer flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Tester en Vendeur Pro</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('STANDARD')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/15 transition cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tester en Client Acheteur</span>
              </button>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Formulaire d'Accès ZARÉN */}
        <div className="w-full lg:w-1/2 max-w-md bg-white text-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
          
          {/* Onglets Connexion / Inscription */}
          <div className="flex rounded-2xl bg-gray-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setTab('REGISTER');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
                tab === 'REGISTER'
                  ? 'bg-[#008A45] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Créer un compte
            </button>

            <button
              type="button"
              onClick={() => {
                setTab('LOGIN');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
                tab === 'LOGIN'
                  ? 'bg-[#111111] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Se connecter
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* CONTENU ONGLET 1 : CRÉATION DE COMPTE (AVEC CHOIX STRICT DU PROFIL) */}
          {tab === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Sélecteur de Formule : Acheteur Gratuit / Vendeur Standard / Vendeur Pro */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1.5">
                  Type de profil ZARÉN :
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  
                  {/* Option Acheteur Gratuit */}
                  <button
                    type="button"
                    onClick={() => setSelectedTier('BUYER')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                      selectedTier === 'BUYER'
                        ? 'border-[#008A45] bg-emerald-50 text-[#008A45] font-black ring-2 ring-[#008A45]/20'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 mb-0.5 text-[#008A45]" />
                    <span className="text-[10px] font-black block leading-tight">Acheteur</span>
                    <span className="text-[9px] text-gray-500 font-semibold">0 FCFA</span>
                  </button>

                  {/* Option Vendeur Standard */}
                  <button
                    type="button"
                    onClick={() => setSelectedTier('STANDARD')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                      selectedTier === 'STANDARD'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-black ring-2 ring-blue-600/20'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5 mb-0.5 text-blue-600" />
                    <span className="text-[10px] font-black block leading-tight">Standard</span>
                    <span className="text-[9px] text-gray-500 font-semibold">500 F/acte</span>
                  </button>

                  {/* Option Vendeur Pro */}
                  <button
                    type="button"
                    onClick={() => setSelectedTier('PRO')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between relative overflow-hidden ${
                      selectedTier === 'PRO'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-black ring-2 ring-amber-500/20'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="absolute top-0 right-0 bg-amber-400 text-neutral-950 text-[7px] font-black px-1 rounded-bl">
                      Top
                    </span>
                    <Store className="w-3.5 h-3.5 mb-0.5 text-amber-600" />
                    <span className="text-[10px] font-black block leading-tight">Vendeur Pro</span>
                    <span className="text-[9px] text-gray-500 font-semibold">4 500 F/m</span>
                  </button>
                </div>
              </div>

              {/* Nom complet */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#008A45]" />
                  <span>
                    {selectedTier === 'PRO' ? 'Nom complet ou Nom Boutique *' : 'Nom complet *'}
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    selectedTier === 'PRO'
                      ? 'Ex: Marlène Obame ou Chic Store'
                      : 'Ex: Patrick Nguema'
                  }
                  className="w-full text-xs font-semibold px-3.5 py-2.5 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                />
              </div>

              {/* Téléphone & Ville */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#008A45]" />
                    <span>Téléphone *</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-600 shrink-0">
                      {country.phonePrefix}
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07 45 88 12"
                      className="w-full text-xs font-mono font-bold px-3 py-2.5 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#008A45]" />
                    <span>Ville *</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] rounded-xl outline-hidden cursor-pointer"
                  >
                    {country.cities.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quartier & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Quartier</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Ex: Louis, Akwa, Gombe"
                    className="w-full text-xs font-semibold px-3.5 py-2 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] rounded-xl outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Email (optionnel)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@exemple.com"
                    className="w-full text-xs font-medium px-3.5 py-2 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] rounded-xl outline-hidden"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#008A45]" />
                  <span>Créer un mot de passe *</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs font-mono font-bold px-3.5 py-2.5 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden pr-10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Bouton de validation */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <span>Création de votre compte...</span>
                ) : (
                  <>
                    <span>Créer mon compte & Entrer sur ZARÉN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* CONTENU ONGLET 2 : CONNEXION */}
          {tab === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#008A45]" />
                  <span>Téléphone Mobile Money ou Email</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Ex: +241 07 45 88 12"
                  className="w-full text-xs font-bold px-3.5 py-3 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#008A45]" />
                  <span>Mot de passe</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs font-mono font-bold px-3.5 py-3 bg-[#F8F8F8] border border-gray-200 focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden pr-10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <span>Connexion en cours...</span>
                ) : (
                  <>
                    <span>Accéder à mon espace ZARÉN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full px-4 py-4 text-center text-[11px] text-gray-400 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
        <span>© 2026 ZARÉN — Plateforme de Commerce Sécurisé par Séquestre en Afrique Centrale.</span>
        <div className="flex items-center gap-3">
          <span>{country.flag} {country.name}</span>
          <span>•</span>
          <span>🔒 Séquestre Garanti</span>
          <span>•</span>
          <span>Devise : FCFA (XAF)</span>
        </div>
      </footer>

    </div>
  );
}
