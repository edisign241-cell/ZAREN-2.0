'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  User,
  Phone,
  MapPin,
  Award,
  Zap,
  Globe,
  Mail,
  Eye,
  EyeOff,
  Smartphone,
  AlertCircle
} from 'lucide-react';

const COUNTRIES = [
  { code: 'GA', name: 'Gabon 🇬🇦', defaultCity: 'Libreville', prefix: '+241' },
  { code: 'CM', name: 'Cameroun 🇨🇲', defaultCity: 'Douala', prefix: '+237' },
  { code: 'CG', name: 'Congo 🇨🇬', defaultCity: 'Brazzaville', prefix: '+242' },
  { code: 'CD', name: 'RDC 🇨🇩', defaultCity: 'Kinshasa', prefix: '+243' },
  { code: 'TD', name: 'Tchad 🇹🇩', defaultCity: "N'Djaména", prefix: '+235' },
  { code: 'CF', name: 'RCA 🇨🇫', defaultCity: 'Bangui', prefix: '+236' }
];

export default function RegisterModal() {
  const {
    isRegisterModalOpen,
    closeRegisterModal,
    register,
    selectedPlan,
    setSelectedPlan,
    openLoginModal,
    sendOtp,
    verifyOtp
  } = useAuth();

  // Étapes : 1 = Formule, 2 = Profil & Email, 3 = Confirmation OTP SMS
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Champs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Gabon 🇬🇦');
  const [city, setCity] = useState('Libreville');
  const [district, setDistrict] = useState('');
  
  // OTP SMS
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtpDisplay, setGeneratedOtpDisplay] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isRegisterModalOpen) return null;

  // Soumission Étape 2 -> Envoi OTP et passage à l'étape 3
  const handleProceedToOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Veuillez renseigner votre nom et numéro de téléphone.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Veuillez renseigner une adresse email valide.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setIsLoading(true);
    const res = await sendOtp(phone);
    setIsLoading(false);

    if (res.success) {
      setGeneratedOtpDisplay(res.code);
      setStep(3);
    } else {
      setErrorMsg('Erreur lors de l’envoi du SMS. Veuillez vérifier votre numéro.');
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const next = [...otpCode];
    next[index] = val;
    setOtpCode(next);

    if (val && index < 5) {
      const nextInput = document.getElementById(`register-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const fillSimulatedOtp = () => {
    if (generatedOtpDisplay && generatedOtpDisplay.length === 6) {
      setOtpCode(generatedOtpDisplay.split(''));
    }
  };

  // Validation finale du code OTP et Inscription
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const fullCode = otpCode.join('');

    if (fullCode.length < 6) {
      setErrorMsg('Veuillez saisir les 6 chiffres du code SMS reçu.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const isValid = verifyOtp(phone, fullCode);
      if (isValid) {
        register({
          name,
          email,
          password,
          phone,
          country,
          city,
          district: district || 'Centre',
          plan: selectedPlan,
          isPhoneVerified: true
        });
      } else {
        setErrorMsg('Code de sécurité OTP incorrect. Veuillez réessayer.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop sombre flouté */}
      <div
        onClick={closeRegisterModal}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Boîte Modale */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-slide-in">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#111827] to-[#1F2937] text-white relative">
          <button
            onClick={closeRegisterModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008A45]/20 border border-[#008A45]/40 text-[#4ade80] text-xs font-black italic mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ACCÈS SÉCURISÉ ZARÉN</span>
          </div>

          <h2 className="text-xl font-black italic tracking-tight">
            Créer votre compte ZARÉN
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Vendez et achetez en toute confiance avec le séquestre Mobile Money.
          </p>

          {/* Stepper */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-xs font-bold">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition cursor-pointer ${
                step === 1 ? 'bg-[#008A45] text-white' : 'bg-white/10 text-gray-400'
              }`}
            >
              <span>1. Formule</span>
            </button>
            <span className="text-gray-500">→</span>
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition cursor-pointer ${
                step === 2 ? 'bg-[#008A45] text-white' : 'bg-white/10 text-gray-400'
              }`}
            >
              <span>2. Profil & Identité</span>
            </button>
            <span className="text-gray-500">→</span>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition ${
              step === 3 ? 'bg-[#008A45] text-white' : 'bg-white/10 text-gray-400'
            }`}>
              <span>3. Code SMS OTP</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ÉTAPE 1 : CHOIX DE LA FORMULE */}
          {step === 1 && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                Choisissez votre formule d'accès :
              </span>

              {/* CARTE FORMULE 1 : ABONNEMENT PRO */}
              <div
                onClick={() => setSelectedPlan('PRO')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition relative ${
                  selectedPlan === 'PRO'
                    ? 'border-[#008A45] bg-emerald-50/50 shadow-md ring-2 ring-[#008A45]/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#008A45] text-white text-[10px] font-black italic tracking-wide">
                  RECOMMANDÉ COMMERÇANTS
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#008A45] flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black italic text-gray-900">Abonnement Pass Pro</h4>
                      <p className="text-xs text-gray-500">Pour commerçants et boutiques actives</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-[#008A45]">4 500 FCFA</span>
                    <span className="text-[10px] text-gray-400 block">/ mois</span>
                  </div>
                </div>

                <ul className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008A45]" />
                    <span><strong>Publications illimitées</strong> d'articles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008A45]" />
                    <span>Assistant IA <strong>SellerCoach</strong> illimité</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008A45]" />
                    <span>Badge officiel <strong>⭐ Vendeur Vérifié ZARÉN</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008A45]" />
                    <span><strong>Vitrine boutique personnalisée</strong> avec bannière HD</span>
                  </li>
                </ul>
              </div>

              {/* CARTE FORMULE 2 : PAIEMENT À L'ACTE */}
              <div
                onClick={() => setSelectedPlan('PER_LISTING')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                  selectedPlan === 'PER_LISTING'
                    ? 'border-[#008A45] bg-emerald-50/50 shadow-md ring-2 ring-[#008A45]/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold">
                      <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black italic text-gray-900">Vendeur Standard (Style Vinted)</h4>
                      <p className="text-xs text-gray-500">Pour vendeurs occasionnels et acheteurs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-gray-900">500 FCFA</span>
                    <span className="text-[10px] text-gray-400 block">/ annonce publiée</span>
                  </div>
                </div>

                <ul className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008A45]" />
                    <span>Dressing personnel avec <strong>avis & étoiles</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008A45]" />
                    <span>Facturation unitaire de 500 FCFA sans abonnement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008A45]" />
                    <span>Garantie séquestre et retraits Mobile Money instantanés</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition cursor-pointer"
              >
                <span>Continuer vers mes informations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ÉTAPE 2 : INFORMATIONS D'IDENTIFICATION */}
          {step === 2 && (
            <form onSubmit={handleProceedToOtp} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>Nom complet ou Nom de la Boutique *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Marlène Obame"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] focus:ring-2 focus:ring-[#008A45]/20 text-xs font-medium outline-hidden transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>Adresse Email *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="marlene@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-medium outline-hidden transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Mot de passe (min. 6 car.) *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-medium outline-hidden transition"
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
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>Numéro Mobile Money (pour SMS de vérification & séquestre) *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+241 07 45 88 12"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] font-mono text-xs font-bold outline-hidden transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                    <span>Pays *</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      const found = COUNTRIES.find(c => c.name === e.target.value);
                      if (found) setCity(found.defaultCity);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-medium outline-hidden transition bg-white"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Ville *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-medium outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  Quartier / Lieu-dit (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Quartier Louis, Akwa, Batterie IV..."
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#008A45] text-xs font-medium outline-hidden transition"
                />
              </div>

              {/* Récapitulatif formule */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-bold">
                  Formule : {selectedPlan === 'PRO' ? '⭐ Pass Pro (4 500 FCFA/mois)' : '⚡ Standard (500 FCFA/acte)'}
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#008A45] font-black underline cursor-pointer"
                >
                  Changer
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Envoi du code OTP...</span>
                  ) : (
                    <>
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Vérifier mon numéro par SMS →</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ÉTAPE 3 : CONFIRMATION OTP SMS */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4 animate-scale-in">
              
              {/* Simulation SMS Notification */}
              {generatedOtpDisplay && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      <span>SMS ZARÉN reçu sur {phone} :</span>
                    </span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-sm font-black text-[#008A45]">
                      {generatedOtpDisplay}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={fillSimulatedOtp}
                    className="w-full text-[11px] font-bold text-[#008A45] hover:underline text-left cursor-pointer"
                  >
                    ⚡ Cliquez ici pour insérer le code ({generatedOtpDisplay})
                  </button>
                </div>
              )}

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#008A45] flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black italic text-gray-900">
                  Confirmation d'Identité par SMS
                </h3>
                <p className="text-xs text-gray-500">
                  Saisissez le code à 6 chiffres envoyé au <strong className="text-gray-800 font-mono">{phone}</strong>
                </p>
              </div>

              <div className="flex justify-center gap-2 py-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`register-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-mono font-black border-2 border-gray-200 rounded-xl focus:border-[#008A45] focus:bg-emerald-50/40 outline-hidden transition"
                  />
                ))}
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 font-medium leading-relaxed">
                🔒 Cette vérification garantit l'intégrité de vos transactions et protège votre séquestre Mobile Money.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer"
                >
                  Modifier infos
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isLoading ? 'Création du compte...' : 'Confirmer & Rejoindre ZARÉN →'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Vous avez déjà un compte ?</span>
          <button
            onClick={() => {
              closeRegisterModal();
              openLoginModal();
            }}
            className="font-bold text-[#008A45] hover:underline cursor-pointer"
          >
            Se connecter
          </button>
        </div>

      </div>
    </div>
  );
}
